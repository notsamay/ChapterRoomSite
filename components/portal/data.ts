// Sample data for the officer portal, shaped like the app's own models (lib/models in the Flutter
// app) so the store can later read the same Supabase tables instead:
//   roles (rank: lower = more authority, is_probation) · role_permissions (8 keys) · members
//   (role_id, suspended, status) · groups (role_id null = open to everyone) · events (kind 'event'
//   or 'payment', i.e. a voucher / membership fee) · event_rsvps (status, attendance_status,
//   excuse_status) · tickets (payments against a voucher) · security_events.
// Everything here is made up: a generic student org, nothing Greek-specific.

export type PowerKey =
  | "dashboard_access"
  | "promote_members"
  | "suspend_members"
  | "manage_groups"
  | "manage_events"
  | "manage_content"
  | "create_feeds"
  | "manage_security";

export const POWERS: { key: PowerKey; label: string; category: string; line: string }[] = [
  { key: "dashboard_access", label: "Officer access", category: "Running the org", line: "This portal, roles and powers, invite codes and the org's payouts" },
  { key: "promote_members", label: "Change roles", category: "Running the org", line: "Move members between roles at or below their own" },
  { key: "suspend_members", label: "Suspend and remove", category: "Running the org", line: "Suspend, reinstate or remove members" },
  { key: "manage_groups", label: "Manage groups", category: "Running the org", line: "Make, rename and delete groups, and set who is in them" },
  { key: "manage_events", label: "Events and attendance", category: "Events and money", line: "Review excuses, check-in settings, fix attendance" },
  { key: "manage_content", label: "Moderate posts and reports", category: "Chats and feeds", line: "Edit or remove anyone's posts, pin, handle reports" },
  { key: "create_feeds", label: "Make feeds", category: "Chats and feeds", line: "Start new feeds" },
  { key: "manage_security", label: "Security log", category: "Chats and feeds", line: "See screenshots and recordings, set security levels" },
];

export type Role = { id: string; name: string; rank: number; probation?: boolean };
export type Group = { id: string; name: string; roleId: string | null };
export type Member = {
  id: string;
  first: string;
  last: string;
  email: string;
  roleId: string;
  groups: string[];
  suspended: boolean;
  suspendReason?: string;
  joined: string; // ISO date
};
export type InviteCode = { roleId: string; code: string; expiresAt: number };

export type AttendanceStatus = "present" | "late" | "excused" | "absent";
export type Rsvp = {
  id?: string; // the event_rsvps row; none yet for someone who hasn't answered
  memberId: string;
  status: "going" | "not_going" | null;
  attendance: AttendanceStatus | null;
  checkedInAt?: number;
  excuse?: { category: string; note: string; status: "pending" | "approved" | "rejected"; at: number; reviewNote?: string };
};
export type OrgEvent = {
  id: string;
  title: string;
  startsAt: number;
  location: string;
  mandatory: boolean;
  radiusM: number;
  lateAfterMin: number;
  audienceRoles: string[]; // empty = everyone
  rsvps: Rsvp[];
};

export type Payment = { memberId: string; cents: number; at: number; method: "card" | "cash" | "bank" };
export type Fee = {
  id: string;
  title: string;
  cents: number;
  dueAt: number;
  audienceRoles: string[];
  plan: number; // installments; 1 = pay in full only
  membership: boolean; // a membership fee (vs merch or a ticket)
  type: "membership" | "ticket" | "merch";
  payments: Payment[];
  reminders?: Reminder[]; // pushes officers sent about it, newest first
};
export type Reminder = { at: number; memberIds: string[]; by: string };
export type Payout = { id: string; cents: number; at: number; status: "paid" | "in_transit" };

export type SecurityEvent = {
  id: string;
  memberId: string;
  type: "screenshot_taken" | "recording_started" | "screenshot_attempted";
  level: "medium" | "high";
  where: string;
  device: string;
  at: number;
  reviewed: boolean;
  // What was on their screen at that moment: the app renders its own frame and keeps it (the
  // security-captures bucket). None when the platform only reported the attempt.
  capture?: string | null;
};

