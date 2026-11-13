"use client";

import Link from "next/link";
import { useState } from "react";
import { effectivePowers, feedReach, fullName } from "../data";
import { usePortal } from "../store";
import { ago, Avatar, Badge, Button, Drawer, Empty, Icon, MemberLink, PageHead, plural, when, time } from "../ui";

// Click an entry for what was on their screen at that moment (the frame the app kept), with the
// details and Mark reviewed.
// Security: the log of screenshots and screen recordings on secure chats, feeds and albums (the app
// records them on medium and high security), and who can open this portal. Each entry links to the member, and a feed links to who can see it.

const WHAT = {
  screenshot_taken: { label: "Took a screenshot", icon: "camera" as const },
  recording_started: { label: "Started a screen recording", icon: "record" as const },
  screenshot_attempted: { label: "Tried to screenshot, blocked", icon: "lock" as const },
};

export default function SecurityPage() {
  const p = usePortal();
  const c = p.chapter;
  const [only, setOnly] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const rows = c.security.filter((s) => !only || !s.reviewed).sort((a, b) => b.at - a.at);
  const unreviewed = c.security.filter((s) => !s.reviewed).map((s) => s.id);
  const name = (id: string) => {
    const m = c.members.find((x) => x.id === id);
    return m ? fullName(m) : "Former member";
  };
  const roleOf = (id: string) => {
    const m = c.members.find((x) => x.id === id);
    return m ? (m.suspended ? "Suspended" : c.roles.find((r) => r.id === m.roleId)?.name) : undefined;
  };
  const admins = c.members.filter((m) => !m.suspended && effectivePowers(c, m.roleId).has("dashboard_access"));
  const adminRoles = [...c.roles].filter((r) => effectivePowers(c, r.id).has("dashboard_access")).sort((a, b) => a.rank - b.rank);

  return (
    <div className="pt-page">
      <PageHead title="Security" sub="Screenshots and screen recordings in chats, feeds and albums set to Medium or Max security, and who can open this portal.">
        <Button icon="check" disabled={!unreviewed.length} onClick={() => p.markReviewed(unreviewed)}>
          Mark all reviewed
        </Button>
      </PageHead>

      <div className="pt-split">
        <section className="pt-card pt-sheet">
          <header className="pt-sheet-head">
            <h2>Security log</h2>
            <span className="pt-seg pt-seg-tabs" role="radiogroup" aria-label="Show">
              <button type="button" role="radio" aria-checked={only} onClick={() => setOnly(true)}>
                Not reviewed {unreviewed.length ? `(${unreviewed.length})` : ""}
              </button>
              <button type="button" role="radio" aria-checked={!only} onClick={() => setOnly(false)}>
                Everything
              </button>
            </span>
          </header>
          {rows.length ? (
            <ul className="pt-log">
              {rows.map((s) => {
                const feed = c.feeds.find((f) => f.name === s.where);
                return (
                <li
                  key={s.id}
                  data-reviewed={s.reviewed}
                  className="pt-log-row"
                  tabIndex={0}
                  onClick={() => setOpen(s.id)}
                  onKeyDown={(e) => e.key === "Enter" && setOpen(s.id)}
                  aria-label={`${name(s.memberId)} ${WHAT[s.type].label.toLowerCase()}, ${s.where}. Open`}
                >
                  {s.capture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="pt-log-thumb" src={s.capture} alt="" loading="lazy" />
                  ) : (
                    <span className="pt-log-icon" data-level={s.level}>
                      <Icon name={WHAT[s.type].icon} />
                    </span>
                  )}
                  <span className="pt-log-text">
                    <b>
                      <MemberLink id={s.memberId}>{name(s.memberId)}</MemberLink>
                      {roleOf(s.memberId) && <span className="pt-log-what"> ({roleOf(s.memberId)})</span>}{" "}
                      <span className="pt-log-what">{WHAT[s.type].label.toLowerCase()}</span>
                    </b>
                    <small>
                      {feed ? (
                        <Link href={`/portal/roles?tab=feeds&f=${feed.id}`} className="pt-name-link" title="Who can see this feed" onClick={(e) => e.stopPropagation()}>
                          {s.where} ({plural(feedReach(c, feed, "view").length, "viewer")})
                        </Link>
                      ) : (
                        s.where
                      )}{" "}
                      · {s.device} · {when(s.at, { month: "short", day: "numeric" })} at {time(s.at)} ({ago(s.at)})
                    </small>
                  </span>
                  <Badge tone={s.level === "high" ? "bad" : "warn"}>{s.level === "high" ? "Max" : "Medium"}</Badge>
                  {s.reviewed ? (
                    <span className="pt-muted pt-log-done">Reviewed</span>
                  ) : (
                    <span onClick={(e) => e.stopPropagation()}>
                      <Button kind="plain" onClick={() => p.markReviewed([s.id])}>
                        Mark reviewed
                      </Button>
                    </span>
                  )}
                  <Icon name="right" size={18} />
                </li>
                );
              })}
            </ul>
          ) : (
            <Empty>
              All caught up. Nothing waiting for review.{" "}
              {c.security.length > 0 && (
                <button type="button" className="pt-add pt-inline" onClick={() => setOnly(false)}>
                  See the whole log
                </button>
              )}
            </Empty>
          )}
        </section>

        <aside className="pt-card pt-preview">
          <h2 className="pt-card-title">Who can open the portal</h2>
          <p className="pt-muted">
            {adminRoles.map((r) => r.name).join(", ")} can open this portal and manage roles and powers, invite codes and the org’s payouts.{" "}
            <Link href="/portal/roles" className="pt-name-link">
              Change who has it
            </Link>
          </p>
          <ul className="pt-mini">
            {admins.map((m, i) => (
              <li key={m.id}>
                <span className="pt-person">
                  <Avatar name={fullName(m)} size={28} tone={i} />
                  <span>
                    <MemberLink id={m.id}>{fullName(m)}</MemberLink>
                    <small>{c.roles.find((r) => r.id === m.roleId)?.name}</small>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <Capture id={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/** One entry, opened: the frame that was on their screen, and the details. */
function Capture({ id, onClose }: { id: string | null; onClose: () => void }) {
  const p = usePortal();
  const c = p.chapter;
  const s = id ? c.security.find((x) => x.id === id) : undefined;
  const m = s ? c.members.find((x) => x.id === s.memberId) : undefined;
  const who = m ? fullName(m) : "Former member";
  const feed = s ? c.feeds.find((f) => f.name === s.where) : undefined;
  return (
    <Drawer
      open={!!s}
      onClose={onClose}
      title={s ? `${m ? m.first : who} ${WHAT[s.type].label.toLowerCase()}` : ""}
      sub={s ? `${s.where} · ${when(s.at, { weekday: "short", month: "short", day: "numeric" })} at ${time(s.at)}` : undefined}
    >
      {s && (
        <div className="pt-capture">
          {s.capture ? (
            <a href={s.capture} target="_blank" rel="noreferrer" className="pt-capture-shot" title="Open full size">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.capture} alt={`What was on ${who}’s screen in ${s.where}`} />
            </a>
          ) : (
            <div className="pt-capture-none">
              <Icon name={WHAT[s.type].icon} />
              <p>No picture was kept for this one.</p>
              <small>{s.type === "screenshot_attempted" ? "The phone blocked it, so there was nothing to keep." : "The phone only reported it."}</small>
            </div>
          )}
          <dl className="pt-capture-facts">
            <div>
              <dt>Who</dt>
              <dd>
                {m ? <MemberLink id={m.id}>{who}</MemberLink> : who}
                {m && <span className="pt-muted"> · {m.suspended ? "Suspended" : c.roles.find((r) => r.id === m.roleId)?.name}</span>}
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {feed ? (
                  <Link href={`/portal/roles?tab=feeds&f=${feed.id}`} className="pt-name-link">
                    {s.where}
                  </Link>
                ) : (
                  s.where
                )}
              </dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>
                {when(s.at, { weekday: "long", month: "long", day: "numeric" })} at {time(s.at)} <span className="pt-muted">({ago(s.at)})</span>
              </dd>
            </div>
            <div>
              <dt>Device</dt>
              <dd>{s.device || "Unknown"}</dd>
            </div>
            <div>
              <dt>Security</dt>
              <dd>
                <Badge tone={s.level === "high" ? "bad" : "warn"}>{s.level === "high" ? "Max" : "Medium"}</Badge>
              </dd>
            </div>
          </dl>
          <div className="pt-capture-actions">
            {s.reviewed ? (
              <span className="pt-muted">Reviewed</span>
            ) : (
              <Button kind="primary" icon="check" onClick={() => p.markReviewed([s.id])}>
                Mark reviewed
              </Button>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
