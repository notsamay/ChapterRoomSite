"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { effectivePowers, fullName, makeChapter, money, newCode, POWERS, type AttendanceStatus, type Chapter, type Fee, type Poll, type PowerKey } from "./data";
import { loadChapter, PortalAccessError } from "./live";
import { AccessNote, SignIn } from "./SignIn";

// The portal's data. With Supabase configured (NEXT_PUBLIC_SUPABASE_URL and _PUBLISHABLE_KEY), an
// officer signs in with their app account and sees their own org; each change is shown at once,
// then made by the app's own database function (set_members_role, set_members_suspended,
// review_excuse, ...) and the org read back. A function that says no puts the real state back
// and says why. Without Supabase configured, the portal runs on sample data held in the browser.

// Actions that have no database function behind them yet; in the live portal they point to the app.
const IN_APP_ONLY = "Not in the web portal yet. Do this in the app for now.";

// A toast can carry one action, for an Undo where the change can be put back with the same action.
type ToastAction = { label: string; run: () => void };
type Toast = { id: number; text: string; tone?: "ok" | "bad"; action?: ToastAction };

type Store = {
  live: boolean;
  signOut: () => void;
  chapter: Chapter;
  chapters: { id: string; name: string; school: string }[];
  switchChapter: (id: string) => void;
  toasts: Toast[];
  toast: (text: string, tone?: Toast["tone"], action?: ToastAction) => void;
  dismiss: (id: number) => void;
  // Members
  setMembersRole: (ids: string[], roleId: string) => void; // set_members_role
  addMembersToGroup: (ids: string[], groupId: string) => void; // admin_add_group_members
  removeMembersFromGroup: (ids: string[], groupId: string) => void; // remove_group_member
  suspendMembers: (ids: string[], reason: string) => void; // set_members_suspended(true)
  reinstateMembers: (ids: string[]) => void; // set_members_suspended(false)
  removeMembers: (ids: string[]) => void; // remove_member
  // Roles and groups
  togglePower: (roleId: string, key: PowerKey) => void; // set_role_permissions
  createGroup: (name: string, roleId: string | null) => void; // create_group
  deleteGroup: (groupId: string) => void; // delete_group
  rotateCode: (roleId: string) => void; // rotate via set_role_invite_code
  // Events and attendance
  setAttendance: (eventId: string, memberId: string, status: AttendanceStatus) => void; // set_attendance_status
  reviewExcuse: (eventId: string, memberIds: string | string[], approve: boolean, note?: string) => void; // review_excuse, once per member
  // Membership fees
  recordCash: (feeId: string, memberId: string, cents: number) => void; // record a cash ticket
  remind: (feeId: string, memberIds: string[]) => void; // push reminder
  createFee: (fee: Omit<Fee, "id" | "payments">) => void; // events insert, kind 'payment'
  // Security
  markReviewed: (ids: string[]) => void; // mark_security_reviewed
  // Polls
  createPoll: (poll: Omit<Poll, "id" | "createdAt" | "options"> & { labels: string[] }) => void; // a poll message in a chat or feed
  closePoll: (pollId: string) => void;
  remindPoll: (pollId: string, memberIds: string[]) => void;
};

const Ctx = createContext<Store | null>(null);

export function usePortal() {
  const s = useContext(Ctx);
  if (!s) throw new Error("usePortal outside PortalProvider");
  return s;
}

// One org: an officer has one chapter in the app today.
const SAMPLES = [{ id: "c1", name: "Lakeshore Debate Society", school: "UW–Madison", seed: 7, size: 62 }];

type Phase = { kind: "loading" } | { kind: "signed-out" } | { kind: "denied"; message: string } | { kind: "ready" };

