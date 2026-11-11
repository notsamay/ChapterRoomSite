"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { PICK_SCHOOL } from "./MapPicker";

/** Which launch campus, if any, a typed school name means. */
function launchCampus(raw: string): string | null {
  const n = raw.toLowerCase().replace(/[^a-z ]/g, " ").replace(/ +/g, " ").trim();
  const pre = (w: string) => n.length >= 3 && w.startsWith(n);
  if (pre("clemson") || n.includes("clemson")) return "Clemson University";
  if (
    (n.length >= 15 && "university of south carolina".startsWith(n)) ||
    pre("south carolina") ||
    n.includes("south carolina") ||
    n === "gamecocks" ||
    n === "uofsc"
  )
    return "the University of South Carolina";
  if (
    pre("uw madison") ||
    (n.length >= 15 && "university of wisconsin".startsWith(n)) ||
    n.startsWith("university of wisconsin madison") ||
    n === "uw" ||
    n.includes("wisconsin madison") ||
    (n.includes("madison") && !n.includes("james")) ||
    n.includes("badger")
  )
    return "UW–Madison";
  return null;
}

type Status = { state: "idle" | "sending" | "done" } | { state: "error"; message: string };

/** The cream "join the waiting room." card that sits on the bottom edge of the map. */
export default function WaitingRoom() {
  const [school, setSchool] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [filled, setFilled] = useState(false);
  const card = useRef<HTMLDivElement>(null);

  // A school picked on the map lands here: fill it in, bring the card up, move on to Chapter.
  useEffect(() => {
    const onPick = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      setSchool(name);
      setFilled(true);
      setStatus((s) => (s.state === "done" ? s : { state: "idle" }));
      card.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => card.current?.querySelector<HTMLInputElement>('input[name="chapter"]')?.focus({ preventScroll: true }), 450);
      window.setTimeout(() => setFilled(false), 1600);
    };
    window.addEventListener(PICK_SCHOOL, onPick);
    return () => window.removeEventListener(PICK_SCHOOL, onPick);
  }, []);
  const typed = school.trim();
  const hit = launchCampus(typed);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus({ state: "sending" });
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          phone: data.get("phone"),
          school: data.get("school"),
          chapter: data.get("chapter"),
          company: data.get("company"),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Something went wrong.");
      setStatus({ state: "done" });
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    }
  }

  const sending = status.state === "sending";

  return (
    <div id="join" ref={card} className="cr-cta" data-reveal>
      <div className="cr-head" style={{ gap: 10 }}>
        <h2>join the waiting room.</h2>
        <p className="cr-cta-lead">
          Type your school to see where it stands. Not one of these three? We open new schools as chapters sign on.
        </p>
      </div>
      {status.state === "done" ? (
        <p role="status" className="cr-school-msg" data-hit="true">
          You’re in the waiting room{typed ? ` for ${typed}` : ""}.
        </p>
      ) : (
        <form className="cr-form" onSubmit={onSubmit} noValidate>
          <label className="cr-field">
            Find your school
            <input
              name="school"
              type="text"
              list="cr-schools"
              placeholder="Type your school"
              autoComplete="off"
              required
              disabled={sending}
              value={school}
              data-filled={filled}
              onChange={(e) => setSchool(e.target.value)}
            />
          </label>
          <datalist id="cr-schools">
            <option value="University of Wisconsin–Madison" />
            <option value="University of South Carolina" />
            <option value="Clemson University" />
          </datalist>
          <label className="cr-field">
            Chapter
            <input name="chapter" type="text" placeholder="Your chapter or org" autoComplete="organization" required disabled={sending} />
          </label>
          <label className="cr-field">
            School email
            <input name="email" type="email" placeholder="you@school.edu" autoComplete="email" required disabled={sending} />
          </label>
          <label className="cr-field">
            Phone
            <input name="phone" type="tel" inputMode="tel" placeholder="(555) 555-0123" autoComplete="tel" required disabled={sending} />
          </label>
          {/* Honeypot: hidden from people, irresistible to bots. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cr-honeypot" />
          {typed.length >= 2 && (
            <p role="status" className="cr-school-msg" data-hit={hit ? "true" : "false"}>
              {hit
                ? `Good news: Chapter Room launches at ${hit} in spring 2027.`
                : `You’re in the waiting room for ${typed}. We open new schools as chapters sign on.`}
            </p>
          )}
          {status.state === "error" && (
            <p role="alert" className="cr-form-error">
              {status.message}
            </p>
          )}
          <button type="submit" className="cr-submit" disabled={sending}>
            {sending ? "Sending…" : "Get early access"}
          </button>
        </form>
      )}
    </div>
  );
}
