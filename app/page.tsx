import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import StoreBadges from "@/components/StoreBadges";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const features = [
  {
    icon: (
      <Icon>
        <path d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </Icon>
    ),
    title: "Geofenced attendance",
    body: "Members check in to chapter, study hours, and events only when they're physically there. Server-side verification stops GPS spoofing cold.",
    tag: "Spoof-proof",
  },
  {
    icon: (
      <Icon>
        <line x1="12" y1="2.5" x2="12" y2="21.5" />
        <path d="M17 6.5H9.8a3.2 3.2 0 0 0 0 6.4h4.4a3.2 3.2 0 0 1 0 6.4H6.5" />
      </Icon>
    ),
    title: "Dues tracking",
    body: "See who's paid, who's behind, and what's outstanding at a glance. Export everything to CSV for your treasurer and nationals.",
    tag: "CSV export",
  },
  {
    icon: (
      <Icon>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </Icon>
    ),
    title: "Feeds",
    body: "Broadcast announcements from exec to the house — clean, one-way, and impossible to lose in a 400-message thread.",
    tag: "Exec → House",
  },
  {
    icon: (
      <Icon>
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </Icon>
    ),
    title: "Group chats",
    body: "Private chats for new member classes, committees, and officer boards. Built into the same app, gated by the same roles.",
    tag: "Role-gated",
  },
  {
    icon: (
      <Icon>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </Icon>
    ),
    title: "Screenshot protection",
    body: "Sensitive channels detect screenshots and watermark content per member, so what's said in the house stays in the house.",
    tag: "Watermarked",
  },
  {
    icon: (
      <Icon>
        <line x1="21" y1="5" x2="14" y2="5" />
        <line x1="10" y1="5" x2="3" y2="5" />
        <line x1="21" y1="12" x2="12" y2="12" />
        <line x1="8" y1="12" x2="3" y2="12" />
        <line x1="21" y1="19" x2="16" y2="19" />
        <line x1="12" y1="19" x2="3" y2="19" />
        <line x1="14" y1="3" x2="14" y2="7" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <line x1="16" y1="17" x2="16" y2="21" />
      </Icon>
    ),
    title: "Custom roles & permissions",
    body: "Build your chapter's exact hierarchy — any roles, any names, any permissions. Nothing is hardcoded to someone else's org chart.",
    tag: "Fully customizable",
  },
];

const roles = [
  {
    tier: "Tier 01",
    name: "President",
    body: "Full control: roles, roster, settings, and every feed and chat in the house.",
  },
  {
    tier: "Tier 02",
    name: "Exec",
    body: "Post to feeds, run attendance, manage dues, and moderate their committees.",
  },
  {
    tier: "Tier 03",
    name: "Active",
    body: "Check in, pay dues, chat, and stay current with everything happening in the house.",
  },
  {
    tier: "Tier 04",
    name: "New Member",
    body: "Scoped access for new members — see what they need, nothing they don't.",
  },
  {
    tier: "Tier 05",
    name: "Suspended",
    body: "One tap freezes access without deleting history. Reinstate just as fast.",
  },
];

const securityPoints = [
  "Server-side location checks — attendance can't be spoofed from a couch across town.",
  "Per-member watermarking traces any leaked screenshot back to its source.",
  "Custom role gating — every member sees exactly the lane you define, no more, no less.",
  "Complete records — attendance and dues history your officers can export any time.",
];

