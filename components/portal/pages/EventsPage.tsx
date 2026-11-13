"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { attendanceRate, excusesBy, fullName, scopeLabel, type AttendanceStatus, type Chapter, type OrgEvent, type Rsvp } from "../data";
import { usePortal } from "../store";
import { ago, Avatar, Badge, Button, Empty, MemberLink, Modal, PageHead, SearchBox, Tabs, downloadCsv, plural, relDay, time, when } from "../ui";

// Events and attendance. Pick an event: a past one shows its attendance sheet (on time, late,
// excused, missed), which an officer can correct after the fact; one coming up shows who's going
// and any excuses still waiting. Excuses waiting for a decision have their own tab, grouped by
// event, each with the member's attendance and how many excuses they've sent. Live check-in stays
// in the app. The tab, the event and the search live in the address (?tab= ?event= ?q=), so Home
// and a member's record can link straight to "Tyler at Tuesday's meeting".

type Tab = "events" | "excuses";
const MARKS: { id: AttendanceStatus; label: string }[] = [
  { id: "present", label: "On time" },
  { id: "late", label: "Late" },
  { id: "excused", label: "Excused" },
  { id: "absent", label: "Missed" },
];
const pendingIn = (e: OrgEvent) => e.rsvps.filter((r) => r.excuse?.status === "pending").length;
const day = (t: number) => when(t, { weekday: "short", month: "short", day: "numeric" });

export default function EventsPage() {
  const { chapter } = usePortal();
  const router = useRouter();
  const qs = useSearchParams();
  const tab: Tab = qs.get("tab") === "excuses" ? "excuses" : "events";
  const now = Date.now();
  const sorted = [...chapter.events].sort((a, b) => a.startsAt - b.startsAt);
  const upcoming = sorted.filter((e) => e.startsAt >= now);
  const past = sorted.filter((e) => e.startsAt < now).reverse();
  const pending = chapter.events.reduce((n, e) => n + pendingIn(e), 0);
  const [q, setQ] = useState(qs.get("q") ?? "");

  const go = (next: { tab?: Tab; event?: string | null }) => {
    const u = new URLSearchParams(qs.toString());
    if (next.tab) {
      if (next.tab === "excuses") u.set("tab", "excuses");
      else u.delete("tab");
    }
    if (next.event !== undefined) {
      if (next.event) u.set("event", next.event);
      else u.delete("event");
    }
    u.delete("q");
    const s = u.toString();
    router.replace(s ? `/portal/events?${s}` : "/portal/events", { scroll: false });
  };

  const event = chapter.events.find((e) => e.id === qs.get("event")) ?? past[0] ?? upcoming[0];

  return (
    <div className="pt-page">
      <PageHead
        title="Events"
        sub="Pick an event to see who came or who’s going and to fix anyone’s attendance. Excuses wait for you under Excuses."
      />
      <Tabs
        value={tab}
        onChange={(t) => go({ tab: t, event: t === "excuses" ? null : undefined })}
        items={[
          { id: "events", label: "Events" },
          { id: "excuses", label: "Excuses", count: pending },
        ]}
      />
      {tab === "events" ? (
        <div className="pt-two">
          <nav className="pt-card pt-ev-list" aria-label="Events">
            <h3>Coming up</h3>
            {upcoming.length ? (
              upcoming.map((e) => <EventRow key={e.id} e={e} on={e.id === event?.id} onClick={() => go({ event: e.id })} />)
            ) : (
              <p className="pt-muted pt-ev-none">Nothing scheduled. Events are made in the app.</p>
            )}
            <h3>Past</h3>
            {past.map((e) => (
              <EventRow key={e.id} e={e} on={e.id === event?.id} onClick={() => go({ event: e.id })} />
            ))}
          </nav>
          {event ? (
            <Sheet e={event} q={q} setQ={setQ} onExcuses={() => go({ tab: "excuses", event: event.id })} />
          ) : (
            <Empty>No events yet. Make one in the app and its attendance shows here.</Empty>
          )}
        </div>
      ) : (
        <Excuses only={qs.get("event")} onShowAll={() => go({ event: null })} />
      )}
    </div>
  );
}