export type Activity = { id: string; who: string; what: string; at: number };

// A feed, as the app stores it (feeds table): who can view and who can post, each a set of roles
// plus groups (unioned), and its security level. Read-only in the portal; changed in the app.
export type Feed = {
  id: string;
  name: string;
  viewRoles: string[];
  viewGroups: string[];
  postRoles: string[];
  postGroups: string[];
  security: "low" | "medium" | "high";
};

// A poll, as the app posts it into a chat or feed: options with who voted for each, when it closes,
// one or several answers, results shown as they come or hidden until it closes; officers can make
// voting required and the votes anonymous.
export type Poll = {
  id: string;
  question: string;
  where: string; // the chat or feed it was posted in
  options: { id: string; label: string; voterIds: string[] }[];
  audienceRoles: string[]; // who can vote; empty = everyone
  createdAt: number;
  closesAt: number | null;
  allowMultiple: boolean;
  hideResults: boolean;
  required: boolean;
  anonymous: boolean;
  closed?: boolean;
};

export type Chapter = {
  id: string;
  name: string;
  school: string;
  meId: string;
  roles: Role[];
  grants: Record<string, PowerKey[]>; // direct grants per role; ranks above inherit
  groups: Group[];
  members: Member[];
  codes: InviteCode[];
  events: OrgEvent[];
  fees: Fee[];
  payouts: { held: number; clearing: number; nextDepositAt: number; history: Payout[] } | null; // null: not read from Stripe yet
  security: SecurityEvent[];
  activity: Activity[];
  polls: Poll[];
  feeds: Feed[];
  live?: boolean; // read from Supabase, not the sample
};

// ── A small seeded random, so the sample is the same on every load ──────────────────────────────
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRSTS = ["Maya", "Marcus", "Priya", "Tyler", "Sam", "Chris", "Olivia", "Jack", "Ava", "Ben", "Sofia", "Drew", "Evan", "Ryan", "Nora", "Noah", "Leah", "Owen", "Grace", "Luke", "Zoe", "Max", "Ella", "Nate", "Ivy", "Cole", "Ruby", "Jonah", "Mia", "Eli"];
const LASTS = ["Walsh", "Lee", "Patel", "Nguyen", "Whitaker", "Donovan", "Hart", "Reyes", "Novak", "Grant", "Shah", "Kim", "Brooks", "Rivera", "Blake", "Ortiz", "Chen", "Foster", "Hughes", "Morales"];
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const newCode = (r: () => number, prefix: string) =>
  (prefix + Array.from({ length: 8 }, () => LETTERS[Math.floor(r() * LETTERS.length)]).join("")).slice(0, 8);

const DAY = 86_400_000;
const at = (base: number, days: number, hour = 19, min = 0) => {
  const d = new Date(base + days * DAY);
  d.setHours(hour, min, 0, 0);
  return d.getTime();
};

const EXCUSES = [
  { category: "Class", note: "Lab runs until 7:30 on Tuesdays." },
  { category: "Work", note: "Closing shift at the library." },
  { category: "Sick", note: "Fever since this morning, staying in." },
  { category: "Travel", note: "Flying home for a family wedding." },
  { category: "Class", note: "Midterm review session that night." },
  { category: "Other", note: "Interview with an internship in the city." },
];

