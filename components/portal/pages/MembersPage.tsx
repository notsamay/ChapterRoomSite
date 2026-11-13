"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { attendanceRate, excusesBy, feeFor, fullName, money, owesFee, type Chapter, type Member } from "../data";
import { usePortal } from "../store";
import { ago, Avatar, Badge, Button, Check, Drawer, Empty, Icon, Modal, PageHead, SearchBox, downloadCsv, plural, when } from "../ui";

// Members: the whole roster in one table. Search and filter, sort by any column, select any number
// of rows, then change their role, add them to a group, suspend them (with a reason) or remove them.
// Click a row for that member's record: role, groups, attendance, excuses and payments, each linking
// to the page where it can be changed. The filters and the open member live in the address
// (?role= ?group= ?status= ?q= ?m=), so any page can link straight to a member or a filtered list.

type Status = "all" | "active" | "suspended" | "overdue" | "low";
type SortKey = "name" | "role" | "attendance" | "fees" | "joined";
const LOW = 70; // attendance under this shows red, and is what "Low attendance" filters on

function feeSummary(c: Chapter, m: Member) {
  let left = 0;
  let overdue = 0;
  let owed = 0;
  for (const f of c.fees.filter((x) => x.membership)) {
    if (!owesFee(c, f).some((x) => x.id === m.id)) continue;
    owed += 1;
    const s = feeFor(f, m.id);
    left += s.left;
    if (s.status === "overdue") overdue += s.left;
  }
  return { owed, left, overdue };
}