export default function Home() {
  return (
    <main id="top">
      {/* ---------- nav ---------- */}
      <nav className="sticky top-0 z-50 border-b border-cream/15 bg-pine-deep/90 backdrop-blur">
        <div className="flex h-[72px] w-full items-center justify-between pl-8 pr-6">
          <a href="#top" className="flex items-center gap-5" aria-label="Chapter Room home">
            <Image src="/logo-mark.png" alt="" width={39} height={32} className="h-8 w-auto" />
            <span className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-cream">
              Chapter Room
            </span>
          </a>
          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-sage transition-colors hover:text-cream sm:block"
            >
              Features
            </a>
            <a
              href="#security"
              className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-sage transition-colors hover:text-cream sm:block"
            >
              Security
            </a>
            <a
              href="#notify"
              className="flex items-center gap-2.5 rounded-full bg-gold py-2 pl-4 pr-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-pine-deep shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine-deep/40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pine-deep" />
              </span>
              Coming soon
            </a>
          </div>
        </div>
      </nav>

      {/* ---------- hero ---------- */}
      <header className="px-6 pb-20 pt-24 text-center">
        <div className="mx-auto max-w-6xl">
          <h1 className="mx-auto mb-5 max-w-[14ch] font-slab text-5xl leading-[1.05] md:text-7xl">
            Run your chapter from your{" "}
            <span className="bg-gradient-to-r from-gold to-gold/85 bg-clip-text text-transparent">
              pocket
            </span>
            .
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-sage md:text-xl">
            Attendance, dues, announcements, and chats — everything your exec board runs on
            spreadsheets and group texts, in one app built for chapters.
          </p>
          <StoreBadges variant="dark" />
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-gold">
            iOS &amp; Android · 2026
          </p>
        </div>
      </header>

      {/* ---------- features ---------- */}
      <div className="battlement flip" aria-hidden="true" />
      <section id="features" className="bg-cream px-6 py-24 text-pine">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 max-w-[20ch] font-slab text-3xl md:text-5xl">
            Everything a chapter runs on. Nothing it doesn&apos;t.
          </h2>
          <p className="mb-12 max-w-xl text-lg text-pine-soft/80">
            Chapter Room replaces the mess of GroupMe threads, Google Sheets, and Venmo requests
            with one system your whole house actually uses.
          </p>
          <div className="grid gap-px border border-pine/15 bg-pine/15 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="group h-full border-t-4 border-transparent bg-cream p-7 transition-colors hover:border-gold hover:bg-[#EFE5CE]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-gold bg-pine text-gold">
                    {f.icon}
                  </div>
                  <h3 className="mb-2.5 font-slab text-lg">{f.title}</h3>
                  <p className="text-[15px] leading-relaxed text-pine-soft/90">{f.body}</p>
                  <span className="mt-4 inline-block rounded-full bg-pine-soft px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream">
                    {f.tag}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <div className="battlement-pine" aria-hidden="true" />

      {/* ---------- roles ---------- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 font-slab text-3xl md:text-5xl">Your hierarchy. Your rules.</h2>
          <p className="mb-12 max-w-2xl text-lg text-sage">
            No two chapters run the same way — so nothing here is hardcoded. Create your own
            roles, name them whatever your house calls them, and decide exactly what each one can
            see and do.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((r, i) => (
              <Reveal key={r.name} delay={i * 60}>
                <div className="h-full rounded-2xl border border-cream/15 border-l-4 border-l-gold bg-pine-soft p-6 transition-all hover:-translate-y-1 hover:border-gold">
                  <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                    {r.tier}
                  </span>
                  <h4 className="mb-2 font-slab text-lg">{r.name}</h4>
                  <p className="text-sm leading-relaxed text-sage">{r.body}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={roles.length * 60}>
              <div className="h-full rounded-2xl border border-dashed border-gold/60 bg-transparent p-6 transition-all hover:-translate-y-1 hover:border-gold">
                <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                  Tier ∞
                </span>
                <h4 className="mb-2 font-slab text-lg">Make your own</h4>
                <p className="text-sm leading-relaxed text-sage">
                  Risk manager, social chair, house director — add any role and set its
                  permissions in seconds.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- security ---------- */}
      <section id="security" className="bg-pine-deep px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="mb-5 font-slab text-3xl md:text-5xl">
              Trust isn&apos;t a feature. It&apos;s the foundation.
            </h2>
            <p className="mb-4 max-w-[52ch] text-sage">
              Greek life runs on trust. Chapter Room is engineered so your chapter&apos;s internal
              business can&apos;t leak, can&apos;t be faked, and can&apos;t be lost.
            </p>
            <ul className="mt-2">
              {securityPoints.map((point, i) => (
                <Reveal key={i} delay={i * 60}>
                  <li
                    className={`flex items-start gap-3.5 border-t border-cream/15 py-4 text-[15.5px] ${
                      i === securityPoints.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <span className="shrink-0 font-mono text-gold">■</span>
                    {point}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal>
            <div className="rounded-2xl border border-cream/10 bg-gradient-to-br from-pine-soft to-pine-deep p-10 md:p-12">
              <div className="mb-8 h-1 w-12 bg-gold" />
              <p className="font-slab text-3xl leading-[1.15] text-cream md:text-4xl">
                Private where it should be. Accountable where it counts.
              </p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-sage">
                How Chapter Room is built
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <div className="battlement-gold flip" aria-hidden="true" />
      <section id="notify" className="bg-cream px-6 py-24 text-center text-pine">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 font-slab text-4xl md:text-6xl">
            Your chapter&apos;s new HQ is almost here.
          </h2>
          <p className="mx-auto mb-9 max-w-lg text-lg text-pine-soft/80">
            Chapter Room is coming soon to the App Store and Google Play. Built by brothers who
            got tired of spreadsheets.
          </p>
          <StoreBadges variant="light" />
        </div>
      </section>
      <div className="battlement-pine" aria-hidden="true" />

      {/* ---------- footer ---------- */}
      <footer className="border-t border-cream/15 px-6 py-9">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={34} height={28} className="h-7 w-auto" />
            <span className="font-mono text-xs font-medium uppercase tracking-[0.22em]">Chapter Room</span>
          </div>
          <small className="text-[13px] text-sage">© 2026 Chapter Room</small>
        </div>
      </footer>
    </main>
  );
}
