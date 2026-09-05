const ITEMS = [
  "Positions and powers",
  "Join codes per position",
  "Groups that run themselves",
  "Broadcast and discussion feeds",
  "Location check-in",
  "Excuse queue",
  "Dues through Stripe",
  "Three security levels",
  "Admin Mode",
  "Cross-chapter chats",
  "Shared albums",
];

/**
 * A slow, continuous strip of everything the app covers. The list is rendered twice and the
 * track slides by exactly one copy, so the loop is seamless. Pauses on hover; static for
 * reduced-motion users.
 */
export default function FeatureTicker() {
  return (
    <div className="relative z-10 border-t border-cream/10 bg-ink/25 py-[18px]">
      <div className="ticker">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center text-[12.5px] font-semibold uppercase tracking-[0.16em] text-cream/55"
            >
              {ITEMS.map((item) => (
                <li key={item} className="flex items-center whitespace-nowrap">
                  <span className="px-7">{item}</span>
                  <span className="h-3 w-px bg-cream/15" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