function EventRow({ e, on, onClick }: { e: OrgEvent; on: boolean; onClick: () => void }) {
  const past = e.startsAt < Date.now();
  const came = e.rsvps.filter((r) => r.attendance === "present" || r.attendance === "late").length;
  const going = e.rsvps.filter((r) => r.status === "going").length;
  const waiting = pendingIn(e);
  return (
    <button type="button" className="pt-ev" aria-current={on} onClick={onClick}>
      <span className="pt-date">
        <small>{when(e.startsAt, { month: "short" })}</small>
        <b>{new Date(e.startsAt).getDate()}</b>
      </span>
      <span className="pt-ev-text">
        <b>{e.title}</b>
        <small>
          {when(e.startsAt, { weekday: "short" })} · {past ? `${Math.round((came / Math.max(1, e.rsvps.length)) * 100)}% came` : `${going} going`}
          {e.mandatory ? " · Required" : ""}
        </small>
        {!past && waiting > 0 && <small className="pt-ev-flag">{plural(waiting, "excuse")} waiting</small>}
      </span>
    </button>
  );
}

type Filter = "all" | AttendanceStatus | "going" | "not_going" | "none" | "waiting";

function Sheet({ e, q, setQ, onExcuses }: { e: OrgEvent; q: string; setQ: (v: string) => void; onExcuses: () => void }) {
  const p = usePortal();
  const c = p.chapter;
  const past = e.startsAt < Date.now();
  const [filter, setFilter] = useState<Filter>("all");
  const member = (id: string) => c.members.find((m) => m.id === id);
  const all = e.rsvps
    .map((r) => ({ r, m: member(r.memberId) }))
    .filter((x) => x.m)
    .sort((a, b) => fullName(a.m!).localeCompare(fullName(b.m!)));
  const matches = (r: Rsvp, f: Filter) =>
    f === "all" ||
    (past ? r.attendance === f : f === "going" ? r.status === "going" : f === "not_going" ? r.status === "not_going" : f === "waiting" ? r.excuse?.status === "pending" : !r.status);
  const needle = q.trim().toLowerCase();
  const rows = all.filter(({ r, m }) => matches(r, filter) && (!needle || fullName(m!).toLowerCase().includes(needle)));
  const count = (f: Filter) => e.rsvps.filter((r) => matches(r, f)).length;
  const total = Math.max(1, e.rsvps.length);
  const audience = e.audienceRoles.length ? scopeLabel(c, e.audienceRoles, []) : "Everyone";
  const waiting = pendingIn(e);
  // Switching events keeps the search but starts the filter over.
  const [seen, setSeen] = useState(e.id);
  if (seen !== e.id) {
    setSeen(e.id);
    setFilter("all");
  }

  const exportCsv = () =>
    downloadCsv(`${e.title} ${when(e.startsAt, { month: "numeric", day: "numeric", year: "numeric" })}.csv`, [
      ["Name", past ? "Attendance" : "RSVP", "Checked in", "Excuse"],
      ...all.map(({ r, m }) => [
        fullName(m!),
        past ? (MARKS.find((x) => x.id === r.attendance)?.label ?? "Not marked") : r.status === "going" ? "Going" : r.status === "not_going" ? "Not going" : "No reply",
        r.checkedInAt ? time(r.checkedInAt) : "",
        r.excuse ? `${r.excuse.category}: ${r.excuse.note} (${r.excuse.status})` : "",
      ]),
    ]);

  const filters: { id: Filter; label: string }[] = past
    ? [{ id: "all", label: "Everyone" }, ...MARKS]
    : [
        { id: "all", label: "Everyone" },
        { id: "going", label: "Going" },
        { id: "not_going", label: "Not going" },
        { id: "none", label: "No reply" },
        ...(e.mandatory ? [{ id: "waiting" as Filter, label: "Excuse waiting" }] : []),
      ];

  return (
    <section className="pt-card pt-sheet">
      <header className="pt-sheet-head">
        <div>
          <h2>{e.title}</h2>
          <p className="pt-muted">
            {when(e.startsAt, { weekday: "long", month: "long", day: "numeric" })} ({relDay(e.startsAt)}) · {time(e.startsAt)} · {e.location}
          </p>
          <p className="pt-muted">
            {e.mandatory ? `Required · check-in within ${e.radiusM} m · late after ${e.lateAfterMin} min` : "Optional"} · {audience}, {plural(e.rsvps.length, "member")}
          </p>
        </div>
        <div className="pt-head-actions">
          {waiting > 0 && (
            <Button kind="primary" onClick={onExcuses}>
              Review {plural(waiting, "excuse")}
            </Button>
          )}
          <Button icon="download" onClick={exportCsv}>
            Export
          </Button>
        </div>
      </header>

      {past && (
        <div className="pt-sum-bar" aria-hidden="true">
          {MARKS.map((mk) => (
            <span key={mk.id} data-k={mk.id} style={{ width: `${(count(mk.id) / total) * 100}%` }} />
          ))}
        </div>
      )}

      <div className="pt-toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Find a member" label="Find a member in this event" />
        <span className="pt-seg pt-seg-tabs pt-filter" role="radiogroup" aria-label="Show">
          {filters.map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={filter === f.id} data-k={f.id} onClick={() => setFilter(f.id)}>
              {past && f.id !== "all" && <i aria-hidden="true" />}
              {f.label} <span className="pt-muted">{count(f.id)}</span>
            </button>
          ))}
        </span>
      </div>

      <div className="pt-table-wrap pt-table-flat">
        <table className="pt-table pt-attendance">
          <thead>
            <tr>
              <th>Member</th>
              <th>{past ? "Attendance" : "RSVP"}</th>
              <th className="pt-hide-s">{past ? "Checked in" : "Excuse"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ r, m }, i) => (
              <tr key={r.memberId}>
                <td>
                  <span className="pt-person">
                    <Avatar name={fullName(m!)} size={28} tone={i} />
                    <MemberLink id={m!.id}>
                      <b>{fullName(m!)}</b>
                    </MemberLink>
                  </span>
                </td>
                <td>
                  {past ? (
                    <span className="pt-seg" role="radiogroup" aria-label={`Attendance for ${fullName(m!)}`}>
                      {MARKS.map((mk) => (
                        <button
                          key={mk.id}
                          type="button"
                          role="radio"
                          aria-checked={r.attendance === mk.id}
                          data-k={mk.id}
                          onClick={() => r.attendance !== mk.id && p.setAttendance(e.id, r.memberId, mk.id)}
                        >
                          {mk.label}
                        </button>
                      ))}
                    </span>
                  ) : r.status === "going" ? (
                    <Badge tone="good">Going</Badge>
                  ) : r.status === "not_going" ? (
                    <Badge tone="neutral">Not going</Badge>
                  ) : (
                    <span className="pt-muted">No reply</span>
                  )}
                </td>
                <td className="pt-hide-s">
                  {past ? (
                    r.checkedInAt ? (
                      <span className="pt-muted">{time(r.checkedInAt)}</span>
                    ) : r.excuse ? (
                      <span className="pt-muted" title={r.excuse.note}>
                        {r.excuse.category} excuse
                      </span>
                    ) : (
                      <span className="pt-muted">Didn’t check in</span>
                    )
                  ) : r.excuse ? (
                    <Badge tone={r.excuse.status === "pending" ? "warn" : r.excuse.status === "approved" ? "good" : "bad"}>
                      {r.excuse.category} · {r.excuse.status === "pending" ? "waiting" : r.excuse.status === "approved" ? "approved" : "denied"}
                    </Badge>
                  ) : (
                    <span className="pt-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <Empty>
            {needle ? `No one called “${q.trim()}” at this event.` : "No one here."}{" "}
            {(needle || filter !== "all") && (
              <button
                type="button"
                className="pt-add pt-inline"
                onClick={() => {
                  setQ("");
                  setFilter("all");
                }}
              >
                Show everyone
              </button>
            )}
          </Empty>
        )}
      </div>
    </section>
  );
}