export function makeChapter(opts: { id: string; name: string; school: string; seed: number; size: number }): Chapter {
  const r = rng(opts.seed);
  const now = Date.now();
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];

  const roles: Role[] = [
    { id: "pres", name: "President", rank: 1000 },
    { id: "vp", name: "Vice President", rank: 2000 },
    { id: "treas", name: "Treasurer", rank: 3000 },
    { id: "events", name: "Events Chair", rank: 4000 },
    { id: "member", name: "Member", rank: 5000 },
    { id: "new", name: "New Member", rank: 6000 },
    { id: "susp", name: "Suspended", rank: 9000, probation: true },
  ];
  const grants: Record<string, PowerKey[]> = {
    member: ["create_feeds"],
    events: ["manage_events"],
    treas: ["dashboard_access", "manage_content"],
    vp: ["promote_members", "suspend_members", "manage_groups", "manage_security"],
  };
  const groups: Group[] = [
    { id: "g-rec", name: "Recruitment", roleId: null },
    { id: "g-social", name: "Social Committee", roleId: null },
    { id: "g-phil", name: "Philanthropy", roleId: null },
    { id: "g-im", name: "Intramurals", roleId: null },
    { id: "g-27", name: "Class of 2027", roleId: null },
    // Open, not tied to a role: it holds officers from four different roles, and a role-only group
    // can only ever hold its one role.
    { id: "g-exec", name: "Exec Board", roleId: null },
    { id: "g-nmc", name: "New Member Class", roleId: "new" },
    { id: "g-staff", name: "Event Staff", roleId: "events" },
  ];

  // Officers first, then members and new members; one suspended.
  const officers: [string, string, string][] = [
    ["Ethan", "Brooks", "pres"],
    ["Jordan", "Blake", "vp"],
    ["Tyler", "Nguyen", "treas"],
    ["Priya", "Shah", "events"],
  ];
  const members: Member[] = [];
  const used = new Set<string>();
  const add = (first: string, last: string, roleId: string, i: number) => {
    const id = `m${i}`;
    used.add(first + last);
    const officer = ["pres", "vp", "treas", "events"].includes(roleId);
    const joinedDays = roleId === "new" ? 20 + Math.floor(r() * 40) : officer ? 400 + Math.floor(r() * 400) : 120 + Math.floor(r() * 600);
    members.push({
      id,
      first,
      last,
      email: `${first}.${last}`.toLowerCase() + "@school.edu",
      roleId,
      groups: [],
      suspended: roleId === "susp",
      suspendReason: roleId === "susp" ? "Missed three mandatory events without an excuse." : undefined,
      joined: new Date(now - joinedDays * DAY).toISOString().slice(0, 10),
    });
  };
  officers.forEach(([f, l, role], i) => add(f, l, role, i));
  let i = officers.length;
  while (members.length < opts.size) {
    const f = pick(FIRSTS);
    const l = pick(LASTS);
    if (used.has(f + l)) continue;
    const role = members.length === opts.size - 1 ? "susp" : members.length > opts.size * 0.78 ? "new" : "member";
    add(f, l, role, i++);
  }
  // Groups: role-only groups follow the role; open groups are a random spread.
  for (const m of members) {
    if (m.roleId === "pres" || m.roleId === "vp" || m.roleId === "treas" || m.roleId === "events") m.groups.push("g-exec");
    if (m.roleId === "new") m.groups.push("g-nmc");
    if (m.roleId === "events") m.groups.push("g-staff");
    if (r() < 0.3) m.groups.push("g-rec");
    if (r() < 0.25) m.groups.push("g-social");
    if (r() < 0.35) m.groups.push("g-phil");
    if (r() < 0.2) m.groups.push("g-im");
    if (r() < 0.3) m.groups.push("g-27");
  }

  const codes: InviteCode[] = ["vp", "treas", "events", "member", "new"].map((roleId, k) => ({
    roleId,
    code: newCode(r, roleId.slice(0, 2).toUpperCase()),
    expiresAt: now + (3 + k * 4.3) * 3_600_000,
  }));

  // Events: four past (attendance taken) and four ahead (RSVPs, some excuses waiting).
  const ev = (id: string, title: string, days: number, hour: number, location: string, mandatory: boolean, audienceRoles: string[] = []): OrgEvent => ({
    id,
    title,
    startsAt: at(now, days, hour),
    location,
    mandatory,
    radiusM: mandatory ? 100 : 150,
    lateAfterMin: 10,
    audienceRoles,
    rsvps: [],
  });
  const events: OrgEvent[] = [
    ev("e1", "General Meeting", -22, 19, "Memorial Union, Room 3", true),
    ev("e2", "Philanthropy 5K", -15, 9, "Picnic Point", false),
    ev("e3", "General Meeting", -8, 19, "Memorial Union, Room 3", true),
    ev("e4", "Officer Meeting", -3, 18, "Union South, 2nd floor", true, ["pres", "vp", "treas", "events"]),
    ev("e5", "General Meeting", 2, 19, "Memorial Union, Room 3", true),
    ev("e6", "Formal", 9, 20, "The Edgewater", false),
    ev("e7", "Service Day", 13, 10, "Second Harvest Foodbank", true),
    ev("e8", "General Meeting", 16, 19, "Memorial Union, Room 3", true),
  ];
  const inAudience = (e: OrgEvent, m: Member) => !m.suspended && (e.audienceRoles.length === 0 || e.audienceRoles.includes(m.roleId));
  for (const e of events) {
    const past = e.startsAt < now;
    for (const m of members) {
      if (!inAudience(e, m)) continue;
      const x = r();
      if (past) {
        // You (the officer looking at this) were at everything.
        if (m.id === members[0].id) {
          e.rsvps.push({ memberId: m.id, status: "going", attendance: "present", checkedInAt: e.startsAt - 6 * 60_000 });
          continue;
        }
        let attendance: AttendanceStatus = x < 0.72 ? "present" : x < 0.82 ? "late" : x < 0.91 ? "excused" : "absent";
        if (!e.mandatory && attendance === "excused") attendance = "absent";
        const rs: Rsvp = { memberId: m.id, status: attendance === "excused" || attendance === "absent" ? "not_going" : "going", attendance };
        if (attendance === "present" || attendance === "late")
          rs.checkedInAt = e.startsAt + (attendance === "late" ? 12 + Math.floor(r() * 25) : -Math.floor(r() * 14)) * 60_000;
        if (attendance === "excused") {
          const ex = pick(EXCUSES);
          rs.excuse = { ...ex, status: "approved", at: e.startsAt - 2 * DAY };
        }
        e.rsvps.push(rs);
      } else {
        const status = x < 0.62 ? "going" : x < 0.72 ? "not_going" : null;
        const rs: Rsvp = { memberId: m.id, status, attendance: null };
        if (status === "not_going" && e.mandatory) {
          const ex = pick(EXCUSES);
          rs.excuse = { ...ex, status: r() < 0.7 ? "pending" : "approved", at: now - Math.floor(r() * 3) * DAY - Math.floor(r() * 20) * 3_600_000 };
        }
        e.rsvps.push(rs);
      }
    }
  }

  // Membership fees (vouchers): a rate for members and officers, another for new members; plus a
  // ticket and some merch.
  const everyoneButNew = ["pres", "vp", "treas", "events", "member"];
  const fees: Fee[] = [
    { id: "f1", title: "Spring membership fee", cents: 20000, dueAt: at(now, -6, 23, 59), audienceRoles: everyoneButNew, plan: 2, membership: true, type: "membership", payments: [] },
    { id: "f2", title: "New member fee", cents: 15000, dueAt: at(now, 12, 23, 59), audienceRoles: ["new"], plan: 3, membership: true, type: "membership", payments: [] },
    { id: "f3", title: "Formal ticket", cents: 4500, dueAt: at(now, 8, 23, 59), audienceRoles: [], plan: 1, membership: false, type: "ticket", payments: [] },
    { id: "f4", title: "Org hoodie", cents: 4500, dueAt: at(now, 20, 23, 59), audienceRoles: [], plan: 1, membership: false, type: "merch", payments: [] },
  ];
  for (const f of fees) {
    for (const m of members) {
      if (m.suspended) continue;
      if (f.audienceRoles.length && !f.audienceRoles.includes(m.roleId)) continue;
      const x = r();
      const method: Payment["method"] = r() < 0.12 ? "cash" : r() < 0.2 ? "bank" : "card";
      if (f.membership) {
        if (x < 0.62) f.payments.push({ memberId: m.id, cents: f.cents, at: f.dueAt - Math.floor(r() * 20) * DAY, method });
        else if (x < 0.82 && f.plan > 1) f.payments.push({ memberId: m.id, cents: Math.round(f.cents / f.plan), at: f.dueAt - Math.floor(r() * 25) * DAY, method });
      } else if (x < (f.id === "f3" ? 0.55 : 0.3)) {
        f.payments.push({ memberId: m.id, cents: f.cents, at: now - Math.floor(r() * 10) * DAY, method });
      }
    }
  }

  // The treasurer already nudged everyone overdue on the spring fee once.
  {
    const spring = fees[0];
    const late = members.filter((m) => !m.suspended && spring.audienceRoles.includes(m.roleId) && feeFor(spring, m.id).status === "overdue");
    spring.reminders = [{ at: now - 3 * DAY - 4 * 3_600_000, memberIds: late.map((m) => m.id), by: "Tyler Nguyen" }];
  }

  const history: Payout[] = [0, 7, 14, 21, 28].map((d, k) => ({
    id: `p${k}`,
    cents: 60000 + Math.floor(r() * 180000),
    at: at(now, -d - 2, 9),
    status: k === 0 ? "in_transit" : "paid",
  }));

  const byName = (first: string) => members.find((m) => m.first === first)?.id ?? members[5].id;
  const security: SecurityEvent[] = [
    { id: "s1", memberId: members[9].id, type: "screenshot_taken", level: "medium", where: "Announcements", device: "iPhone 15", at: now - 3 * 3_600_000, reviewed: false, capture: "/portal/captures/s1.webp" },
    { id: "s2", memberId: members[17].id, type: "recording_started", level: "high", where: "Exec Board chat", device: "iPhone 13", at: now - 26 * 3_600_000, reviewed: false, capture: "/portal/captures/s2.webp" },
    { id: "s3", memberId: members[23].id, type: "screenshot_taken", level: "medium", where: "Fall Retreat album", device: "Pixel 8", at: now - 2 * DAY, reviewed: true, capture: "/portal/captures/s3.webp" },
    { id: "s4", memberId: members[31].id, type: "screenshot_attempted", level: "high", where: "Exec Board chat", device: "Pixel 7", at: now - 4 * DAY, reviewed: true, capture: null },
    { id: "s5", memberId: byName("Tyler"), type: "screenshot_taken", level: "medium", where: "Fall Retreat album", device: "iPhone 16 Pro", at: now - 6 * DAY, reviewed: true, capture: "/portal/captures/s5.webp" },
  ];

  const activity: Activity[] = [
    { id: "a1", who: "Priya Shah", what: "approved 3 excuses for the General Meeting", at: now - 5 * 3_600_000 },
    { id: "a2", who: "Tyler Nguyen", what: "recorded a $200 cash payment from Owen Hart", at: now - 27 * 3_600_000 },
    { id: "a3", who: "Jordan Blake", what: "moved 4 members from New Member to Member", at: now - 2 * DAY },
    { id: "a4", who: "Ethan Brooks", what: "rotated the Member invite code", at: now - 3 * DAY },
  ];

  // Polls: two open, two closed. Votes spread over whoever can vote.
  const voters = (roles: string[]) => members.filter((m) => !m.suspended && (roles.length === 0 || roles.includes(m.roleId)));
  const poll = (
    id: string,
    question: string,
    where: string,
    labels: string[],
    weights: number[],
    turnout: number,
    o: Partial<Poll> & { daysAgo: number; closesIn: number | null }
  ): Poll => {
    const audience = o.audienceRoles ?? [];
    const options = labels.map((label, k) => ({ id: `${id}-o${k}`, label, voterIds: [] as string[] }));
    for (const m of voters(audience)) {
      if (r() > turnout) continue;
      let x = r() * weights.reduce((a, b) => a + b, 0);
      const k = weights.findIndex((w) => (x -= w) < 0);
      options[Math.max(0, k)].voterIds.push(m.id);
    }
    return {
      id,
      question,
      where,
      options,
      audienceRoles: audience,
      createdAt: now - o.daysAgo * DAY,
      closesAt: o.closesIn === null ? null : now + o.closesIn * DAY,
      allowMultiple: o.allowMultiple ?? false,
      hideResults: o.hideResults ?? false,
      required: o.required ?? false,
      anonymous: o.anonymous ?? false,
      closed: o.closesIn !== null && o.closesIn < 0,
    };
  };
  const polls: Poll[] = [
    poll("p1", "Where should formal be?", "Announcements", ["The Edgewater", "Monona Terrace", "Union South"], [5, 3, 1.5], 0.7, { daysAgo: 2, closesIn: 3, required: true }),
    poll("p2", "Spring retreat weekend", "Whole org chat", ["Mar 6–8", "Mar 27–29", "Apr 10–12"], [2, 4, 3], 0.55, { daysAgo: 1, closesIn: 6, allowMultiple: true }),
    poll("p3", "Approve the spring budget?", "Officer feed",["Approve", "Approve with changes", "Reject"], [5, 2, 0.5], 0.95, { daysAgo: 9, closesIn: -4, audienceRoles: ["pres", "vp", "treas", "events"], anonymous: true }),
    poll("p4", "Hoodie colour", "Whole org chat", ["Emerald", "Black", "Cream"], [6, 3, 2], 0.6, { daysAgo: 16, closesIn: -10 }),
  ];

  // Feeds: who can view and who can post, by role and group, as each feed's details set them in the app.
  const everyone = roles.filter((x) => !x.probation).map((x) => x.id);
  const officerRoles = ["pres", "vp", "treas", "events"];
  const feeds: Feed[] = [
    { id: "fd1", name: "Announcements", viewRoles: everyone, viewGroups: [], postRoles: officerRoles, postGroups: [], security: "medium" },
    { id: "fd2", name: "Officer feed", viewRoles: officerRoles, viewGroups: [], postRoles: officerRoles, postGroups: [], security: "high" },
    { id: "fd3", name: "Philanthropy", viewRoles: everyone, viewGroups: [], postRoles: officerRoles, postGroups: ["g-phil"], security: "low" },
    { id: "fd4", name: "Social", viewRoles: everyone, viewGroups: [], postRoles: ["pres", "vp"], postGroups: ["g-social"], security: "low" },
    { id: "fd5", name: "New member updates", viewRoles: ["pres", "vp", "new"], viewGroups: ["g-rec"], postRoles: ["pres", "vp"], postGroups: ["g-rec"], security: "medium" },
  ];

  return {
    polls,
    feeds,
    id: opts.id,
    name: opts.name,
    school: opts.school,
    meId: members[0].id,
    roles,
    grants,
    groups,
    members,
    codes,
    events,
    fees,
    payouts: { held: 418000, clearing: 120000, nextDepositAt: at(now, 2, 9), history },
    security,
    activity,
  };
}

