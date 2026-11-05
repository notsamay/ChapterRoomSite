import Link from "next/link";
import type { ReactNode } from "react";
import SiteFooter from "@/components/sections/SiteFooter";
import Nav from "@/components/site/Nav";

/** The pages the App Store asks for, linked from each other's headers. */
export const DOC_PAGES = [
  { path: "/privacy", label: "Privacy policy" },
  { path: "/terms", label: "Terms of service" },
  { path: "/support", label: "Support" },
] as const;

/**
 * A page in the site's style that isn't the home page: the floating nav, a deep-green
 * header with a lowercase title, then the page on white.
 */
export default function DocShell({
  path,
  title,
  lead,
  meta,
  children,
}: {
  path: (typeof DOC_PAGES)[number]["path"];
  title: string;
  lead?: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="cr-site">
      <Nav base="/" />
      <main>
        <header className="cr-doc-hero">
          <div className="cr-hero-glow" aria-hidden="true" />
          <div className="cr-doc-hero-in">
            <h1>{title}</h1>
            {lead && <p className="cr-doc-lead">{lead}</p>}
            <div className="cr-doc-meta">
              <nav aria-label="Policies and support" className="cr-doc-pills">
                {DOC_PAGES.map((d) => (
                  <Link key={d.path} href={d.path} aria-current={d.path === path ? "page" : undefined}>
                    {d.label}
                  </Link>
                ))}
              </nav>
              {meta && <span>{meta}</span>}
            </div>
          </div>
        </header>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
