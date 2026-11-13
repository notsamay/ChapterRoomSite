import type { SupabaseClient } from "@supabase/supabase-js";
import { POWERS, type AttendanceStatus, type Chapter, type Fee, type Feed, type Member, type OrgEvent, type Payment, type Poll, type PowerKey, type Rsvp, type SecurityEvent } from "./data";

// Reads the signed-in officer's chapter from the app's Supabase tables into the portal's Chapter
// shape. Everything is read as the officer, so row-level security decides what comes back, exactly
// as it does in the app.

export class PortalAccessError extends Error {}

const ms = (iso: string | null | undefined) => (iso ? new Date(iso).getTime() : 0);
const KEYS = new Set<string>(POWERS.map((p) => p.key));

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

async function rows(q: PromiseLike<{ data: Row[] | null; error: { message: string } | null }>, what: string): Promise<Row[]> {
  const { data, error } = await q;
  if (error) throw new Error(`Couldn't load ${what}: ${error.message}`);
  return data ?? [];
}

// The captured frames live in the private security-captures bucket; the row keeps the object's
// URL. The browser can't send the officer's token with an <img>, so each one gets a short-lived
// signed URL instead (storage's own rules decide who may have one).
const BUCKET = "security-captures";
async function captureUrls(sb: SupabaseClient, rows: Row[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const paths: { id: string; path: string }[] = [];
  for (const r of rows) {
    const key = String(r.capture_object_key ?? "");
    const at = key.indexOf(`/${BUCKET}/`);
    const path = at >= 0 ? decodeURIComponent(key.slice(at + BUCKET.length + 2).split("?")[0]) : key.includes("/") && !key.startsWith("http") ? key : "";
    if (path) paths.push({ id: r.id, path });
  }
  if (!paths.length) return out;
  const { data } = await sb.storage.from(BUCKET).createSignedUrls(paths.map((p) => p.path), 60 * 60);
  (data ?? []).forEach((d, k) => {
    if (d?.signedUrl) out.set(paths[k].id, d.signedUrl);
  });
  return out;
}

export async function loadChapter(sb: SupabaseClient, userId: string): Promise<Chapter> {
  const { data: meRow, error: meErr } = await sb.from("members").select("id, chapter_id").eq("id", userId).maybeSingle();
  if (meErr) throw new Error(`Couldn't load your account: ${meErr.message}`);
  if (!meRow?.chapter_id) throw new PortalAccessError("Your account isn’t in an org yet. Join or start one in the app first.");
  const chapterId: string = meRow.chapter_id;

  const [chapterRows, roleRows, grantRows, groupRows, memberRows, membershipRows, suspensionRows, eventRows, rsvpRows, privateRows, ticketRows, securityRows, feedRows, postPollRows, messagePollRows] =
    await Promise.all([
      rows(sb.from("chapters").select("id, name, school_id").eq("id", chapterId), "your org"),
      rows(sb.from("roles").select("id, name, rank, is_probation").eq("chapter_id", chapterId).order("rank"), "roles"),
      rows(sb.from("role_permissions").select("role_id, permission_key"), "powers"),
      rows(sb.from("groups").select("id, name, role_id").eq("chapter_id", chapterId).order("name"), "groups"),
      rows(sb.from("members").select("id, first_name, last_name, role_id, suspended, created_at").eq("chapter_id", chapterId), "members"),
      rows(sb.from("group_memberships").select("group_id, member_id"), "group members"),
      rows(sb.from("member_suspensions").select("member_id, reason"), "suspensions"),
      rows(
        sb
          .from("events")
          .select("id, title, location, mandatory, starts_at, audience_roles, audience_groups, check_in_radius_m, late_after_minutes, kind, tickets_enabled, ticket_price_cents, ticket_options, payment_plan, sales_close_at")
          .eq("chapter_id", chapterId)
          .order("starts_at"),
        "events"
      ),
      rows(sb.from("event_rsvps").select("id, event_id, member_id, status, attendance_status, checked_in_at, excuse_category, excuse_status, updated_at").eq("chapter_id", chapterId), "RSVPs"),
      rows(sb.from("event_rsvp_private").select("rsvp_id, excuse_note, review_note"), "excuse notes"),
      rows(sb.from("tickets").select("id, event_id, buyer_member_id, status, amount_cents, paid_at, ach_processing_since").eq("chapter_id", chapterId).in("status", ["paid", "redeemed"]), "payments"),
      rows(
        sb.from("security_events").select("id, actor_id, event_type, security_level, device, captured_screen, occurred_at, reviewed, archived, capture_object_key").eq("chapter_id", chapterId).order("occurred_at", { ascending: false }).limit(500),
        "the security log"
      ),
      rows(sb.from("feeds").select("id, name, audience_roles, audience_groups, post_roles, post_groups, security_level").eq("chapter_id", chapterId).order("name"), "feeds"),
      rows(sb.from("posts").select("id, feed_id, content, created_at").eq("post_type", "poll").order("created_at", { ascending: false }).limit(200), "polls"),
      rows(sb.from("messages").select("id, chat_id, poll_content, sent_at, chats(name)").eq("message_type", "poll").eq("is_deleted", false).order("sent_at", { ascending: false }).limit(200), "chat polls"),
    ]);

  const chapterRow = chapterRows[0];
  if (!chapterRow) throw new PortalAccessError("Couldn’t find your org.");
  let school = "";
  if (chapterRow.school_id) {
    const { data } = await sb.from("schools").select("name").eq("id", chapterRow.school_id).maybeSingle();
    school = data?.name ?? "";
  }

  // Roles and the powers given to each directly; ranks above inherit (see effectivePowers).
  const roles = roleRows.map((r) => ({ id: r.id as string, name: r.name as string, rank: r.rank as number, probation: Boolean(r.is_probation) }));
  const roleIds = new Set(roles.map((r) => r.id));
  const grants: Record<string, PowerKey[]> = {};
  for (const g of grantRows) {
    if (!roleIds.has(g.role_id) || !KEYS.has(g.permission_key)) continue;
    (grants[g.role_id] ??= []).push(g.permission_key as PowerKey);
  }

  const groups = groupRows.map((g) => ({ id: g.id as string, name: g.name as string, roleId: (g.role_id as string | null) ?? null }));
  const groupIds = new Set(groups.map((g) => g.id));
  const groupsOf = new Map<string, string[]>();
  for (const gm of membershipRows) {
    if (!groupIds.has(gm.group_id)) continue;
    groupsOf.set(gm.member_id, [...(groupsOf.get(gm.member_id) ?? []), gm.group_id]);
  }
  const reasons = new Map<string, string>(suspensionRows.map((s) => [s.member_id, s.reason]));

  // Email lives in Supabase Auth, which the browser can't read for other people.
  const members: Member[] = memberRows
    .map((m) => ({
      id: m.id as string,
      first: (m.first_name as string) || "",
      last: (m.last_name as string) || "",
      email: "",
      roleId: m.role_id as string,
      groups: groupsOf.get(m.id) ?? [],
      suspended: Boolean(m.suspended),
      suspendReason: reasons.get(m.id) || undefined,
      joined: String(m.created_at ?? "").slice(0, 10),
    }))
    .sort((a, b) => (roles.find((r) => r.id === a.roleId)?.rank ?? 1e9) - (roles.find((r) => r.id === b.roleId)?.rank ?? 1e9) || `${a.first} ${a.last}`.localeCompare(`${b.first} ${b.last}`));

  const me = members.find((m) => m.id === userId);
  if (!me) throw new PortalAccessError("Couldn’t find your member profile.");

  // A role list that covers every ordinary role reads as "everyone" in the portal.
  const ordinary = roles.filter((r) => !r.probation).map((r) => r.id);
  const asAudience = (ids: string[] | null) => {
    const list = (ids ?? []).filter((id) => roleIds.has(id));
    return ordinary.length > 0 && ordinary.every((id) => list.includes(id)) ? [] : list;
  };
  const reaches = (m: Member, audRoles: string[] | null, audGroups: string[] | null) =>
    !m.suspended && ((audRoles ?? []).includes(m.roleId) || m.groups.some((g) => (audGroups ?? []).includes(g)));

  // Events and their RSVPs. Anyone the event reaches without an RSVP yet still gets a row, so
  // officers can take their attendance.
  const notes = new Map<string, Row>(privateRows.map((p) => [p.rsvp_id, p]));
  const rsvpsBy = new Map<string, Row[]>();
  for (const r of rsvpRows) rsvpsBy.set(r.event_id, [...(rsvpsBy.get(r.event_id) ?? []), r]);

  const events: OrgEvent[] = eventRows
    .filter((e) => (e.kind ?? "event") === "event")
    .map((e) => {
      const rsvps: Rsvp[] = (rsvpsBy.get(e.id) ?? []).map((r) => {
        const note = notes.get(r.id);
        const rs: Rsvp = {
          id: r.id,
          memberId: r.member_id,
          status: r.status === "going" || r.status === "not_going" ? r.status : null,
          attendance: (["present", "late", "excused", "absent"].includes(r.attendance_status) ? r.attendance_status : null) as AttendanceStatus | null,
          checkedInAt: r.checked_in_at ? ms(r.checked_in_at) : undefined,
        };
        if (r.excuse_status)
          rs.excuse = {
            category: r.excuse_category ?? "Other",
            note: note?.excuse_note ?? "",
            status: r.excuse_status,
            at: ms(r.updated_at),
            reviewNote: note?.review_note ?? undefined,
          };
        return rs;
      });
      const has = new Set(rsvps.map((r) => r.memberId));
      for (const m of members) if (!has.has(m.id) && reaches(m, e.audience_roles, e.audience_groups)) rsvps.push({ memberId: m.id, status: null, attendance: null });
      return {
        id: e.id,
        title: e.title,
        startsAt: ms(e.starts_at),
        location: e.location ?? "",
        mandatory: Boolean(e.mandatory),
        radiusM: e.check_in_radius_m ?? 100,
        lateAfterMin: e.late_after_minutes ?? 10,
        audienceRoles: asAudience(e.audience_roles),
        rsvps,
      };
    });

  // Vouchers: payment events (membership fees and merch) plus ticketed events, with what's been paid.
  const paidBy = new Map<string, Payment[]>();
  for (const t of ticketRows) {
    const p: Payment = { memberId: t.buyer_member_id, cents: t.amount_cents ?? 0, at: ms(t.paid_at), method: t.ach_processing_since ? "bank" : "card" };
    paidBy.set(t.event_id, [...(paidBy.get(t.event_id) ?? []), p]);
  }
  const fees: Fee[] = eventRows
    .filter((e) => e.kind === "payment" || e.tickets_enabled)
    .map((e) => {
      const installments: Row[] = e.payment_plan?.installments ?? [];
      const type: Fee["type"] = e.kind !== "payment" ? "ticket" : e.ticket_options && !installments.length && !e.mandatory ? "merch" : "membership";
      const lastInstallment = installments.length ? ms(installments[installments.length - 1].due_at) : 0;
      return {
        id: e.id,
        title: e.title,
        cents: e.ticket_price_cents ?? 0,
        dueAt: e.kind === "payment" ? ms(e.sales_close_at) || lastInstallment || ms(e.starts_at) : ms(e.starts_at),
        audienceRoles: type === "membership" ? (e.audience_roles ?? []).filter((id: string) => roleIds.has(id)) : asAudience(e.audience_roles),
        plan: Math.max(1, installments.length),
        membership: type === "membership",
        type,
        payments: paidBy.get(e.id) ?? [],
      };
    })
    .sort((a, b) => b.dueAt - a.dueAt);

  const SEC_TYPES = new Set(["screenshot_taken", "recording_started", "screenshot_attempted"]);
  const secRows = securityRows.filter((s) => !s.archived && SEC_TYPES.has(s.event_type));
  const captures = await captureUrls(sb, secRows);
  const security: SecurityEvent[] = secRows
    .map((s) => ({
      id: s.id,
      memberId: s.actor_id,
      type: s.event_type,
      level: s.security_level === "high" ? "high" : "medium",
      where: s.captured_screen ?? "",
      device: s.device ?? "",
      at: ms(s.occurred_at),
      reviewed: Boolean(s.reviewed),
      capture: captures.get(s.id) ?? null,
    }));

  const level = (x: string): Feed["security"] => (x === "high" || x === "medium" ? x : "low");
  const feeds: Feed[] = feedRows.map((f) => ({
    id: f.id,
    name: f.name,
    viewRoles: (f.audience_roles ?? []).filter((id: string) => roleIds.has(id)),
    viewGroups: f.audience_groups ?? [],
    postRoles: (f.post_roles ?? []).filter((id: string) => roleIds.has(id)),
    postGroups: f.post_groups ?? [],
    security: level(f.security_level),
  }));

  // Polls posted in feeds and in chats; both store the same poll shape.
  const toPoll = (id: string, content: Row | null, where: string, audience: string[], createdAt: string): Poll | null => {
    if (!content?.question || !Array.isArray(content.options)) return null;
    const closesAt = content.closesAt ? ms(content.closesAt) : null;
    return {
      id,
      question: content.question,
      where,
      options: content.options.map((o: Row, k: number) => ({ id: String(o.id ?? k), label: String(o.label ?? ""), voterIds: Array.isArray(o.voterIds) ? o.voterIds : [] })),
      audienceRoles: audience,
      createdAt: ms(createdAt),
      closesAt,
      allowMultiple: Boolean(content.allowMultiple),
      hideResults: Boolean(content.hideResults),
      required: Boolean(content.required),
      anonymous: Boolean(content.anonymous),
      closed: closesAt !== null && closesAt < Date.now(),
    };
  };
  const feedById = new Map(feedRows.map((f) => [f.id, f]));
  const polls = [
    ...postPollRows.map((p) => {
      const f = feedById.get(p.feed_id);
      return f ? toPoll(p.id, p.content, f.name, asAudience(f.audience_roles), p.created_at) : null;
    }),
    ...messagePollRows.map((m) => toPoll(m.id, m.poll_content, m.chats?.name ?? "A chat", [], m.sent_at)),
  ]
    .filter((p): p is Poll => p !== null)
    .sort((a, b) => b.createdAt - a.createdAt);

  // Invite codes need officer access; the function says no otherwise, and the portal shows none.
  const { data: codeRows } = await sb.rpc("get_role_invite_codes");
  const codes = ((codeRows as Row[] | null) ?? []).map((c) => ({ roleId: c.role_id as string, code: c.code as string, expiresAt: ms(c.expires_at) }));

  return {
    id: chapterId,
    name: chapterRow.name,
    school,
    meId: me.id,
    roles,
    grants,
    groups,
    members,
    codes,
    events,
    fees,
    payouts: null,
    security,
    activity: [],
    polls,
    feeds,
    live: true,
  };
}