// ── Derived values the pages share ───────────────────────────────────────────────────────────────

/** Powers flow up: a role holds what it's given plus everything held by any role ranked below it. */
export function effectivePowers(c: Chapter, roleId: string): Set<PowerKey> {
  const role = c.roles.find((x) => x.id === roleId);
  if (!role || role.probation) return new Set();
  const top = [...c.roles].filter((x) => !x.probation).sort((a, b) => a.rank - b.rank)[0];
  if (top && top.id === roleId) return new Set(POWERS.map((p) => p.key));
  const out = new Set<PowerKey>();
  for (const other of c.roles) {
    if (other.probation || other.rank < role.rank) continue;
    for (const k of c.grants[other.id] ?? []) out.add(k);
  }
  return out;
}

/** The lowest-ranked role at or below [roleId] that is given [key] directly, if not [roleId] itself. */
export function inheritedFrom(c: Chapter, roleId: string, key: PowerKey): Role | null {
  const role = c.roles.find((x) => x.id === roleId);
  if (!role) return null;
  const below = c.roles
    .filter((x) => !x.probation && x.id !== roleId && x.rank > role.rank && (c.grants[x.id] ?? []).includes(key))
    .sort((a, b) => b.rank - a.rank);
  return below[0] ?? null;
}

export const fullName = (m: Member) => `${m.first} ${m.last}`;
export const initials = (s: string) =>
  s
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function feeFor(f: Fee, memberId: string) {
  const paid = f.payments.filter((p) => p.memberId === memberId).reduce((s, p) => s + p.cents, 0);
  const left = Math.max(0, f.cents - paid);
  const overdue = left > 0 && f.dueAt < Date.now();
  const status: "paid" | "partial" | "unpaid" | "overdue" = left === 0 ? "paid" : overdue ? "overdue" : paid > 0 ? "partial" : "unpaid";
  return { paid, left, status };
}

