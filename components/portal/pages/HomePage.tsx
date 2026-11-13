"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { feeFor, fullName, money, owesFee } from "../data";
import { usePortal } from "../store";
import { ago, Avatar, Icon, type IconName, PageHead, plural, relDay, time, until, when } from "../ui";

// Home: what needs an officer today. What changed since they last looked, four numbers that open
// the list behind them, then the things waiting on them, what's coming up, and what the other
// officers did.

const SEEN = "pt-last-seen";
/** When this browser last opened Home (a per-viewer convenience; null the first time). */
function useLastSeen() {
  const [since, setSince] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    let prev: number | null = null;
    try {
      const v = Number(window.localStorage.getItem(SEEN));
      prev = v > 0 ? v : null;
      window.localStorage.setItem(SEEN, String(Date.now()));
    } catch {
      prev = null;
    }
    setSince(prev);
  }, []);
  return since;
}

export default function HomePage() {
  const { chapter } = usePortal();
  const now = Date.now();
  const lastSeen = useLastSeen();
  const [allActivity, setAllActivity] = useState(false);
  const me = chapter.members.find((m) => m.id === chapter.meId)!;
  const name = (id: string) => {
    const m = chapter.members.find((x) => x.id === id);
    return m ? fullName(m) : "A member";
  };

  // Membership fees: collected vs due, and who is overdue.
  let due = 0;
  let collected = 0;
  const overdue = new Map<string, number>();
  for (const f of chapter.fees.filter((x) => x.membership)) {
    for (const m of owesFee(chapter, f)) {
      const s = feeFor(f, m.id);
      due += f.cents;
      collected += s.paid;
      if (s.status === "overdue") overdue.set(m.id, (overdue.get(m.id) ?? 0) + s.left);
    }
  }
  const overdueCents = Array.from(overdue.values()).reduce((a, b) => a + b, 0);

  const pending = chapter.events.flatMap((e) =>
    e.rsvps.filter((r) => r.excuse?.status === "pending").map((r) => ({ e, r }))
  );
  const past = chapter.events.filter((e) => e.startsAt < now).sort((a, b) => b.startsAt - a.startsAt);
  // The last required event the whole org was expected at says more than a four-person officer meeting.
  const last = past.find((e) => e.mandatory && e.audienceRoles.length === 0) ?? past.find((e) => e.mandatory);
  // Excuses waiting, by event, soonest first: "4 for General Meeting on Sat".
  const byEvent = chapter.events
    .map((e) => ({ e, n: e.rsvps.filter((r) => r.excuse?.status === "pending").length }))
    .filter((x) => x.n)
    .sort((a, b) => a.e.startsAt - b.e.startsAt);
  const lastRate = last
    ? Math.round((last.rsvps.filter((r) => r.attendance === "present" || r.attendance === "late").length / Math.max(1, last.rsvps.length)) * 100)
    : null;
  const upcoming = chapter.events.filter((e) => e.startsAt >= now).sort((a, b) => a.startsAt - b.startsAt).slice(0, 4);
  const unreviewed = chapter.security.filter((s) => !s.reviewed);
  const expiring = chapter.codes.filter((c) => c.expiresAt - now < 6 * 3_600_000);
  const roleName = (id: string) => chapter.roles.find((r) => r.id === id)?.name ?? "";

  // What changed since this browser last opened Home (or in the last day, the first time).
  const since = lastSeen ?? now - 86_400_000;
  const paidSince = chapter.fees.flatMap((f) => f.payments.filter((x) => x.at > since));
  const excusesSince = chapter.events.flatMap((e) => e.rsvps.filter((r) => r.excuse && r.excuse.at > since));
  const securitySince = chapter.security.filter((x) => x.at > since);
  const othersSince = chapter.activity.filter((a) => a.at > since && a.who !== fullName(me));
  const joinedSince = chapter.members.filter((m) => new Date(`${m.joined}T12:00:00`).getTime() > since);
  const changes: { text: string; href: string }[] = [
    paidSince.length ? { text: `${plural(paidSince.length, "payment")} (${money(paidSince.reduce((a, b) => a + b.cents, 0))})`, href: "/portal/vouchers" } : null,
    excusesSince.length ? { text: `${plural(excusesSince.length, "new excuse")}`, href: "/portal/events?tab=excuses" } : null,
    securitySince.length ? { text: `${plural(securitySince.length, "screenshot or recording", "screenshots or recordings")}`, href: "/portal/security" } : null,
    joinedSince.length ? { text: `${plural(joinedSince.length, "new member")}`, href: "/portal/members?sort=joined" } : null,
    othersSince.length ? { text: `${plural(othersSince.length, "change")} by other officers`, href: "#activity" } : null,
  ].filter((x): x is { text: string; href: string } => !!x);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const needs: { icon: IconName; text: React.ReactNode; href: string; cta: string; tone?: "bad" }[] = [];
  if (pending.length)
    needs.push({
      icon: "events",
      text: (
        <>
          <b>{plural(pending.length, "excuse")}</b> waiting:{" "}
          {byEvent
            .slice(0, 2)
            .map((x) => `${x.n} for ${x.e.title} ${relDay(x.e.startsAt)}`)
            .join(", ")}
          {byEvent.length > 2 ? `, and ${plural(byEvent.length - 2, "more event")}` : ""}
        </>
      ),
      href: "/portal/events?tab=excuses",
      cta: "Review",
    });
  if (overdue.size)
    needs.push({
      icon: "fees",
      text: (
        <>
          <b>{overdue.size} members</b> are overdue on membership fees, {money(overdueCents)} in all
        </>
      ),
      href: "/portal/vouchers?show=overdue",
      cta: "See who",
      tone: "bad",
    });
  const pollsDue = chapter.polls.filter((p) => p.required && !p.closed && p.closesAt !== null && p.closesAt > now);
  if (pollsDue.length) {
    const p0 = pollsDue[0];
    const did = new Set(p0.options.flatMap((o) => o.voterIds));
    const left = chapter.members.filter((m) => !m.suspended && (p0.audienceRoles.length === 0 || p0.audienceRoles.includes(m.roleId)) && !did.has(m.id)).length;
    needs.push({
      icon: "poll",
      text: (
        <>
          <b>{left} members</b> haven’t voted on “{p0.question}”, which is required and closes {when(p0.closesAt!, { weekday: "short" })}
        </>
      ),
      href: `/portal/polls?p=${p0.id}`,
      cta: "See who",
    });
  }
  if (unreviewed.length)
    needs.push({
      icon: "security",
      text: (
        <>
          <b>{unreviewed.length} screenshots or recordings</b> on secure spaces haven’t been reviewed
        </>
      ),
      href: "/portal/security",
      cta: "Review",
      tone: "bad",
    });
  if (expiring.length)
    needs.push({
      icon: "refresh",
      text: (
        <>
          The <b>{roleName(expiring[0].roleId)}</b> invite code changes in {until(expiring[0].expiresAt)}
          {expiring.length > 1 ? `, and ${expiring.length - 1} more today` : ""}
        </>
      ),
      href: "/portal/roles?tab=codes",
      cta: "Codes",
    });

  return (
    <div className="pt-page">
      <PageHead title={`${greet}, ${me.first}`} sub={`Here’s what needs you at ${chapter.name}.`} />

      {lastSeen !== undefined && (
        <p className="pt-since" aria-live="polite">
          <span className="pt-muted">
            {lastSeen ? `Since you last looked, ${ago(lastSeen)}:` : "In the last 24 hours:"}
          </span>{" "}
          {changes.length
            ? changes.map((x, k) => (
                <span key={x.text}>
                  <Link href={x.href} className="pt-name-link">
                    {x.text}
                  </Link>
                  {k < changes.length - 1 ? " · " : ""}
                </span>
              ))
            : "nothing new."}
        </p>
      )}

      <section className="pt-stats" aria-label="At a glance">
        <Link href="/portal/vouchers" className="pt-stat">
          <span className="pt-stat-label">Membership fees collected</span>
          <b className="pt-stat-num">{money(collected)}</b>
          <span className="pt-stat-line">of {money(due)} due this term</span>
          <span className="pt-meter" aria-hidden="true">
            <span style={{ width: `${Math.round((collected / Math.max(1, due)) * 100)}%` }} />
          </span>
        </Link>
        <Link href="/portal/vouchers?show=overdue" className="pt-stat" data-tone={overdue.size ? "bad" : undefined}>
          <span className="pt-stat-label">Overdue</span>
          <b className="pt-stat-num">{overdue.size}</b>
          <span className="pt-stat-line">{overdue.size ? `members owe ${money(overdueCents)}` : "Everyone is paid up"}</span>
        </Link>
        <Link href="/portal/events?tab=excuses" className="pt-stat">
          <span className="pt-stat-label">Excuses waiting</span>
          <b className="pt-stat-num">{pending.length}</b>
          <span className="pt-stat-line">
            {byEvent.length ? `${byEvent[0].n} for ${byEvent[0].e.title} ${relDay(byEvent[0].e.startsAt)}` : "None waiting"}
          </span>
        </Link>
        {last && (
          <Link href={`/portal/events?event=${last.id}`} className="pt-stat">
            <span className="pt-stat-label">Last {last.title}</span>
            <b className="pt-stat-num">{lastRate}%</b>
            <span className="pt-stat-line">
              showed up, {when(last.startsAt, { weekday: "short", month: "short", day: "numeric" })} ({relDay(last.startsAt)})
            </span>
          </Link>
        )}
      </section>

      <div className="pt-cols">
        <section className="pt-card">
          <h2 className="pt-card-title">Needs you</h2>
          {needs.length ? (
            <ul className="pt-list">
              {needs.map((n, i) => (
                <li key={i} className="pt-need" data-tone={n.tone}>
                  <span className="pt-need-icon">
                    <Icon name={n.icon} />
                  </span>
                  <span className="pt-need-text">{n.text}</span>
                  <Link href={n.href} className="pt-btn" data-kind="plain">
                    {n.cta}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pt-muted">Nothing waiting. Nice.</p>
          )}
        </section>

        <section className="pt-card">
          <h2 className="pt-card-title">Coming up</h2>
          <ul className="pt-list">
            {upcoming.map((e) => {
              const going = e.rsvps.filter((r) => r.status === "going").length;
              const waiting = e.rsvps.filter((r) => r.excuse?.status === "pending").length;
              return (
                <li key={e.id} className="pt-up">
                  <span className="pt-date">
                    <small>{when(e.startsAt, { month: "short" })}</small>
                    <b>{new Date(e.startsAt).getDate()}</b>
                  </span>
                  <span className="pt-up-text">
                    <b>
                      {e.title} {e.mandatory && <span className="pt-tag">Required</span>}
                    </b>
                    <small>
                      {when(e.startsAt, { weekday: "short" })} · {time(e.startsAt)} · {e.location}
                    </small>
                    {waiting > 0 && (
                      <Link href={`/portal/events?tab=excuses&event=${e.id}`} className="pt-name-link pt-up-flag">
                        {plural(waiting, "excuse")} waiting
                      </Link>
                    )}
                  </span>
                  <Link href={`/portal/events?event=${e.id}`} className="pt-up-count" title={`${going} of ${e.rsvps.length} expected are going`}>
                    <b>{going}</b>
                    <small>of {e.rsvps.length} going</small>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="pt-card" id="activity">
        <h2 className="pt-card-title">What officers did</h2>
        <ul className="pt-list">
          {(allActivity ? chapter.activity : chapter.activity.slice(0, 6)).map((a) => (
            <li key={a.id} className="pt-act">
              <Avatar name={a.who} size={30} tone={a.who.length} />
              <span>
                <b>{a.who}</b> {a.what}
                {lastSeen && a.at > lastSeen && a.who !== fullName(me) && <span className="pt-tag">New</span>}
              </span>
              <small title={new Date(a.at).toLocaleString("en-US")}>{ago(a.at)}</small>
            </li>
          ))}
        </ul>
        {chapter.activity.length > 6 && (
          <button type="button" className="pt-add" onClick={() => setAllActivity((v) => !v)}>
            {allActivity ? "Show less" : `Show all ${chapter.activity.length}`}
          </button>
        )}
      </section>
    </div>
  );
}
