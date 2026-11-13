"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { effectivePowers, feedReach, fullName, inheritedFrom, POWERS, scopeLabel, type Chapter, type Feed, type PowerKey } from "../data";
import { usePortal } from "../store";
import { Avatar, Badge, Button, Drawer, Empty, Icon, MemberLink, Modal, PageHead, Tabs, plural, until } from "../ui";

// Roles and groups, as the app does them. Roles are ranked; each is switched on for the powers it
// should have, and powers flow up (a role can do what it's given plus everything the roles under it
// can do), so an inherited power shows as on and locked, with the role it comes from. Groups never
// grant powers: a group is open to everyone or belongs to one role. Invite codes put whoever joins
// with one straight into that role. Feed access shows, read-only, who can view and post in each
// feed (set per feed in the app, by role and group). The tab and the open feed live in the address
// (?tab= ?f=).

type Tab = "roles" | "groups" | "feeds" | "codes";
const TABS: Tab[] = ["roles", "groups", "feeds", "codes"];
const LEVEL: Record<Feed["security"], string> = { low: "Off", medium: "Medium", high: "Max" };

/** Who has officer access now, and who would if [roleId]'s own switch for it flipped. */
function adminChange(c: Chapter, roleId: string) {
  const key: PowerKey = "dashboard_access";
  const has = (ch: Chapter) => new Set(ch.members.filter((m) => !m.suspended && effectivePowers(ch, m.roleId).has(key)).map((m) => m.id));
  const own = new Set(c.grants[roleId] ?? []);
  if (own.has(key)) own.delete(key);
  else own.add(key);
  const before = has(c);
  const after = has({ ...c, grants: { ...c.grants, [roleId]: Array.from(own) } });
  return {
    gain: c.members.filter((m) => after.has(m.id) && !before.has(m.id)),
    lose: c.members.filter((m) => before.has(m.id) && !after.has(m.id)),
  };
}

export default function RolesPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const t = qs.get("tab") as Tab | null;
  const tab: Tab = t && TABS.includes(t) ? t : "roles";
  const setTab = (next: Tab) => router.replace(next === "roles" ? "/portal/roles" : `/portal/roles?tab=${next}`, { scroll: false });
  return (
    <div className="pt-page">
      <PageHead title="Roles and groups" sub="Who can do what, who’s in which group, who sees each feed, and the codes people join with." />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "roles", label: "Roles and powers" },
          { id: "groups", label: "Groups" },
          { id: "feeds", label: "Feed access" },
          { id: "codes", label: "Invite codes" },
        ]}
      />
      {tab === "roles" && <Powers />}
      {tab === "groups" && <Groups />}
      {tab === "feeds" && <Feeds open={qs.get("f")} onOpen={(id) => router.replace(id ? `/portal/roles?tab=feeds&f=${id}` : "/portal/roles?tab=feeds", { scroll: false })} />}
      {tab === "codes" && <Codes />}
    </div>
  );
}

