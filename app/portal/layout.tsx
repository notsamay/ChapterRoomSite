import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Shell from "@/components/portal/Shell";
import { PortalProvider } from "@/components/portal/store";
import { themeScript } from "@/components/portal/theme";
import "./portal.css";

// The officer portal: management only (members, roles and groups, attendance, membership fees,
// security). Chats, feeds and albums stay in the app. Sample data for now; not indexed.
export const metadata: Metadata = {
  title: { default: "Officer portal", template: "%s · Officer portal · Chapter Room" },
  robots: { index: false, follow: false },
};

// The browser's own bar matches the portal's sidebar in either mode.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F5" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  colorScheme: "light dark",
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  // suppressHydrationWarning: the inline script sets data-theme on this element before React loads.
  return (
    <div className="pt-root" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <PortalProvider>
        <Shell>{children}</Shell>
      </PortalProvider>
      {/* Phones get this instead of the portal: officers use the app there. */}
      <div className="pt-phone-only">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pt-logo-light" src="/kit/lockup-on-ivory.png" alt="Chapter Room" height={24} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pt-logo-dark" src="/kit/lockup-on-emerald.png" alt="" aria-hidden="true" height={24} />
        <h1>The web portal is for computers.</h1>
        <p>Open it on a laptop or desktop. On your phone, everything officers need is in the app.</p>
        <a href="/" className="pt-btn" data-kind="primary">
          Back to Chapter Room
        </a>
      </div>
    </div>
  );
}
