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
 * shots in with `node scripts/import-screen.mjs "<shot>.png" <slot>` (which blanks the simulator
 * status bar), run `npm run screens` to regenerate those copies. The frame each shot belongs to
 * is listed in scripts/build-screens.mjs; add new slots there too.
 *
 */
export const SCREENSHOTS = {
  /** 432 wide */ chapterFeed: "/screens/home.png",
  /** 330 wide */ checkIn: "/screens/check-in.png",
  /** 330 wide */ excuses: "/screens/excuses.png",
  /** 402 wide */ roles: "/screens/roles.png",
  /** 402 wide */ poll: "/screens/poll.png",
  /** 402 wide */ chat: "/screens/chat.png",
  /** 402 wide */ announcements: "/screens/announcements.png",
  /** 432 wide */ security: "/screens/screenshot-logged.png",
  /** 260 x 400, crop */ vouchers: "/screens/vouchers.png",
  /** 260 x 400, crop */ album: "/screens/album.png",
  /** 260 x 400, crop */ register: "/screens/register.png",
  /** 330 wide */ members: "/screens/members.png",
  /** 330 wide */ groups: "/screens/groups.png",
} satisfies Record<string, string | null>;