export default function MembersPage() {
  const p = usePortal();
  const c = p.chapter;
  const router = useRouter();
  const qs = useSearchParams();
  const [q, setQ] = useState(qs.get("q") ?? "");
  const [role, setRole] = useState(qs.get("role") ?? "all");
  const [group, setGroup] = useState(qs.get("group") ?? "all");
  const [status, setStatus] = useState<Status>((qs.get("status") as Status) ?? "all");
  // ?sort=joined (from Home's "new members") shows the newest first.
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>(qs.get("sort") === "joined" ? { key: "joined", dir: -1 } : { key: "role", dir: 1 });
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [ask, setAsk] = useState<null | "suspend" | "remove">(null);
  const [reason, setReason] = useState("");
  const [askIds, setAskIds] = useState<string[]>([]);
  const [move, setMove] = useState<string | null>(null); // role picked in the bulk bar, waiting for a yes

  // The open member is ?m=<id>, so Back closes the panel and other pages can link here.
  const open = qs.get("m");
  const setOpen = (id: string | null) => {
    const next = new URLSearchParams(qs.toString());
    if (id) next.set("m", id);
    else next.delete("m");
    const s = next.toString();
    router.replace(s ? `/portal/members?${s}` : "/portal/members", { scroll: false });
  };

  const rank = (id: string) => c.roles.find((r) => r.id === id)?.rank ?? 99999;
  const roleName = (id: string) => c.roles.find((r) => r.id === id)?.name ?? "";
  const groupName = (id: string) => c.groups.find((g) => g.id === id)?.name ?? "";

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const by: Record<SortKey, (a: Member, b: Member) => number> = {
      name: (a, b) => fullName(a).localeCompare(fullName(b)),
      role: (a, b) => rank(a.roleId) - rank(b.roleId),
      // Members with no required events yet sort last either way.
      attendance: (a, b) => (attendanceRate(c, a.id) ?? 999 * sort.dir) - (attendanceRate(c, b.id) ?? 999 * sort.dir),
      fees: (a, b) => feeSummary(c, a).overdue - feeSummary(c, b).overdue || feeSummary(c, a).left - feeSummary(c, b).left,
      joined: (a, b) => a.joined.localeCompare(b.joined),
    };
    return c.members
      .filter((m) => !needle || fullName(m).toLowerCase().includes(needle) || m.email.includes(needle))
      .filter((m) => role === "all" || m.roleId === role)
      .filter((m) => group === "all" || m.groups.includes(group))
      .filter((m) => {
        if (status === "active") return !m.suspended;
        if (status === "suspended") return m.suspended;
        if (status === "overdue") return feeSummary(c, m).overdue > 0;
        if (status === "low") return (attendanceRate(c, m.id) ?? 100) < LOW;
        return true;
      })
      .sort((a, b) => by[sort.key](a, b) * sort.dir || fullName(a).localeCompare(fullName(b)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c, q, role, group, status, sort]);

  const selected = rows.filter((m) => sel.has(m.id)).map((m) => m.id);
  const allOn = rows.length > 0 && selected.length === rows.length;
  const toggle = (id: string, on: boolean) =>
    setSel((s) => {
      const n = new Set(s);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });
  const clear = () => setSel(new Set());
  const anySuspended = selected.some((id) => c.members.find((m) => m.id === id)?.suspended);
  const filtered = q.trim() !== "" || role !== "all" || group !== "all" || status !== "all";

  const exportCsv = () =>
    downloadCsv(`${c.name} members.csv`, [
      ["First name", "Last name", "Email", "Role", "Groups", "Status", "Attendance %", "Membership fees left", "Joined"],
      ...rows.map((m) => [
        m.first,
        m.last,
        m.email,
        roleName(m.roleId),
        m.groups.map(groupName).join("; "),
        m.suspended ? "Suspended" : "Active",
        attendanceRate(c, m.id) ?? "",
        (feeSummary(c, m).left / 100).toFixed(2),
        m.joined,
      ]),
    ]);

  const startAsk = (kind: "suspend" | "remove", ids: string[]) => {
    setAskIds(ids);
    setReason("");
    setAsk(kind);
  };
  const member = open ? c.members.find((m) => m.id === open) : null;
  const ranked = [...c.roles].sort((a, b) => a.rank - b.rank);

  // What a bulk move does, in words, before it happens: who moves from where, and which role-only
  // groups they leave on the way (role-only groups follow the role).
  const moveSummary = (() => {
    if (!move) return null;
    const people = selected.map((id) => c.members.find((m) => m.id === id)!).filter((m) => m.roleId !== move);
    const from = Array.from(new Set(people.map((m) => roleName(m.roleId))));
    const leaving = Array.from(
      new Set(people.flatMap((m) => m.groups.filter((g) => { const grp = c.groups.find((x) => x.id === g); return grp?.roleId && grp.roleId !== move; })))
    ).map(groupName);
    return { people, from, leaving };
  })();

  const sortHead = (key: SortKey, label: string, className?: string) => (
    <th className={className} aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}>
      <button type="button" className="pt-sort" data-on={sort.key === key} onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))}>
        {label}
        <span aria-hidden="true">{sort.key === key ? (sort.dir === 1 ? "↑" : "↓") : ""}</span>
      </button>
    </th>
  );

  return (
    <div className="pt-page">
      <PageHead
        title="Members"
        sub={`${plural(c.members.filter((m) => !m.suspended).length, "active member")}${c.members.some((m) => m.suspended) ? `, ${c.members.filter((m) => m.suspended).length} suspended` : ""}. Click anyone for their attendance and payments, or tick rows to change many at once.`}
      >
        <Button icon="download" onClick={exportCsv}>
          Export CSV
        </Button>
        <Link href="/portal/roles?tab=codes" className="pt-btn" data-kind="primary">
          <Icon name="plus" size={18} /> Invite
        </Link>
      </PageHead>

      <div className="pt-toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search by name or email" label="Search members" />
        <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role">
          <option value="all">All roles</option>
          {ranked.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <select value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Group">
          <option value="all">All groups</option>
          {c.groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Status">
          <option value="all">Everyone</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="overdue">Overdue on fees</option>
          <option value="low">Attendance under {LOW}%</option>
        </select>
        <span className="pt-muted">
          {rows.length === c.members.length ? `${rows.length} members` : `${rows.length} of ${c.members.length} shown`}
        </span>
        {filtered && (
          <Button
            kind="ghost"
            onClick={() => {
              setQ("");
              setRole("all");
              setGroup("all");
              setStatus("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {selected.length > 0 && (
        <div className="pt-bulk" role="region" aria-label="Selected members">
          <b>{selected.length} selected</b>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) setMove(e.target.value);
            }}
            aria-label="Change role"
          >
            <option value="">Change role…</option>
            {ranked
              .filter((r) => !r.probation)
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
          </select>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) p.addMembersToGroup(selected, e.target.value);
            }}
            aria-label="Add to group"
          >
            <option value="">Add to group…</option>
            {c.groups
              .filter((g) => !g.roleId)
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
          </select>
          {anySuspended ? (
            <Button onClick={() => p.reinstateMembers(selected)}>Reinstate</Button>
          ) : (
            <Button kind="danger" onClick={() => startAsk("suspend", selected)}>
              Suspend
            </Button>
          )}
          <Button kind="danger" onClick={() => startAsk("remove", selected)}>
            Remove
          </Button>
          <Button kind="ghost" onClick={clear}>
            Clear
          </Button>
        </div>
      )}

      <div className="pt-table-wrap">
        <table className="pt-table">
          <thead>
            <tr>
              <th className="pt-col-check">
                <Check
                  checked={allOn}
                  indeterminate={selected.length > 0 && !allOn}
                  onChange={(v) => setSel(v ? new Set(rows.map((m) => m.id)) : new Set())}
                  label="Select all shown"
                />
              </th>
              {sortHead("name", "Name")}
              {sortHead("role", "Role")}
              <th className="pt-hide-s">Groups</th>
              {sortHead("attendance", "Attendance")}
              {sortHead("fees", "Membership fees")}
              {sortHead("joined", "Joined", "pt-hide-s pt-hide-m")}
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => {
              const rate = attendanceRate(c, m.id);
              const fee = feeSummary(c, m);
              return (
                <tr key={m.id} data-on={sel.has(m.id)} onClick={() => setOpen(m.id)}>
                  <td className="pt-col-check" onClick={(e) => e.stopPropagation()}>
                    <Check checked={sel.has(m.id)} onChange={(v) => toggle(m.id, v)} label={`Select ${fullName(m)}`} />
                  </td>
                  <td>
                    <span className="pt-person">
                      <Avatar name={fullName(m)} size={32} tone={i} />
                      <span>
                        <b>
                          {fullName(m)}
                          {m.id === c.meId && <span className="pt-you">You</span>}
                        </b>
                        {m.email && <small>{m.email}</small>}
                      </span>
                    </span>
                  </td>
                  <td>{m.suspended ? <Badge tone="bad">Suspended</Badge> : <Badge tone="dark">{roleName(m.roleId)}</Badge>}</td>
                  <td className="pt-hide-s">
                    <span className="pt-chips" title={m.groups.map(groupName).join(", ")}>
                      {m.groups.slice(0, 2).map((g) => (
                        <span key={g} className="pt-chip">
                          {groupName(g)}
                        </span>
                      ))}
                      {m.groups.length > 2 && <span className="pt-chip pt-chip-more">+{m.groups.length - 2}</span>}
                    </span>
                  </td>
                  <td>
                    {rate === null ? (
                      <span className="pt-muted" title="No required events yet">
                        —
                      </span>
                    ) : (
                      <span className="pt-rate" data-low={rate < LOW}>
                        <span className="pt-meter" aria-hidden="true">
                          <span style={{ width: `${rate}%` }} />
                        </span>
                        {rate}%
                      </span>
                    )}
                  </td>
                  <td>
                    {fee.owed === 0 ? (
                      <span className="pt-muted" title="No membership fee applies to them">
                        —
                      </span>
                    ) : fee.overdue ? (
                      <Badge tone="bad">{money(fee.overdue)} overdue</Badge>
                    ) : fee.left ? (
                      <Badge tone="warn">{money(fee.left)} left</Badge>
                    ) : (
                      <Badge tone="good">Paid</Badge>
                    )}
                  </td>
                  <td className="pt-hide-s pt-hide-m pt-muted pt-nowrap">{when(new Date(m.joined).getTime(), { month: "short", year: "numeric" })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <Empty>No one matches those filters.</Empty>}
      </div>

      <Drawer
        open={!!member}
        onClose={() => setOpen(null)}
        title={member ? fullName(member) : ""}
        sub={member ? `${member.suspended ? "Suspended" : roleName(member.roleId)} · joined ${when(new Date(member.joined).getTime(), { month: "long", year: "numeric" })}` : ""}
      >
        {member && <MemberDetail m={member} onAsk={(k) => startAsk(k, [member.id])} />}
      </Drawer>

      <Modal
        open={!!moveSummary}
        onClose={() => setMove(null)}
        title={moveSummary ? `Move ${moveSummary.people.length === 1 ? fullName(moveSummary.people[0]) : `${moveSummary.people.length} members`} to ${roleName(move!)}?` : ""}
        actions={
          <>
            <Button kind="ghost" onClick={() => setMove(null)}>
              Cancel
            </Button>
            <Button
              kind="primary"
              disabled={!moveSummary?.people.length}
              onClick={() => {
                if (move && moveSummary) p.setMembersRole(moveSummary.people.map((m) => m.id), move);
                setMove(null);
                clear();
              }}
            >
              Move {moveSummary?.people.length ?? 0}
            </Button>
          </>
        }
      >
        {moveSummary && (
          <>
            <p>
              {moveSummary.people.length
                ? `From ${moveSummary.from.join(", ")}. They get what ${roleName(move!)} can do and see straight away.`
                : `Everyone selected is already ${roleName(move!)}.`}
            </p>
            {moveSummary.leaving.length > 0 && <p>They leave {moveSummary.leaving.join(", ")}, which only {moveSummary.leaving.length === 1 ? "its role" : "their roles"} can be in.</p>}
            {selected.length > moveSummary.people.length && moveSummary.people.length > 0 && (
              <p>{plural(selected.length - moveSummary.people.length, "person is", "people are")} already {roleName(move!)} and stay as they are.</p>
            )}
          </>
        )}
      </Modal>

      <Modal
        open={ask === "suspend"}
        onClose={() => setAsk(null)}
        title={askIds.length === 1 ? `Suspend ${fullName(c.members.find((m) => m.id === askIds[0])!)}?` : `Suspend ${askIds.length} members?`}
        actions={
          <>
            <Button kind="ghost" onClick={() => setAsk(null)}>
              Cancel
            </Button>
            <Button
              kind="danger"
              disabled={!reason.trim()}
              onClick={() => {
                p.suspendMembers(askIds, reason.trim());
                setAsk(null);
                clear();
              }}
            >
              Suspend
            </Button>
          </>
        }
      >
        <p>They keep their account but can’t post, send messages or RSVP until you reinstate them. The reason is saved with the suspension.</p>
        <label className="pt-field">
          <span>Reason</span>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Missed three mandatory events without an excuse" />
        </label>
      </Modal>

      <Modal
        open={ask === "remove"}
        onClose={() => setAsk(null)}
        title={askIds.length === 1 ? `Remove ${fullName(c.members.find((m) => m.id === askIds[0]) ?? c.members[0])}?` : `Remove ${askIds.length} members?`}
        actions={
          <>
            <Button kind="ghost" onClick={() => setAsk(null)}>
              Cancel
            </Button>
            <Button
              kind="danger"
              onClick={() => {
                p.removeMembers(askIds);
                setAsk(null);
                setOpen(null);
                clear();
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p>They leave every chat, feed, album and group in the org at once. To come back they’ll need a new invite code.</p>
      </Modal>
    </div>
  );
}

function MemberDetail({ m, onAsk }: { m: Member; onAsk: (k: "suspend" | "remove") => void }) {
  const p = usePortal();
  const c = p.chapter;
  const now = Date.now();
  const ranked = [...c.roles].sort((a, b) => a.rank - b.rank).filter((r) => !r.probation);
  const past = c.events.filter((e) => e.startsAt < now && e.rsvps.some((r) => r.memberId === m.id)).sort((a, b) => b.startsAt - a.startsAt);
  const ahead = c.events.filter((e) => e.startsAt >= now && e.rsvps.some((r) => r.memberId === m.id)).sort((a, b) => a.startsAt - b.startsAt);
  const STATUS: Record<string, [string, "good" | "warn" | "bad" | "neutral"]> = {
    present: ["On time", "good"],
    late: ["Late", "warn"],
    excused: ["Excused", "neutral"],
    absent: ["Missed", "bad"],
  };
  const fees = c.fees.filter((f) => f.membership && owesFee(c, f).some((x) => x.id === m.id));
  const bought = c.fees.filter((f) => !f.membership && f.payments.some((x) => x.memberId === m.id));
  const rate = attendanceRate(c, m.id);
  const excuses = excusesBy(c, m.id);
  const name = encodeURIComponent(fullName(m));

  return (
    <div className="pt-detail">
      {m.suspended && m.suspendReason && (
        <div className="pt-note" data-tone="bad">
          <b>Suspended.</b> {m.suspendReason}
        </div>
      )}
      {m.email && <section className="pt-contact">
        <a href={`mailto:${m.email}`} className="pt-name-link">
          {m.email}
        </a>
        <button
          type="button"
          className="pt-add"
          onClick={() => {
            navigator.clipboard?.writeText(m.email).catch(() => {});
            p.toast("Email copied");
          }}
        >
          <Icon name="copy" size={16} /> Copy
        </button>
      </section>}
      <section>
        <h3>Role</h3>
        <select value={m.roleId} onChange={(e) => p.setMembersRole([m.id], e.target.value)} disabled={m.suspended} aria-label="Role">
          {ranked.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {m.suspended && <small className="pt-muted pt-hint">Reinstate them to change their role.</small>}
      </section>
      <section>
        <h3>Groups</h3>
        <div className="pt-chips pt-chips-pick">
          {c.groups.map((g) => {
            const inIt = m.groups.includes(g.id);
            const locked = !!g.roleId && g.roleId !== m.roleId;
            return (
              <button
                key={g.id}
                type="button"
                className="pt-chip"
                aria-pressed={inIt}
                disabled={locked}
                title={locked ? `${c.roles.find((r) => r.id === g.roleId)?.name} only` : undefined}
                onClick={() => (inIt ? p.removeMembersFromGroup([m.id], g.id) : p.addMembersToGroup([m.id], g.id))}
              >
                {inIt && <Icon name="check" size={14} />}
                {g.name}
              </button>
            );
          })}
        </div>
      </section>
      <section>
        <h3>
          Attendance{" "}
          {rate !== null && (
            <span className="pt-muted">
              · {rate}% at required events · {excuses.length ? plural(excuses.length, "excuse") : "no excuses"} this term
            </span>
          )}
        </h3>
        {ahead.length > 0 && (
          <ul className="pt-mini">
            {ahead.map((e) => {
              const rs = e.rsvps.find((r) => r.memberId === m.id)!;
              const ex = rs.excuse;
              return (
                <li key={e.id}>
                  <Link href={`/portal/events?event=${e.id}&q=${name}`} className="pt-mini-link">
                    {e.title}
                    <small>
                      {when(e.startsAt, { weekday: "short", month: "short", day: "numeric" })} · coming up{e.mandatory ? " · required" : ""}
                    </small>
                  </Link>
                  {ex ? (
                    ex.status === "pending" ? (
                      <Link href={`/portal/events?tab=excuses&event=${e.id}`} className="pt-btn" data-kind="plain">
                        Review excuse
                      </Link>
                    ) : (
                      <Badge tone={ex.status === "approved" ? "neutral" : "bad"}>{ex.status === "approved" ? "Excused" : "Excuse denied"}</Badge>
                    )
                  ) : rs.status === "going" ? (
                    <Badge tone="good">Going</Badge>
                  ) : rs.status === "not_going" ? (
                    <Badge>Not going</Badge>
                  ) : (
                    <span className="pt-muted">No reply</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {past.length ? (
          <ul className="pt-mini">
            {past.map((e) => {
              const rs = e.rsvps.find((r) => r.memberId === m.id)!;
              const [label, tone] = STATUS[rs.attendance ?? ""] ?? ["Not marked", "neutral"];
              return (
                <li key={e.id}>
                  <Link href={`/portal/events?event=${e.id}&q=${name}`} className="pt-mini-link" title="Open the attendance sheet to change this">
                    {e.title}
                    <small>{when(e.startsAt, { weekday: "short", month: "short", day: "numeric" })}</small>
                  </Link>
                  <Badge tone={tone}>{label}</Badge>
                </li>
              );
            })}
          </ul>
        ) : (
          ahead.length === 0 && <p className="pt-muted">No events yet.</p>
        )}
      </section>
      <section>
        <h3>Payments</h3>
        {fees.length || bought.length ? (
          <ul className="pt-mini">
            {fees.map((f) => {
              const s = feeFor(f, m.id);
              const last = (f.reminders ?? []).find((r) => r.memberIds.includes(m.id));
              return (
                <li key={f.id}>
                  <Link href={`/portal/vouchers?v=${f.id}`} className="pt-mini-link">
                    {f.title}
                    <small>
                      {money(s.paid)} of {money(f.cents)} paid · due {when(f.dueAt)}
                      {s.status !== "paid" && last ? ` · reminded ${ago(last.at)}` : ""}
                    </small>
                  </Link>
                  <span className="pt-row-actions">
                    {s.status === "paid" ? <Badge tone="good">Paid</Badge> : s.status === "overdue" ? <Badge tone="bad">{money(s.left)} overdue</Badge> : <Badge tone="warn">{money(s.left)} left</Badge>}
                    {s.status !== "paid" && !m.suspended && (
                      <Button kind="ghost" icon="bell" title={`Remind ${m.first} about ${f.title}`} onClick={() => p.remind(f.id, [m.id])} />
                    )}
                  </span>
                </li>
              );
            })}
            {bought.map((f) => {
              const paid = f.payments.filter((x) => x.memberId === m.id);
              return (
                <li key={f.id}>
                  <Link href={`/portal/vouchers?v=${f.id}`} className="pt-mini-link">
                    {f.title}
                    <small>
                      Bought {when(paid[paid.length - 1].at)} by {paid[paid.length - 1].method}
                    </small>
                  </Link>
                  <Badge tone="good">{money(paid.reduce((s, x) => s + x.cents, 0))}</Badge>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="pt-muted">Nothing owed or bought.</p>
        )}
      </section>
      {m.id !== c.meId && (
        <section className="pt-detail-actions">
          {m.suspended ? <Button onClick={() => p.reinstateMembers([m.id])}>Reinstate</Button> : <Button kind="danger" onClick={() => onAsk("suspend")}>Suspend</Button>}
          <Button kind="danger" onClick={() => onAsk("remove")}>
            Remove from org
          </Button>
        </section>
      )}
    </div>
  );
}
