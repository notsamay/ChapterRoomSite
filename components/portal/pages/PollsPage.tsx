"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { fullName, type Chapter, type Poll } from "../data";
import { usePortal } from "../store";
import { ago, Avatar, Badge, Button, Empty, Icon, MemberLink, Modal, PageHead, downloadCsv, plural, relDay, when } from "../ui";

// Polls, as the app makes them: a question posted in a chat or feed, one or several answers, a
// closing time, results shown as they come or hidden until it closes, and the officer settings
// (required, anonymous). The page lists every poll, open ones first; click one for its results, who
// voted for what (unless it's anonymous) and who hasn't voted yet.

const CLOSES = [
  { label: "24 hours", days: 1 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "Never", days: null },
];
const PLACES = ["Announcements", "Whole org chat", "Officer feed"];

function eligible(c: Chapter, poll: Poll) {
  return c.members.filter((m) => !m.suspended && (poll.audienceRoles.length === 0 || poll.audienceRoles.includes(m.roleId)));
}
function voted(poll: Poll) {
  return new Set(poll.options.flatMap((o) => o.voterIds));
}
const isOpen = (poll: Poll) => !poll.closed && (poll.closesAt === null || poll.closesAt > Date.now());
/** Open polls first, closing soonest; then closed ones, newest first. */
const order = (a: Poll, b: Poll) => {
  const oa = isOpen(a);
  const ob = isOpen(b);
  if (oa !== ob) return oa ? -1 : 1;
  if (oa) return (a.closesAt ?? Infinity) - (b.closesAt ?? Infinity);
  return (b.closesAt ?? b.createdAt) - (a.closesAt ?? a.createdAt);
};
/** The settings a poll was posted with, in words. */
const settings = (poll: Poll) =>
  [
    poll.allowMultiple ? "Several answers" : "One answer",
    poll.required ? "Required" : "Optional",
    poll.anonymous ? "Anonymous" : "Names shown",
    poll.hideResults ? "Results hidden until it closes" : "Results shown as votes come in",
  ].join(" · ");