export function PortalProvider({ children }: { children: ReactNode }) {
  // Built in the browser after the first render: the sample uses today's date, and the live org
  // needs the officer's session, so neither can come from the server.
  const sb = supabase();
  const live = sb !== null;
  const [data, setData] = useState<Record<string, Chapter> | null>(null);
  const [current, setCurrent] = useState(SAMPLES[0].id);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const seq = useRef(0);
  // undefined until the first session check, so a visitor with no session still gets the sign-in
  // screen (null === null would otherwise skip it and leave the page loading forever).
  const userId = useRef<string | null | undefined>(undefined);

  // Reads the officer's org; keeps this session's activity list across reads.
  const reload = useCallback(async () => {
    if (!sb || !userId.current) return;
    try {
      const c = await loadChapter(sb, userId.current);
      const me = c.members.find((m) => m.id === c.meId);
      if (!me || !effectivePowers(c, me.roleId).has("dashboard_access")) {
        setData(null);
        setPhase({ kind: "denied", message: "This portal is for your org’s officers. If you should have access, ask your president to turn it on for your role in the app." });
        return;
      }
      setData((d) => ({ [c.id]: { ...c, activity: d?.[c.id]?.activity ?? [] } }));
      setCurrent(c.id);
      setPhase({ kind: "ready" });
    } catch (e) {
      setData(null);
      setPhase({ kind: "denied", message: e instanceof PortalAccessError ? e.message : e instanceof Error ? e.message : "Couldn’t load your org." });
    }
  }, [sb]);

  useEffect(() => {
    if (!sb) {
      setData(Object.fromEntries(SAMPLES.map((s) => [s.id, makeChapter(s)])));
      setPhase({ kind: "ready" });
      return;
    }
    const use = (session: Session | null) => {
      const id = session?.user.id ?? null;
      if (id === userId.current) return;
      userId.current = id;
      if (!id) {
        setData(null);
        setPhase({ kind: "signed-out" });
        return;
      }
      setPhase({ kind: "loading" });
      void reload();
    };
    sb.auth.getSession().then(({ data: { session } }) => use(session));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => use(session));
    return () => sub.subscription.unsubscribe();
  }, [sb, reload]);

  const signOut = useCallback(() => {
    void sb?.auth.signOut();
  }, [sb]);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    (text: string, tone?: Toast["tone"], action?: ToastAction) => {
      const id = ++seq.current;
      // Only the newest Undo is offered: an older one could put back the wrong thing.
      setToasts((t) => [...t.map((x) => (action ? { ...x, action: undefined } : x)), { id, text, tone, action }]);
      window.setTimeout(() => dismiss(id), action ? 6500 : 3200);
    },
    [dismiss]
  );

  // Live: makes the change in Supabase, then reads the org back. On a refusal, says why; the read
  // puts back what's really there.
  const sync = useCallback(
    (work: () => Promise<unknown>) => {
      if (!sb) return;
      work()
        .catch((e: { message?: string }) => toast(e?.message || "That didn’t go through.", "bad"))
        .finally(() => void reload());
    },
    [sb, reload, toast]
  );
  const rpc = useCallback(
    async (fn: string, args: Record<string, unknown>) => {
      const { error } = await sb!.rpc(fn, args);
      if (error) throw error;
    },
    [sb]
  );

  // Every change goes through here: copy the current chapter, change it, log who did what.
  const change = useCallback(
    (fn: (c: Chapter) => void, log?: string) => {
      setData((d) => {
        if (!d) return d;
        const c: Chapter = structuredClone(d[current]);
        fn(c);
        if (log) {
          const me = c.members.find((m) => m.id === c.meId);
          c.activity.unshift({ id: `a${Date.now()}`, who: me ? fullName(me) : "You", what: log, at: Date.now() });
        }
        return { ...d, [current]: c };
      });
    },
    [current]
  );

  const store = useMemo<Store | null>(() => {
    if (!data) return null;
    const chapter = data[current];
    const nameOf = (id: string) => {
      const m = chapter.members.find((x) => x.id === id);
      return m ? fullName(m) : "a member";
    };
    const count = (ids: string[]) => (ids.length === 1 ? nameOf(ids[0]) : `${ids.length} members`);
    const roleName = (id: string) => chapter.roles.find((r) => r.id === id)?.name ?? "a role";
    const groupName = (id: string) => chapter.groups.find((g) => g.id === id)?.name ?? "a group";
    const markLabel = (s: AttendanceStatus) => (s === "present" ? "on time" : s === "absent" ? "missed" : s);
    const eventTitle = (id: string) => chapter.events.find((e) => e.id === id)?.title ?? "an event";
    // set_attendance_status; the toast's Undo calls it again with the mark it had before.
    const mark = (eventId: string, memberId: string, status: AttendanceStatus, undoable: boolean) => {
      const before = chapter.events.find((e) => e.id === eventId)?.rsvps.find((r) => r.memberId === memberId)?.attendance ?? null;
      change((c) => {
        const e = c.events.find((x) => x.id === eventId);
        const rs = e?.rsvps.find((x) => x.memberId === memberId);
        if (rs) rs.attendance = status;
      }, `marked ${nameOf(memberId)} ${markLabel(status)} at ${eventTitle(eventId)}`);
      sync(() => rpc("set_attendance_status", { p_event_id: eventId, p_member_id: memberId, p_status: status }));
      toast(
        `${nameOf(memberId)} marked ${markLabel(status)}`,
        status === "absent" ? "bad" : undefined,
        undoable && before ? { label: "Undo", run: () => mark(eventId, memberId, before, false) } : undefined
      );
    };
    // set_role_permissions; Undo flips the same switch back.
    const flip = (roleId: string, key: PowerKey, undoable: boolean) => {
      const had = (chapter.grants[roleId] ?? []).includes(key);
      const label = POWERS.find((x) => x.key === key)?.label ?? "A power";
      change((c) => {
        const own = new Set(c.grants[roleId] ?? []);
        if (own.has(key)) own.delete(key);
        else own.add(key);
        c.grants[roleId] = Array.from(own);
      }, `${had ? "took" : "gave"} ${label} ${had ? "from" : "to"} ${roleName(roleId)}`);
      {
        const own = new Set(chapter.grants[roleId] ?? []);
        if (had) own.delete(key);
        else own.add(key);
        const probation = chapter.roles.find((r) => r.id === roleId)?.probation ?? false;
        sync(() => rpc("set_role_permissions", { p_role_id: roleId, p_keys: Array.from(own), p_is_probation: probation }));
      }
      toast(`${label} ${had ? "off" : "on"} for ${roleName(roleId)}`, had ? "bad" : undefined, undoable ? { label: "Undo", run: () => flip(roleId, key, false) } : undefined);
    };
    // An action with no database function yet: in the live portal, nothing changes and the
    // officer is pointed to the app.
    const inAppOnly = () => {
      if (!live) return false;
      toast(IN_APP_ONLY, "bad");
      return true;
    };
    // Runs one function per id, in order, stopping at the first refusal.
    const each = (ids: string[], fn: (id: string) => Promise<void>) =>
      sync(async () => {
        for (const id of ids) await fn(id);
      });
    return {
      live,
      signOut,
      chapter,
      chapters: SAMPLES.map(({ id, name, school }) => ({ id, name, school })),
      switchChapter: setCurrent,
      toasts,
      toast,
      dismiss,
      setMembersRole: (ids, roleId) => {
        change((c) => {
          for (const m of c.members) if (ids.includes(m.id)) {
            m.roleId = roleId;
            // Role-only groups follow the role.
            m.groups = m.groups.filter((g) => {
              const grp = c.groups.find((x) => x.id === g);
              return !grp?.roleId || grp.roleId === roleId;
            });
          }
        }, `moved ${count(ids)} to ${roleName(roleId)}`);
        sync(() => rpc("set_members_role", { p_member_ids: ids, p_role_id: roleId }));
        toast(`${count(ids)} moved to ${roleName(roleId)}`);
      },
      addMembersToGroup: (ids, groupId) => {
        change((c) => {
          for (const m of c.members) if (ids.includes(m.id) && !m.groups.includes(groupId)) m.groups.push(groupId);
        }, `added ${count(ids)} to ${groupName(groupId)}`);
        sync(() => rpc("admin_add_group_members", { p_group_id: groupId, p_member_ids: ids }));
        toast(`Added to ${groupName(groupId)}`);
      },
      removeMembersFromGroup: (ids, groupId) => {
        change((c) => {
          for (const m of c.members) if (ids.includes(m.id)) m.groups = m.groups.filter((g) => g !== groupId);
        }, `took ${count(ids)} out of ${groupName(groupId)}`);
        each(ids, (id) => rpc("remove_group_member", { p_group_id: groupId, p_member_id: id }));
        toast(`Removed from ${groupName(groupId)}`);
      },
      suspendMembers: (ids, reason) => {
        change((c) => {
          for (const m of c.members) if (ids.includes(m.id)) {
            m.suspended = true;
            m.suspendReason = reason;
          }
        }, `suspended ${count(ids)}: “${reason}”`);
        sync(() => rpc("set_members_suspended", { p_member_ids: ids, p_suspended: true, p_reason: reason }));
        toast(`${count(ids)} suspended`, "bad");
      },
      reinstateMembers: (ids) => {
        change((c) => {
          for (const m of c.members) if (ids.includes(m.id)) {
            m.suspended = false;
            m.suspendReason = undefined;
            if (m.roleId === "susp") m.roleId = "member";
          }
        }, `reinstated ${count(ids)}`);
        sync(() => rpc("set_members_suspended", { p_member_ids: ids, p_suspended: false, p_reason: null }));
        toast(`${count(ids)} reinstated`);
      },
      removeMembers: (ids) => {
        const label = count(ids);
        change((c) => {
          c.members = c.members.filter((m) => !ids.includes(m.id));
        }, `removed ${label} from the org`);
        each(ids, (id) => rpc("remove_member", { p_member_id: id }));
        toast(`${label} removed`, "bad");
      },
      togglePower: (roleId, key) => flip(roleId, key, true),
      createGroup: (name, roleId) => {
        change((c) => {
          c.groups.push({ id: `g${Date.now()}`, name, roleId });
        }, `made the group ${name}`);
        sync(() => rpc("create_group", { p_name: name, p_role_id: roleId }));
        toast(`${name} made`);
      },
      deleteGroup: (groupId) => {
        const name = groupName(groupId);
        change((c) => {
          c.groups = c.groups.filter((g) => g.id !== groupId);
          for (const m of c.members) m.groups = m.groups.filter((g) => g !== groupId);
        }, `deleted the group ${name}`);
        sync(() => rpc("delete_group", { p_group_id: groupId }));
        toast(`${name} deleted`, "bad");
      },
      rotateCode: (roleId) => {
        change((c) => {
          const code = c.codes.find((x) => x.roleId === roleId);
          const r = Math.random;
          if (code) {
            code.code = newCode(r, roleId.slice(0, 2).toUpperCase());
            code.expiresAt = Date.now() + 24 * 3_600_000;
          }
        }, `rotated the ${roleName(roleId)} invite code`);
        sync(() => rpc("set_role_invite_code", { p_role_id: roleId }));
        toast(`New ${roleName(roleId)} code. The old one stops working now.`);
      },
      setAttendance: (eventId, memberId, status) => mark(eventId, memberId, status, true),
      reviewExcuse: (eventId, memberIds, approve, note) => {
        const ids = Array.isArray(memberIds) ? memberIds : [memberIds];
        const rsvpIds = (chapter.events.find((e) => e.id === eventId)?.rsvps ?? []).filter((r) => ids.includes(r.memberId) && r.excuse && r.id).map((r) => r.id!);
        each(rsvpIds, (id) => rpc("review_excuse", { p_rsvp_id: id, p_decision: approve ? "approved" : "rejected", p_note: note ?? null }));
        change(
          (c) => {
            const e = c.events.find((x) => x.id === eventId);
            for (const rs of e?.rsvps ?? []) {
              if (!ids.includes(rs.memberId) || !rs.excuse) continue;
              rs.excuse.status = approve ? "approved" : "rejected";
              rs.excuse.reviewNote = note;
            }
          },
          ids.length === 1
            ? `${approve ? "approved" : "denied"} ${nameOf(ids[0])}’s excuse for ${eventTitle(eventId)}`
            : `${approve ? "approved" : "denied"} ${ids.length} excuses for ${eventTitle(eventId)}`
        );
        toast(
          ids.length === 1 ? `${nameOf(ids[0])}’s excuse ${approve ? "approved" : "denied"}` : `${ids.length} excuses ${approve ? "approved" : "denied"}`,
          approve ? "ok" : "bad"
        );
      },
      recordCash: (feeId, memberId, cents) => {
        if (inAppOnly()) return;
        change((c) => {
          const f = c.fees.find((x) => x.id === feeId);
          f?.payments.push({ memberId, cents, at: Date.now(), method: "cash" });
        }, `recorded a ${money(cents)} cash payment from ${nameOf(memberId)}`);
        toast(`${money(cents)} from ${nameOf(memberId)} recorded`);
      },
      remind: (feeId, memberIds) => {
        if (inAppOnly()) return;
        const f = chapter.fees.find((x) => x.id === feeId);
        change((c) => {
          // Kept with the voucher so the next officer can see who was nudged, and when.
          const fee = c.fees.find((x) => x.id === feeId);
          const me = c.members.find((m) => m.id === c.meId);
          if (fee) fee.reminders = [{ at: Date.now(), memberIds, by: me ? fullName(me) : "You" }, ...(fee.reminders ?? [])];
        }, `reminded ${count(memberIds)} about ${f?.title ?? "a fee"}`);
        toast(`Reminder sent to ${count(memberIds)}`);
      },
      createFee: (fee) => {
        if (inAppOnly()) return;
        change((c) => {
          c.fees.unshift({ ...fee, id: `f${Date.now()}`, payments: [] });
        }, `made ${fee.title} (${money(fee.cents)})`);
        toast(`${fee.title} is live in the app`);
      },
      createPoll: ({ labels, ...rest }) => {
        if (inAppOnly()) return;
        change((c) => {
          const id = `p${Date.now()}`;
          c.polls.unshift({ ...rest, id, createdAt: Date.now(), options: labels.map((label, k) => ({ id: `${id}-o${k}`, label, voterIds: [] })) });
        }, `posted the poll “${rest.question}” in ${rest.where}`);
        toast("Poll posted");
      },
      closePoll: (pollId) => {
        if (inAppOnly()) return;
        const q = chapter.polls.find((x) => x.id === pollId)?.question ?? "a poll";
        change((c) => {
          const poll = c.polls.find((x) => x.id === pollId);
          if (poll) {
            poll.closed = true;
            poll.closesAt = Date.now();
          }
        }, `closed the poll “${q}”`);
        toast("Poll closed");
      },
      remindPoll: (pollId, memberIds) => {
        if (inAppOnly()) return;
        const q = chapter.polls.find((x) => x.id === pollId)?.question ?? "a poll";
        change(() => {}, `reminded ${count(memberIds)} to vote on “${q}”`);
        toast(`Reminder sent to ${count(memberIds)}`);
      },
      markReviewed: (ids) => {
        change((c) => {
          for (const s of c.security) if (ids.includes(s.id)) s.reviewed = true;
        });
        each(ids, (id) => rpc("mark_security_reviewed", { p_event_id: id }));
        toast(ids.length === 1 ? "Marked reviewed" : `${ids.length} marked reviewed`);
      },
    };
  }, [data, current, toasts, toast, dismiss, change, live, signOut, sync, rpc]);

  if (phase.kind === "signed-out") return <SignIn />;
  if (phase.kind === "denied") return <AccessNote message={phase.message} onSignOut={signOut} />;
  if (!store || phase.kind === "loading") return <div className="pt-boot" aria-busy="true" />;
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