export const owesFee = (c: Chapter, f: Fee) => c.members.filter((m) => !m.suspended && (f.audienceRoles.length === 0 ? false : f.audienceRoles.includes(m.roleId)));

/** Attendance rate over past mandatory events the member was expected at: present + late, excused not counted against. */
export function attendanceRate(c: Chapter, memberId: string) {
  const now = Date.now();
  let expected = 0;
  let came = 0;
  for (const e of c.events) {
    if (e.startsAt > now || !e.mandatory) continue;
    const rs = e.rsvps.find((x) => x.memberId === memberId);
    if (!rs || !rs.attendance || rs.attendance === "excused") continue;
    expected += 1;
    if (rs.attendance === "present" || rs.attendance === "late") came += 1;
  }
  return expected ? Math.round((came / expected) * 100) : null;
}

/** Who a feed reaches for [what] ("view" or "post"): anyone in one of its roles or groups (unioned), suspended members never. */
export function feedReach(c: Chapter, f: Feed, what: "view" | "post") {
  const roles = what === "view" ? f.viewRoles : f.postRoles;
  const groups = what === "view" ? f.viewGroups : f.postGroups;
  return c.members
    .filter((m) => !m.suspended)
    .map((m) => ({ m, byRole: roles.includes(m.roleId), viaGroups: m.groups.filter((g) => groups.includes(g)) }))
    .filter((x) => x.byRole || x.viaGroups.length > 0);
}

/** A role-and-group selection in words, like the app's own summary: "Everyone", "President, Vice President + Recruitment". */
export function scopeLabel(c: Chapter, roles: string[], groups: string[]) {
  const ordinary = c.roles.filter((r) => !r.probation);
  const all = ordinary.length > 0 && ordinary.every((r) => roles.includes(r.id));
  const roleNames = [...c.roles].sort((a, b) => a.rank - b.rank).filter((r) => roles.includes(r.id)).map((r) => r.name);
  const groupNames = c.groups.filter((g) => groups.includes(g.id)).map((g) => g.name);
  const parts = [all ? "Everyone" : roleNames.join(", "), groupNames.join(", ")].filter(Boolean);
  return parts.join(" + ") || "No one";
}

/** Every excuse a member has sent this term, across events. */
export const excusesBy = (c: Chapter, memberId: string) =>
  c.events.flatMap((e) => e.rsvps.filter((r) => r.memberId === memberId && r.excuse).map((r) => ({ e, excuse: r.excuse! })));

export const money = (cents: number, exact = false) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: exact || cents % 100 ? 2 : 0, maximumFractionDigits: 2 });