/** The line that helps decide: their attendance and how many other excuses they've sent this term. */
function excuseContext(c: Chapter, memberId: string, eventId: string) {
  const rate = attendanceRate(c, memberId);
  const others = excusesBy(c, memberId).filter((x) => x.e.id !== eventId);
  const denied = others.filter((x) => x.excuse.status === "rejected").length;
  return [
    rate === null ? "No required events yet" : `${rate}% attendance`,
    others.length ? `${plural(others.length, "other excuse")} this term` : "first excuse this term",
    denied ? `${denied} denied` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function Excuses({ only, onShowAll }: { only: string | null; onShowAll: () => void }) {
  const p = usePortal();
  const c = p.chapter;
  const [show, setShow] = useState<"pending" | "approved" | "rejected">("pending");
  const [deny, setDeny] = useState<{ e: string; m: string } | null>(null);
  const [bulk, setBulk] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const events = c.events
    .filter((e) => !only || e.id === only)
    .map((e) => ({ e, items: e.rsvps.filter((r) => r.excuse && r.excuse.status === show).sort((a, b) => a.excuse!.at - b.excuse!.at) }))
    .filter((x) => x.items.length)
    .sort((a, b) => a.e.startsAt - b.e.startsAt);
  const name = (id: string) => {
    const m = c.members.find((x) => x.id === id);
    return m ? fullName(m) : "A member";
  };
  const count = (s: typeof show) => c.events.filter((e) => !only || e.id === only).reduce((n, e) => n + e.rsvps.filter((r) => r.excuse?.status === s).length, 0);
  const onlyEvent = only ? c.events.find((e) => e.id === only) : null;
  const bulkEvent = bulk ? c.events.find((e) => e.id === bulk) : null;
  const bulkIds = bulkEvent ? bulkEvent.rsvps.filter((r) => r.excuse?.status === "pending").map((r) => r.memberId) : [];

  return (
    <>
      <div className="pt-toolbar">
        <span className="pt-seg pt-seg-tabs" role="radiogroup" aria-label="Show">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button key={s} type="button" role="radio" aria-checked={show === s} onClick={() => setShow(s)}>
              {s === "pending" ? "Waiting" : s === "approved" ? "Approved" : "Denied"} <span className="pt-muted">{count(s)}</span>
            </button>
          ))}
        </span>
        {onlyEvent && (
          <span className="pt-muted">
            Only {onlyEvent.title}, {day(onlyEvent.startsAt)} ·{" "}
            <button type="button" className="pt-add pt-inline" onClick={onShowAll}>
              Show every event
            </button>
          </span>
        )}
      </div>
      {events.length ? (
        events.map(({ e, items }) => (
          <section key={e.id} className="pt-excuse-group" aria-label={`${e.title}, ${day(e.startsAt)}`}>
            <header className="pt-excuse-group-head">
              <h2>
                {e.title} <span className="pt-muted">· {day(e.startsAt)} ({relDay(e.startsAt)})</span>
              </h2>
              <span className="pt-muted">{plural(items.length, show === "pending" ? "excuse waiting" : show === "approved" ? "approved" : "denied", show === "pending" ? "excuses waiting" : undefined)}</span>
              {show === "pending" && items.length > 1 && (
                <Button kind="plain" icon="check" onClick={() => setBulk(e.id)}>
                  Approve all {items.length}
                </Button>
              )}
            </header>
            <ul className="pt-excuses">
              {items.map((r, i) => (
                <li key={`${e.id}-${r.memberId}`} className="pt-card pt-excuse">
                  <Avatar name={name(r.memberId)} size={40} tone={i} />
                  <div className="pt-excuse-text">
                    <MemberLink id={r.memberId}>
                      <b>{name(r.memberId)}</b>
                    </MemberLink>
                    <small>
                      Sent {ago(r.excuse!.at)} · {excuseContext(c, r.memberId, e.id)}
                    </small>
                    <p>
                      <Badge>{r.excuse!.category}</Badge> {r.excuse!.note}
                    </p>
                    {r.excuse!.reviewNote && <p className="pt-muted">Note: {r.excuse!.reviewNote}</p>}
                  </div>
                  {show === "pending" && (
                    <div className="pt-excuse-actions">
                      <Button
                        kind="ghost"
                        onClick={() => {
                          setNote("");
                          setDeny({ e: e.id, m: r.memberId });
                        }}
                      >
                        Deny
                      </Button>
                      <Button kind="primary" icon="check" onClick={() => p.reviewExcuse(e.id, r.memberId, true)}>
                        Approve
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <Empty>
          {show === "pending"
            ? "No excuses waiting. When a member can’t make a required event, their excuse shows up here."
            : show === "approved"
              ? "No approved excuses yet."
              : "No denied excuses yet."}
        </Empty>
      )}

      <Modal
        open={!!bulkEvent}
        onClose={() => setBulk(null)}
        title={bulkEvent ? `Approve all ${bulkIds.length} for ${bulkEvent.title}?` : ""}
        actions={
          <>
            <Button kind="ghost" onClick={() => setBulk(null)}>
              Cancel
            </Button>
            <Button
              kind="primary"
              icon="check"
              onClick={() => {
                if (bulkEvent) p.reviewExcuse(bulkEvent.id, bulkIds, true);
                setBulk(null);
              }}
            >
              Approve {bulkIds.length}
            </Button>
          </>
        }
      >
        <p>{bulkIds.map(name).join(", ")}. They’re excused from {bulkEvent?.title} and it won’t count against their attendance.</p>
      </Modal>

      <Modal
        open={!!deny}
        onClose={() => setDeny(null)}
        title={deny ? `Deny ${name(deny.m)}’s excuse?` : ""}
        actions={
          <>
            <Button kind="ghost" onClick={() => setDeny(null)}>
              Cancel
            </Button>
            <Button
              kind="danger"
              onClick={() => {
                if (deny) p.reviewExcuse(deny.e, deny.m, false, note.trim() || undefined);
                setDeny(null);
              }}
            >
              Deny
            </Button>
          </>
        }
      >
        <p>They’ll be expected at the event, and a miss counts against their attendance.</p>
        <label className="pt-field">
          <span>Note to them (optional)</span>
          <textarea value={note} onChange={(ev) => setNote(ev.target.value)} rows={3} placeholder="Labs can be rescheduled for this one." />
        </label>
      </Modal>
    </>
  );
}