function Powers() {
  const p = usePortal();
  const c = p.chapter;
  const ranked = [...c.roles].filter((r) => !r.probation).sort((a, b) => a.rank - b.rank);
  const restricted = c.roles.filter((r) => r.probation);
  const top = ranked[0];
  const holders = (id: string) => c.members.filter((m) => m.roleId === id);
  const [preview, setPreview] = useState(ranked[3]?.id ?? ranked[0].id);
  const cats = Array.from(new Set(POWERS.map((x) => x.category)));
  const can = effectivePowers(c, preview);
  const [admin, setAdmin] = useState<string | null>(null); // role whose officer access switch is waiting for a yes
  const change = admin ? adminChange(c, admin) : null;
  const adminOn = admin ? (c.grants[admin] ?? []).includes("dashboard_access") : false;
  const flip = (roleId: string, key: PowerKey) => (key === "dashboard_access" ? setAdmin(roleId) : p.togglePower(roleId, key));

  return (
    <div className="pt-split">
      <div className="pt-table-wrap">
        <table className="pt-table pt-matrix">
          <thead>
            <tr className="pt-matrix-cats">
              <th />
              {cats.map((cat) => (
                <th key={cat} colSpan={POWERS.filter((x) => x.category === cat).length}>
                  {cat}
                </th>
              ))}
            </tr>
            <tr>
              <th>Highest first</th>
              {POWERS.map((pw) => (
                <th key={pw.key} className="pt-matrix-h" title={pw.line}>
                  {pw.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => {
              const people = holders(r.id);
              return (
                <tr key={r.id}>
                  <td>
                    <span className="pt-role-cell">
                      <span className="pt-role-tile" data-tone={i}>
                        {r.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <span>
                        <b>{r.name}</b>
                        <small>
                          <Link href={`/portal/members?role=${r.id}`} className="pt-name-link" title={`See everyone who is ${r.name}`}>
                            {plural(people.length, "member")}
                          </Link>
                          {r.id === top.id ? " · Top role" : ""}
                        </small>
                      </span>
                    </span>
                  </td>
                  {POWERS.map((pw) => {
                    const own = (c.grants[r.id] ?? []).includes(pw.key);
                    const from = r.id === top.id ? null : inheritedFrom(c, r.id, pw.key);
                    const isTop = r.id === top.id;
                    const state = isTop ? "top" : own ? "on" : from ? "inherited" : "off";
                    return (
                      <td key={pw.key} className="pt-matrix-cell">
                        <button
                          type="button"
                          className="pt-switch"
                          data-state={state}
                          disabled={isTop || (!own && !!from)}
                          aria-pressed={state !== "off"}
                          aria-label={`${pw.label} for ${r.name}`}
                          title={
                            isTop
                              ? "The top role has every power"
                              : !own && from
                                ? `From ${from.name}, which ranks lower. Turn it off there.`
                                : own
                                  ? `Turn off ${pw.label} for ${r.name}`
                                  : `Give ${r.name} ${pw.label}`
                          }
                          onClick={() => flip(r.id, pw.key)}
                        >
                          <span />
                          {(isTop || (!own && from)) && <Icon name="lock" size={11} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {restricted.map((r) => (
              <tr key={r.id} className="pt-restricted">
                <td>
                  <span className="pt-role-cell">
                    <span className="pt-role-tile" data-tone="r">
                      <Icon name="lock" size={16} />
                    </span>
                    <span>
                      <b>{r.name}</b>
                      <small>
                        <Link href={`/portal/members?role=${r.id}`} className="pt-name-link">
                          {plural(holders(r.id).length, "member")}
                        </Link>{" "}
                        · Restricted
                      </small>
                    </span>
                  </span>
                </td>
                <td colSpan={POWERS.length} className="pt-muted">
                  A restricted role holds no powers and can’t post, send or RSVP.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="pt-foot-note">
          Powers flow up: a role can do what it’s given, plus everything the roles under it can do. A locked switch comes from a role below; change it there.
        </p>
      </div>

      <aside className="pt-card pt-preview">
        <h2 className="pt-card-title">See it as a role</h2>
        <select value={preview} onChange={(e) => setPreview(e.target.value)} aria-label="Role to preview">
          {ranked.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <p className="pt-muted">
          {holders(preview).length ? (
            <>
              Held by{" "}
              {holders(preview)
                .slice(0, 4)
                .map((m, k, arr) => (
                  <span key={m.id}>
                    <MemberLink id={m.id}>{fullName(m)}</MemberLink>
                    {k < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              {holders(preview).length > 4 && (
                <>
                  {" "}
                  and{" "}
                  <Link href={`/portal/members?role=${preview}`} className="pt-name-link">
                    {holders(preview).length - 4} more
                  </Link>
                </>
              )}
            </>
          ) : (
            "No one holds this role yet."
          )}{" "}
          · can do {can.size} of {POWERS.length}
        </p>
        <ul className="pt-can">
          {POWERS.map((pw) => (
            <li key={pw.key} data-on={can.has(pw.key)}>
              <Icon name={can.has(pw.key) ? "check" : "x"} size={16} />
              <span>
                <b>{pw.label}</b>
                <small>{pw.line}</small>
              </span>
            </li>
          ))}
        </ul>
      </aside>

      <Modal
        open={!!admin}
        onClose={() => setAdmin(null)}
        title={admin ? `${adminOn ? "Take officer access from" : "Give officer access to"} ${c.roles.find((r) => r.id === admin)?.name}?` : ""}
        actions={
          <>
            <Button kind="ghost" onClick={() => setAdmin(null)}>
              Cancel
            </Button>
            <Button
              kind={adminOn ? "danger" : "primary"}
              onClick={() => {
                if (admin) p.togglePower(admin, "dashboard_access");
                setAdmin(null);
              }}
            >
              {adminOn ? "Take it away" : "Give officer access"}
            </Button>
          </>
        }
      >
        <p>Officer access opens this portal, roles and powers, invite codes and the org’s payouts. Powers flow up, so roles above get it too.</p>
        {change && (change.gain.length || change.lose.length) ? (
          <p className="pt-names">
            {change.gain.length ? `${plural(change.gain.length, "person gets", "people get")} it: ` : `${plural(change.lose.length, "person loses", "people lose")} it: `}
            {(change.gain.length ? change.gain : change.lose).map(fullName).join(", ")}.
          </p>
        ) : (
          <p>No one’s access changes: everyone in this role already has it from elsewhere.</p>
        )}
      </Modal>
    </div>
  );
}

function Groups() {
  const p = usePortal();
  const c = p.chapter;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [who, setWho] = useState("open");
  const [del, setDel] = useState<string | null>(null);
  const roleName = (id: string | null) => (id ? c.roles.find((r) => r.id === id)?.name : null);
  const ranked = [...c.roles].filter((r) => !r.probation).sort((a, b) => a.rank - b.rank);

  return (
    <>
      <div className="pt-toolbar">
        <p className="pt-muted pt-grow">Groups never grant powers. Members join as many as they like, and @ plus a group’s name reaches everyone in it.</p>
        <Button kind="primary" icon="plus" onClick={() => setOpen(true)}>
          New group
        </Button>
      </div>
      <div className="pt-table-wrap">
        <table className="pt-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Who can join</th>
              <th>Members</th>
              <th className="pt-hide-s">Used by feeds</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {c.groups.map((g) => {
              const people = c.members.filter((m) => m.groups.includes(g.id));
              const used = c.feeds.filter((f) => f.viewGroups.includes(g.id) || f.postGroups.includes(g.id));
              return (
                <tr key={g.id}>
                  <td>
                    <b>{g.name}</b>
                  </td>
                  <td>{g.roleId ? <Badge tone="dark">{roleName(g.roleId)} only</Badge> : <span className="pt-muted">Open to everyone</span>}</td>
                  <td>
                    <Link href={`/portal/members?group=${g.id}`} className="pt-pile pt-name-link" title={`See everyone in ${g.name}`}>
                      {people.slice(0, 4).map((m, i) => (
                        <Avatar key={m.id} name={fullName(m)} size={26} tone={i} />
                      ))}
                      <span className="pt-muted">{plural(people.length, "member")}</span>
                    </Link>
                  </td>
                  <td className="pt-hide-s">
                    {used.length ? (
                      used.map((f, k) => (
                        <span key={f.id}>
                          <Link href={`/portal/roles?tab=feeds&f=${f.id}`} className="pt-name-link">
                            {f.name}
                          </Link>
                          <span className="pt-muted"> ({f.postGroups.includes(g.id) ? "can post" : "can view"})</span>
                          {k < used.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span className="pt-muted">—</span>
                    )}
                  </td>
                  <td className="pt-right">
                    <Button kind="ghost" onClick={() => setDel(g.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {c.groups.length === 0 && <Empty>No groups yet.</Empty>}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New group"
        actions={
          <>
            <Button kind="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              kind="primary"
              disabled={!name.trim()}
              onClick={() => {
                p.createGroup(name.trim(), who === "open" ? null : who);
                setOpen(false);
                setName("");
                setWho("open");
              }}
            >
              Make group
            </Button>
          </>
        }
      >
        <label className="pt-field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Formal Committee" />
        </label>
        <label className="pt-field">
          <span>Who can join</span>
          <select value={who} onChange={(e) => setWho(e.target.value)}>
            <option value="open">Open to everyone</option>
            {ranked.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} only
              </option>
            ))}
          </select>
        </label>
      </Modal>

      <Modal
        open={!!del}
        onClose={() => setDel(null)}
        title={`Delete ${c.groups.find((g) => g.id === del)?.name ?? "this group"}?`}
        actions={
          <>
            <Button kind="ghost" onClick={() => setDel(null)}>
              Cancel
            </Button>
            <Button
              kind="danger"
              onClick={() => {
                if (del) p.deleteGroup(del);
                setDel(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Everyone leaves the group. Chats and feeds that were shared with it stop showing to its members unless a role still gives them access.</p>
        {(() => {
          const used = c.feeds.filter((f) => del && (f.viewGroups.includes(del) || f.postGroups.includes(del)));
          return used.length ? <p className="pt-names">Feeds that use it: {used.map((f) => f.name).join(", ")}.</p> : null;
        })()}
      </Modal>
    </>
  );
}

function Feeds({ open, onOpen }: { open: string | null; onOpen: (id: string | null) => void }) {
  const { chapter: c } = usePortal();
  const feed = open ? c.feeds.find((f) => f.id === open) : null;
  const roleName = (id: string) => c.roles.find((r) => r.id === id)?.name ?? "";
  const groupName = (id: string) => c.groups.find((g) => g.id === id)?.name ?? "";
  const why = (x: ReturnType<typeof feedReach>[number]) =>
    [x.byRole ? roleName(x.m.roleId) : "", ...x.viaGroups.map((g) => `via ${groupName(g)}`)].filter(Boolean).join(" · ");

  return (
    <>
      <p className="pt-muted pt-lead">
        Who can see and post in each feed, from its roles and groups. Each feed sets this in its details in the app; groups only ever widen it. Suspended members see nothing.
      </p>
      <div className="pt-table-wrap">
        <table className="pt-table pt-table-click">
          <thead>
            <tr>
              <th>Feed</th>
              <th>Who can view</th>
              <th className="pt-hide-s">Who can post</th>
              <th className="pt-hide-s">Security</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {c.feeds.map((f) => {
              const view = feedReach(c, f, "view").length;
              const post = feedReach(c, f, "post").length;
              return (
                <tr key={f.id} onClick={() => onOpen(f.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpen(f.id)}>
                  <td>
                    <b>{f.name}</b>
                  </td>
                  <td>
                    {scopeLabel(c, f.viewRoles, f.viewGroups)}
                    <small className="pt-cell-sub">{plural(view, "member")}</small>
                  </td>
                  <td className="pt-hide-s">
                    {scopeLabel(c, f.postRoles, f.postGroups)}
                    <small className="pt-cell-sub">{plural(post, "member")}</small>
                  </td>
                  <td className="pt-hide-s">{f.security === "low" ? <span className="pt-muted">Off</span> : <Badge tone={f.security === "high" ? "bad" : "warn"}>{LEVEL[f.security]}</Badge>}</td>
                  <td className="pt-right">
                    <Icon name="right" size={18} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {c.feeds.length === 0 && <Empty>No feeds yet. Feeds are made in the app.</Empty>}
      </div>

      <Drawer
        open={!!feed}
        onClose={() => onOpen(null)}
        title={feed?.name ?? ""}
        sub={feed ? `Security ${LEVEL[feed.security]} · change who sees it in the feed’s details in the app` : ""}
      >
        {feed && (
          <div className="pt-detail">
            {(["view", "post"] as const).map((what) => {
              const reach = feedReach(c, feed, what).sort((a, b) => fullName(a.m).localeCompare(fullName(b.m)));
              return (
                <section key={what}>
                  <h3>
                    {what === "view" ? "Can view" : "Can post"} <span className="pt-muted">· {plural(reach.length, "member")}</span>
                  </h3>
                  <p className="pt-muted pt-hint">
                    {scopeLabel(c, what === "view" ? feed.viewRoles : feed.postRoles, what === "view" ? feed.viewGroups : feed.postGroups)}
                  </p>
                  <ul className="pt-mini">
                    {reach.map((x) => (
                      <li key={x.m.id}>
                        <span className="pt-person">
                          <Avatar name={fullName(x.m)} size={28} />
                          <span>
                            <MemberLink id={x.m.id}>{fullName(x.m)}</MemberLink>
                            <small>{why(x)}</small>
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </Drawer>
    </>
  );
}

function Codes() {
  const p = usePortal();
  const c = p.chapter;
  const [, tick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => tick((n) => n + 1), 30_000);
    return () => window.clearInterval(t);
  }, []);
  const ranked = [...c.roles].sort((a, b) => a.rank - b.rank);

  return (
    <>
      <p className="pt-muted pt-lead">Whoever joins with a code starts in that role. Codes change every 24 hours; rotate one now if it got out. The top role is handed over in the app, not by code.</p>
      <div className="pt-codes">
        {ranked
          .map((r) => ({ r, code: c.codes.find((x) => x.roleId === r.id) }))
          .filter((x) => x.code)
          .map(({ r, code }) => (
            <div key={r.id} className="pt-code-card">
              <span className="pt-code-role">{r.name}</span>
              <b className="pt-code">{code!.code}</b>
              <span className="pt-muted">Changes in {until(code!.expiresAt)}</span>
              <div className="pt-code-actions">
                <Button
                  icon="copy"
                  onClick={() => {
                    navigator.clipboard?.writeText(code!.code).catch(() => {});
                    p.toast(`${r.name} code copied`);
                  }}
                >
                  Copy
                </Button>
                <Button kind="ghost" icon="refresh" onClick={() => p.rotateCode(r.id)}>
                  Rotate
                </Button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
