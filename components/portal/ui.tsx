"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { initials } from "./data";

// Small building blocks shared by every portal page. Colours live in portal.css as light and dark
// tokens: the app's neutral greys, emerald for main buttons and "on" states, and the one red.

// ── Icons: thin line icons in the spirit of the app's Fluent set ─────────────────────────────────
const P = {
  home: "M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z",
  members: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.3 3.3 0 0 1 0 6.4M18 14.6c2 .6 3.3 2.4 3.6 5.4",
  roles: "M12 3 4.5 6v5.5c0 4.4 3.2 8 7.5 9.5 4.3-1.5 7.5-5.1 7.5-9.5V6zM9 12l2.2 2.2L15.5 10",
  events: "M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4M8 14h2.5M13.5 14H16M8 17h2.5",
  fees: "M3.5 7h17v11h-17zM3.5 10.5h17M7 14.5h3.5M16.5 4.5 7 7",
  security: "M12 3 4.5 6v5.5c0 4.4 3.2 8 7.5 9.5 4.3-1.5 7.5-5.1 7.5-9.5V6zM12 9v4M12 16v.2",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20",
  download: "M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14",
  check: "M5 12.5 9.5 17 19 7.5",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  copy: "M8.5 8.5h10v11h-10zM5.5 15.5v-11h10",
  refresh: "M19 12a7 7 0 1 1-2.1-5M19 4.5V8h-3.5",
  plus: "M12 5v14M5 12h14",
  chevron: "M8 10l4 4 4-4",
  right: "M10 7l5 5-5 5",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13z",
  bell: "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4",
  cash: "M3.5 7.5h17v9h-17zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6.5 10v.01M17.5 14v.01",
  back: "M14 7l-5 5 5 5",
  camera: "M4 8h3l1.5-2h7L17 8h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  record: "M4 7.5h11v9H4zM15 11l5-3v8l-5-3",
  poll: "M5 19.5V13M10 19.5V5M15 19.5v-9M20 19.5v-4.5M3.5 19.5h17",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
  moon: "M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z",
  system: "M3.5 5h17v11h-17zM9 20h6M12 16v4",
};
export type IconName = keyof typeof P;
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg className="pt-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}

export function Avatar({ name, size = 32, tone = 0 }: { name: string; size?: number; tone?: number }) {
  return (
    <span className="pt-avatar" data-tone={tone % 4} style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function PageHead({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <header className="pt-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="pt-head-actions">{children}</div>}
    </header>
  );
}

export function Button({
  children,
  onClick,
  kind = "plain",
  icon,
  disabled,
  type = "button",
  title,
}: {
  children?: ReactNode;
  onClick?: () => void;
  kind?: "primary" | "plain" | "ghost" | "danger";
  icon?: IconName;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  return (
    <button type={type} className="pt-btn" data-kind={kind} onClick={onClick} disabled={disabled} title={title}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "dark" }) {
  return (
    <span className="pt-badge" data-tone={tone}>
      {children}
    </span>
  );
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: string; count?: number }[] }) {
  return (
    <div className="pt-tabs" role="tablist">
      {items.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}>
          {t.label}
          {t.count ? <span className="pt-count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

/** A panel that slides in from the right, for one record's details. */
export function Drawer({ open, onClose, title, sub, children }: { open: boolean; onClose: () => void; title: ReactNode; sub?: ReactNode; children: ReactNode }) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className="pt-layer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="pt-drawer" role="dialog" aria-modal="true">
        <header className="pt-drawer-head">
          <div>
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
          </div>
          <button type="button" className="pt-x" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </header>
        <div className="pt-drawer-body">{children}</div>
      </aside>
    </div>
  );
}

/** A centred dialog for a decision: confirm, give a reason, enter an amount. */
export function Modal({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: string; children: ReactNode; actions: ReactNode }) {
  useEscape(open, onClose);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) ref.current?.querySelector<HTMLElement>("input, textarea, select")?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div className="pt-layer pt-layer-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="pt-modal" role="dialog" aria-modal="true" aria-label={title}>
        <h2>{title}</h2>
        <div className="pt-modal-body">{children}</div>
        <div className="pt-modal-actions">{actions}</div>
      </div>
    </div>
  );
}

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
}

/** A member's name that opens their record on Members (role, groups, attendance, payments). */
export function MemberLink({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <Link href={`/portal/members?m=${id}`} className={`pt-name-link${className ? ` ${className}` : ""}`} onClick={(e) => e.stopPropagation()}>
      {children}
    </Link>
  );
}

/** The search box used on list pages; "/" focuses it from anywhere on the page. */
export function SearchBox({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  return (
    <label className="pt-search">
      <Icon name="search" size={18} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && value && (e.stopPropagation(), onChange(""))}
        placeholder={placeholder}
        aria-label={label}
      />
      <kbd className="pt-kbd" aria-hidden="true">
        /
      </kbd>
    </label>
  );
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function Empty({ children }: { children: ReactNode }) {
  return <div className="pt-empty">{children}</div>;
}

export function Check({ checked, onChange, label, indeterminate }: { checked: boolean; onChange: (v: boolean) => void; label: string; indeterminate?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return <input ref={ref} type="checkbox" className="pt-check" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />;
}

/** Downloads rows as a CSV file. */
export function downloadCsv(name: string, rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const when = (t: number, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) => new Date(t).toLocaleDateString("en-US", opts);
export const time = (t: number) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
export function ago(t: number) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}
/** A date as people say it: "today", "tomorrow", "in 3 days", "yesterday", "4 days ago". */
export function relDay(t: number) {
  const day = (x: number) => {
    const d = new Date(x);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const n = Math.round((day(t) - day(Date.now())) / 86_400_000);
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n === -1) return "yesterday";
  return n > 0 ? `in ${n} days` : `${-n} days ago`;
}
export function until(t: number) {
  const m = Math.round((t - Date.now()) / 60000);
  if (m < 0) return "expired";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
