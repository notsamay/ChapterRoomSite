// Captures of the officer web portal's pages in public/kit/portal (the sample org, light theme,
// 1440 × 900 at 2x, scaled to 2000 wide). Kept out of the client component so server pages can
// import them.
export type PortalShot = { id: string; label: string; alt: string };

export const PORTAL_SHOTS: Record<string, PortalShot> = {
  home: { id: "home", label: "Home", alt: "The portal's home page: what needs officers now, the numbers for the term and what's coming up" },
  events: { id: "events", label: "Events", alt: "Events: one meeting's attendance, each member on time, late, excused or missed" },
  vouchers: { id: "vouchers", label: "Vouchers", alt: "Vouchers: membership fees, tickets and merch, with who has paid and what's overdue" },
  security: { id: "security", label: "Security", alt: "Security: a screenshot from the log, opened to show what was on the member's screen" },
};
