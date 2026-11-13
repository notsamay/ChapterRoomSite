"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { feeFor, fullName, owesFee } from "./data";
import { usePortal } from "./store";
import { applyTheme, readTheme, saveTheme, type ThemePref } from "./theme";
import { Avatar, Icon, type IconName } from "./ui";

// The portal's frame: a quiet grey sidebar (the org, the pages in the app's own order with counts
// of what's waiting, light or dark, who you are) and the page beside it. On a phone the sidebar
// folds into a bar. One org: an officer has one chapter in the app today.

export default function Shell({ children }: { children: ReactNode }) {
  const { chapter, toasts, dismiss, live, signOut } = usePortal();
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [path]);
  // "/" jumps to the page's search box, as in most web apps.
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const box = document.querySelector<HTMLInputElement>(".pt-main .pt-search input");
      if (box) {
        e.preventDefault();
        box.focus();
        box.select();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const excuses = chapter.events.reduce((n, e) => n + e.rsvps.filter((r) => r.excuse?.status === "pending").length, 0);
  const overdue = new Set(
    chapter.fees.filter((f) => f.membership).flatMap((f) => owesFee(chapter, f).filter((m) => feeFor(f, m.id).status === "overdue").map((m) => m.id))
  ).size;
  const unreviewed = chapter.security.filter((s) => !s.reviewed).length;
  const openPolls = chapter.polls.filter((p) => !p.closed).length;
  const me = chapter.members.find((m) => m.id === chapter.meId)!;
  const myRole = chapter.roles.find((r) => r.id === me.roleId)!;

  // Each count says what it counts, on hover and to screen readers.
  type Item = { href: string; label: string; icon: IconName; count?: number; tone?: "bad"; means?: string };
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  const MAIN: Item[] = [
    { href: "/portal", label: "Home", icon: "home" },
    { href: "/portal/events", label: "Events", icon: "events", count: excuses || undefined, means: plural(excuses, "excuse waiting", "excuses waiting") },
    { href: "/portal/vouchers", label: "Vouchers", icon: "fees", count: overdue || undefined, tone: "bad", means: plural(overdue, "member overdue", "members overdue") },
    { href: "/portal/polls", label: "Polls", icon: "poll", count: openPolls || undefined, means: plural(openPolls, "poll open", "polls open") },
    { href: "/portal/security", label: "Security", icon: "security", count: unreviewed || undefined, tone: "bad", means: plural(unreviewed, "event not reviewed", "events not reviewed") },
  ];
  const ADMIN: Item[] = [
    { href: "/portal/members", label: "Members", icon: "members", count: chapter.members.length, means: plural(chapter.members.length, "member", "members") },
    { href: "/portal/roles", label: "Roles and groups", icon: "roles" },
  ];
  const link = (n: Item) => {
    const on = n.href === "/portal" ? path === "/portal" : path?.startsWith(n.href);
    return (
      <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined}>
        <Icon name={n.icon} />
        <span>{n.label}</span>
        {n.count ? (
          <span className="pt-count" data-tone={n.tone} title={n.means}>
            <span aria-hidden="true">{n.count}</span>
            <span className="pt-sr">{n.means}</span>
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <div className="pt-app">
      <aside className="pt-side" data-open={menu}>
        <div className="pt-side-top">
          <Link href="/portal" className="pt-brand" aria-label="Chapter Room officer portal">
            {/* Two lockups; the theme's CSS shows the one that reads on its sidebar. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pt-logo-light" src="/kit/lockup-on-ivory.png" alt="Chapter Room" height={22} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pt-logo-dark" src="/kit/lockup-on-emerald.png" alt="" aria-hidden="true" height={22} />
          </Link>
          <button type="button" className="pt-menu-btn" onClick={() => setMenu((v) => !v)} aria-label="Menu" aria-expanded={menu}>
            <span />
            <span />
          </button>
        </div>

        <div className="pt-side-body">
          <div className="pt-org">
            <span className="pt-org-name">
              {chapter.name}
              {chapter.school && <small>{chapter.school}</small>}
            </span>
          </div>

          <nav className="pt-nav" aria-label="Portal">
            {MAIN.map(link)}
            <span className="pt-nav-head">Admin</span>
            {ADMIN.map(link)}
          </nav>

          <div className="pt-side-foot">
            {!live && <span className="pt-sample">Sample data</span>}
            <ThemeSwitch />
            <div className="pt-me">
              <Avatar name={fullName(me)} size={34} />
              <span>
                <b>{fullName(me)}</b>
                <small>{myRole.name}</small>
              </span>
            </div>
            {live && (
              <button type="button" className="pt-signout" onClick={signOut}>
                Sign out
              </button>
            )}
            <Link href="/" className="pt-back">
              <Icon name="back" size={18} /> joinchapterroom.com
            </Link>
          </div>
        </div>
      </aside>

      <main className="pt-main">{children}</main>

      <div className="pt-toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="pt-toast" data-tone={t.tone}>
            <Icon name={t.tone === "bad" ? "x" : "check"} size={18} />
            {t.text}
            {t.action && (
              <button
                type="button"
                className="pt-toast-action"
                onClick={() => {
                  t.action!.run();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Before paint on the client; a no-op on the server, where there's no stored choice to read.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Light, Dark or System (follows the device). Remembered in this browser. */
function ThemeSwitch() {
  const [pref, setPref] = useState<ThemePref>("system");
  const ref = useRef<HTMLSpanElement>(null);
  useBeforePaint(() => {
    const saved = readTheme();
    setPref(saved);
    applyTheme(ref.current?.closest(".pt-root") ?? null, saved);
  }, []);
  const pick = (p: ThemePref) => {
    setPref(p);
    saveTheme(p);
    applyTheme(ref.current?.closest(".pt-root") ?? null, p);
  };
  const OPTS: { id: ThemePref; label: string; icon: IconName }[] = [
    { id: "light", label: "Light", icon: "sun" },
    { id: "dark", label: "Dark", icon: "moon" },
    { id: "system", label: "System", icon: "system" },
  ];
  return (
    <span ref={ref} className="pt-seg pt-theme" role="radiogroup" aria-label="Theme">
      {OPTS.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={pref === o.id} onClick={() => pick(o.id)}>
          <Icon name={o.icon} size={14} />
          {o.label}
        </button>
      ))}
    </span>
  );
}