export default function PollsPage() {
  const { chapter: c } = usePortal();
  // The open poll lives in the address (?p=<id>), so Back and the sidebar both return to the list.
  const router = useRouter();
  const open = useSearchParams().get("p");
  const [making, setMaking] = useState(false);
  const go = (id: string | null) => router.push(id ? `/portal/polls?p=${id}` : "/portal/polls");

  const poll = open ? c.polls.find((x) => x.id === open) : null;
  if (poll) return <Detail poll={poll} onBack={() => go(null)} />;

  return (
    <div className="pt-page">
      <PageHead title="Polls" sub="Every poll in your chats and feeds, open ones first. Click one for the results and who hasn’t voted.">
        <Button kind="primary" icon="plus" onClick={() => setMaking(true)}>
          New poll
        </Button>
      </PageHead>
      <div className="pt-table-wrap">
        <table className="pt-table pt-table-click">
          <thead>
            <tr>
              <th>Poll</th>
              <th>Voted</th>
              <th className="pt-hide-s">Top answer</th>
              <th className="pt-hide-s">Closes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {[...c.polls].sort(order).map((p) => {
              const who = eligible(c, p);
              const n = voted(p).size;
              const top = [...p.options].sort((a, b) => b.voterIds.length - a.voterIds.length)[0];
              const live = isOpen(p);
              return (
                <tr key={p.id} onClick={() => go(p.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && go(p.id)}>
                  <td>
                    <span className="pt-voucher">
                      <span className="pt-voucher-icon">
                        <Icon name="poll" />
                      </span>
                      <span>
                        <b>{p.question}</b>
                        <small>
                          {p.where}
                          {p.required ? " · Required" : ""}
                          {p.anonymous ? " · Anonymous" : ""}
                        </small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="pt-rate">
                      <span className="pt-meter" aria-hidden="true">
                        <span style={{ width: `${(n / Math.max(1, who.length)) * 100}%` }} />
                      </span>
                      {n} of {who.length}
                    </span>
                  </td>
                  <td className="pt-hide-s">{p.hideResults && live ? <span className="pt-muted">Hidden until it closes</span> : top && top.voterIds.length ? top.label : <span className="pt-muted">No votes yet</span>}</td>
                  <td className="pt-hide-s">
                    {p.closesAt === null ? (
                      <span className="pt-muted">Stays open</span>
                    ) : (
                      <>
                        {when(p.closesAt, { weekday: "short", month: "short", day: "numeric" })}
                        <small className="pt-cell-sub">{live ? `closes ${relDay(p.closesAt)}` : `closed ${relDay(p.closesAt)}`}</small>
                      </>
                    )}
                  </td>
                  <td className="pt-right">
                    {live ? <Badge tone="good">Open</Badge> : <Badge>Closed</Badge>}
                    <Icon name="right" size={18} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {c.polls.length === 0 && <Empty>No polls yet. Post one here or in any chat or feed in the app.</Empty>}
      </div>
      <NewPoll open={making} onClose={() => setMaking(false)} />
    </div>
  );
}

function Detail({ poll, onBack }: { poll: Poll; onBack: () => void }) {
  const p = usePortal();
  const c = p.chapter;
  const who = eligible(c, poll);
  const did = voted(poll);
  const notYet = who.filter((m) => !did.has(m.id));
  const total = Math.max(1, poll.options.reduce((s, o) => s + o.voterIds.length, 0));
  const live = isOpen(poll);
  const name = (id: string) => {
    const m = c.members.find((x) => x.id === id);
    return m ? fullName(m) : "Former member";
  };
  const max = Math.max(...poll.options.map((o) => o.voterIds.length));
  const [side, setSide] = useState<"not" | "did">("not");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [asking, setAsking] = useState<null | "close" | "remind">(null);
  const votedList = who.filter((m) => did.has(m.id));
  const list = side === "not" ? notYet : votedList;
  const choiceOf = (id: string) => poll.options.filter((o) => o.voterIds.includes(id)).map((o) => o.label).join(", ");

  const exportCsv = () =>
    downloadCsv(`${poll.question}.csv`, [
      ["Option", "Votes", ...(poll.anonymous ? [] : ["Who"])],
      ...poll.options.map((o) => [o.label, o.voterIds.length, ...(poll.anonymous ? [] : [o.voterIds.map(name).join("; ")])]),
    ]);

  return (
    <div className="pt-page">
      <button type="button" className="pt-backlink" onClick={onBack}>
        <Icon name="back" size={18} /> All polls
      </button>
      <PageHead
        title={poll.question}
        sub={
          <>
            {poll.where} · posted {ago(poll.createdAt)} ·{" "}
            {poll.closesAt === null ? "stays open until closed" : `${live ? "closes" : "closed"} ${when(poll.closesAt, { weekday: "short", month: "short", day: "numeric" })} (${relDay(poll.closesAt)})`}
            <br />
            {settings(poll)}
          </>
        }
      >
        <Button icon="download" onClick={exportCsv}>
          Export
        </Button>
        {live && (
          <Button kind="plain" onClick={() => setAsking("close")}>
            Close poll
          </Button>
        )}
      </PageHead>

      <div className="pt-split">
        <section className="pt-card">
          <h2 className="pt-card-title">Results</h2>
          <p className="pt-muted pt-poll-note">
            {did.size} of {who.length} voted
            {poll.anonymous ? " · anonymous, so officers see counts, not names" : ""}
            {poll.hideResults && live ? " · members see results when it closes" : ""}
          </p>
          <ul className="pt-results">
            {poll.options.map((o) => {
              const pct = Math.round((o.voterIds.length / total) * 100);
              return (
                <li key={o.id} data-top={o.voterIds.length === max && max > 0}>
                  <div className="pt-result-top">
                    <b>{o.label}</b>
                    <span>
                      {o.voterIds.length} · {pct}%
                    </span>
                  </div>
                  <span className="pt-meter" aria-hidden="true">
                    <span style={{ width: `${pct}%` }} />
                  </span>
                  {!poll.anonymous && o.voterIds.length > 0 && (
                    <p className="pt-voters">
                      {(expanded.has(o.id) ? o.voterIds : o.voterIds.slice(0, 6)).map((id, k, arr) => (
                        <span key={id}>
                          <MemberLink id={id}>{name(id)}</MemberLink>
                          {k < arr.length - 1 ? ", " : ""}
                        </span>
                      ))}
                      {o.voterIds.length > 6 && (
                        <button
                          type="button"
                          className="pt-add pt-inline"
                          onClick={() =>
                            setExpanded((x) => {
                              const n = new Set(x);
                              if (n.has(o.id)) n.delete(o.id);
                              else n.add(o.id);
                              return n;
                            })
                          }
                        >
                          {expanded.has(o.id) ? "Show fewer" : `and ${o.voterIds.length - 6} more`}
                        </button>
                      )}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="pt-card pt-preview">
          <span className="pt-seg pt-seg-tabs" role="radiogroup" aria-label="Show">
            <button type="button" role="radio" aria-checked={side === "not"} onClick={() => setSide("not")}>
              Haven’t voted <span className="pt-muted">{notYet.length}</span>
            </button>
            <button type="button" role="radio" aria-checked={side === "did"} onClick={() => setSide("did")}>
              Voted <span className="pt-muted">{votedList.length}</span>
            </button>
          </span>
          <p className="pt-muted">
            {side === "not"
              ? `${notYet.length} of ${who.length} who can vote${poll.required ? " · voting is required" : ""}`
              : poll.anonymous
                ? "Anonymous: you can see who voted, not what they picked."
                : `${votedList.length} of ${who.length}, with what they picked`}
          </p>
          {side === "not" && live && notYet.length > 0 && (
            <Button icon="bell" onClick={() => (notYet.length === 1 ? p.remindPoll(poll.id, [notYet[0].id]) : setAsking("remind"))}>
              Remind {notYet.length}
            </Button>
          )}
          <ul className="pt-mini">
            {list.map((m) => (
              <li key={m.id}>
                <span className="pt-person">
                  <Avatar name={fullName(m)} size={28} />
                  <span>
                    <MemberLink id={m.id}>{fullName(m)}</MemberLink>
                    {side === "did" && !poll.anonymous && <small>{choiceOf(m.id)}</small>}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {list.length === 0 && <p className="pt-muted">{side === "not" ? "Everyone who can vote has voted." : "No votes yet."}</p>}
        </aside>
      </div>

      <Modal
        open={asking === "close"}
        onClose={() => setAsking(null)}
        title="Close this poll?"
        actions={
          <>
            <Button kind="ghost" onClick={() => setAsking(null)}>
              Cancel
            </Button>
            <Button
              kind="primary"
              onClick={() => {
                p.closePoll(poll.id);
                setAsking(null);
              }}
            >
              Close poll
            </Button>
          </>
        }
      >
        <p>
          No one can vote after this{poll.hideResults ? ", and members see the results" : ""}. {did.size} of {who.length} have voted
          {notYet.length && poll.required ? `; ${plural(notYet.length, "member")} who had to vote never did` : ""}.
        </p>
      </Modal>
      <Modal
        open={asking === "remind"}
        onClose={() => setAsking(null)}
        title={`Remind ${notYet.length} to vote?`}
        actions={
          <>
            <Button kind="ghost" onClick={() => setAsking(null)}>
              Cancel
            </Button>
            <Button
              kind="primary"
              icon="bell"
              onClick={() => {
                p.remindPoll(poll.id, notYet.map((m) => m.id));
                setAsking(null);
              }}
            >
              Send {notYet.length}
            </Button>
          </>
        }
      >
        <p>Each gets a push notification that opens “{poll.question}” in {poll.where}.</p>
        <p className="pt-names">
          {notYet
            .slice(0, 12)
            .map((m) => fullName(m))
            .join(", ")}
          {notYet.length > 12 ? ` and ${notYet.length - 12} more` : ""}
        </p>
      </Modal>
    </div>
  );
}

function NewPoll({ open, onClose }: { open: boolean; onClose: () => void }) {
  const p = usePortal();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [where, setWhere] = useState(PLACES[0]);
  const [closes, setCloses] = useState(1);
  const [multiple, setMultiple] = useState(false);
  const [required, setRequired] = useState(false);
  const [hide, setHide] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const filled = options.map((o) => o.trim()).filter(Boolean);
  const dupes = new Set(filled.map((o) => o.toLowerCase())).size !== filled.length;
  const ok = question.trim() && filled.length >= 2 && !dupes;

  const choice = (label: string, value: boolean, set: (v: boolean) => void, a: string, b: string) => (
    <div className="pt-field">
      <span>{label}</span>
      <span className="pt-seg pt-seg-tabs" role="radiogroup" aria-label={label}>
        <button type="button" role="radio" aria-checked={!value} onClick={() => set(false)}>
          {a}
        </button>
        <button type="button" role="radio" aria-checked={value} onClick={() => set(true)}>
          {b}
        </button>
      </span>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New poll"
      actions={
        <>
          <Button kind="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            kind="primary"
            disabled={!ok}
            onClick={() => {
              const days = CLOSES[closes].days;
              p.createPoll({
                question: question.trim(),
                where,
                labels: filled,
                audienceRoles: (() => {
                  // A feed's poll reaches the roles that can view the feed; "everyone" is stored as [].
                  const feed = p.chapter.feeds.find((f) => f.name === where);
                  const ordinary = p.chapter.roles.filter((r) => !r.probation);
                  return !feed || ordinary.every((r) => feed.viewRoles.includes(r.id)) ? [] : feed.viewRoles;
                })(),
                closesAt: days === null ? null : Date.now() + days * 86_400_000,
                allowMultiple: multiple,
                hideResults: hide,
                required,
                anonymous,
              });
              setQuestion("");
              setOptions(["", ""]);
              onClose();
            }}
          >
            Post poll
          </Button>
        </>
      }
    >
      <label className="pt-field">
        <span>Question</span>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Where should formal be?" />
      </label>
      <div className="pt-field">
        <span>Options</span>
        {options.map((o, i) => (
          <div key={i} className="pt-option">
            <input value={o} onChange={(e) => setOptions((x) => x.map((y, k) => (k === i ? e.target.value : y)))} placeholder={`Option ${i + 1}`} aria-label={`Option ${i + 1}`} />
            {options.length > 2 && (
              <button type="button" className="pt-x" onClick={() => setOptions((x) => x.filter((_, k) => k !== i))} aria-label={`Remove option ${i + 1}`}>
                <Icon name="x" size={16} />
              </button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <button type="button" className="pt-add" onClick={() => setOptions((x) => [...x, ""])}>
            <Icon name="plus" size={16} /> Add an option
          </button>
        )}
        {dupes && <small className="pt-muted">Two options are the same.</small>}
      </div>
      <div className="pt-field-row">
        <label className="pt-field">
          <span>Post in</span>
          <select value={where} onChange={(e) => setWhere(e.target.value)}>
            {PLACES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="pt-field">
          <span>Closes</span>
          <select value={closes} onChange={(e) => setCloses(Number(e.target.value))}>
            {CLOSES.map((x, i) => (
              <option key={x.label} value={i}>
                {x.label === "Never" ? "Stays open" : `In ${x.label}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      {choice("Answers", multiple, setMultiple, "One answer", "Multiple answers")}
      {choice("Is voting required?", required, setRequired, "Optional", "Required")}
      {choice("Results", hide, setHide, "Show as they come", "Hide until closed")}
      {choice("Votes", anonymous, setAnonymous, "Named", "Anonymous")}
    </Modal>
  );
}
