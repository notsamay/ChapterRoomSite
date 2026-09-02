/**
 * Real app screenshots.
 *
 * Every phone on the page can render either a hand-built mock or a real screenshot from
 * `public/screens/`. `PhoneFrame` swaps the mock for the image when a key points at one;
 * set a key back to `null` to fall back to the mock.
 *
 * Shots are 1206 x 2622 (iPhone 3x, no status-bar clutter), served as lossless PNG so the
 * UI text stays sharp. PhoneFrame sizes each screen to exactly that ratio and to a whole number
 * of pixels, and serves a pre-scaled copy that maps 1:1 onto the display. After dropping new
 * shots in, run `npm run screens` to regenerate those copies (the frame each shot belongs to is
 * listed in scripts/build-screens.mjs; add new slots there too).
 *
 * Also in `public/screens/` but not wired to a slot yet: `register.png` (the events tab).
 */
export const SCREENSHOTS = {
  /** 322 wide */ chapterFeed: "/screens/home.png",
  /** 284 wide */ checkIn: "/screens/check-in.png",
  /** 284 wide */ excuses: "/screens/excuses.png",
  /** 316 wide — no shot yet, mock stays */ roles: null,
  /** 276 wide */ poll: "/screens/poll.png",
  /** 276 wide */ chat: "/screens/chat.png",
  /** 276 wide */ announcements: "/screens/announcements.png",
  /** 372 wide */ security: "/screens/screenshot-logged.png",
  /** 260 x 400 */ vouchers: "/screens/vouchers.png",
  /** 260 x 400 */ album: "/screens/album.png",
} satisfies Record<string, string | null>;
