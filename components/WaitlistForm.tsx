"use client";

import { useState, type FormEvent } from "react";

type Status = { state: "idle" | "sending" | "done" } | { state: "error"; message: string };

const FIELD =
  "w-full rounded-full border border-cream/25 bg-cream/[0.08] px-[22px] py-[17px] text-center text-[15.5px] text-cream transition-colors focus:border-cream/50 disabled:opacity-60";

export default function WaitlistForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ state: "sending" });
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          phone: data.get("phone"),
          chapter: data.get("chapter"),
          company: data.get("company"),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Something went wrong.");
      form.reset();
      setStatus({ state: "done" });
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    }
  }

  if (status.state === "done") {
    return (
      <div
        role="status"
        className="mx-auto flex max-w-[440px] flex-col items-center gap-3 rounded-[28px] border border-sage/30 bg-sage/10 px-8 py-9"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/20 text-sage">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <p className="text-[19px] font-semibold">You&rsquo;re on the list.</p>
        <p className="text-[15px] leading-relaxed text-cream/65">
          We&rsquo;ll reach out from an @joinchapterroom.com address ahead of the spring 2027 launch.
        </p>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-[440px] flex-col gap-3" noValidate>
      <label htmlFor="waitlist-email" className="sr-only">
        Your school email
      </label>
      <input
        id="waitlist-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        disabled={sending}
        placeholder="you@school.edu"
        className={FIELD}
      />

      <label htmlFor="waitlist-phone" className="sr-only">
        Contact phone number
      </label>
      <input
        id="waitlist-phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="tel"
        disabled={sending}
        placeholder="Phone number"
        className={FIELD}
      />

      <label htmlFor="waitlist-chapter" className="sr-only">
        Chapter
      </label>
      <input
        id="waitlist-chapter"
        name="chapter"
        type="text"
        required
        autoComplete="organization"
        disabled={sending}
        placeholder="Chapter"
        className={FIELD}
      />

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-cream py-[18px] text-[16px] font-semibold text-pine transition-colors hover:bg-moss hover:text-cream disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Sending…" : "Request early access"}
      </button>

      {status.state === "error" && (
        <p role="alert" className="text-[14px] text-brick">
          {status.message}
        </p>
      )}
    </form>
  );
}
