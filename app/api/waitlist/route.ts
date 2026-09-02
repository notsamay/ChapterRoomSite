import { NextResponse } from "next/server";

/**
 * Waitlist intake.
 *
 * Set `WAITLIST_WEBHOOK_URL` to anything that accepts a JSON POST — the Google Sheet Apps Script
 * in `scripts/waitlist-sheet.gs`, a Slack incoming webhook, your own endpoint. Without it the
 * route still validates and answers, but the signup is only written to the server log,
 * so wire the webhook up before this site takes real traffic.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = { email?: unknown; chapter?: unknown; company?: unknown };

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON." }, { status: 400 });
  }

  // Honeypot: real people never fill this in.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const chapter = typeof body.chapter === "string" ? body.chapter.trim() : "";

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 422 });
  }
  if (chapter.length < 2 || chapter.length > 160) {
    return NextResponse.json({ error: "Tell us your chapter and school." }, { status: 422 });
  }

  const signup = { email, chapter, submittedAt: new Date().toISOString() };
  const webhook = process.env.WAITLIST_WEBHOOK_URL;

  if (!webhook) {
    console.warn(
      "[waitlist] WAITLIST_WEBHOOK_URL is not set — this signup was logged and nothing else:",
      signup
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: `New Chapter Room waitlist signup: ${chapter} — ${email}`,
        ...signup,
      }),
    });
    if (!response.ok) throw new Error(`webhook responded ${response.status}`);
  } catch (error) {
    console.error("[waitlist] delivery failed", error, signup);
    return NextResponse.json({ error: "We couldn't save that. Try again in a moment." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
