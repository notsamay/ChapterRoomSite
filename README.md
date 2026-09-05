# Chapter Room — Marketing Site

Single-page Next.js 14 (App Router) + Tailwind site, built from the Claude Design handoff
(`Chapter Room Design System-handoff.zip` → `project/Chapter Room Site.dc.html`).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  layout.tsx              fonts, metadata, OG/Twitter cards
  page.tsx                section order + JSON-LD
  globals.css             design tokens, phone-frame system, scroll-reveal
  api/waitlist/route.ts   waitlist intake
  privacy/page.tsx        renders legal/privacy-policy.md
  terms/page.tsx          renders legal/terms-of-service.md
components/
  SiteNav.tsx             sticky pill nav — scroll spy + mobile sheet
  PhoneFrame.tsx          device bezel; renders a mock or a real screenshot
  WaitlistForm.tsx        client form with validation and states
  ColonyMap.tsx           interactive US map — hover/tap any state; no mapping library
  colony-map-data.ts      generated — see scripts/generate-colony-map.mjs
  screenshots.ts          swap mocks for real screenshots here
  phone-geometry.mjs      whole-pixel bezel/screen maths shared with scripts/build-screens.mjs
  Reveal.tsx              scroll-in wrapper on one shared observer
  sections/               one file per band; copy lives at the top of each
                          (Features = "Essentials": events, vouchers, albums, campus chats; role codes in
                          Organization = positions, powers and groups)
  screens/                the in-app mockups inside the phones
scripts/
  import-screen.mjs       brings a simulator shot into public/screens/
  build-screens.mjs       pre-scales every shot for 1x–3x displays (npm run screens)
  generate-colony-map.mjs rebuilds colony-map-data.ts
  og-image.html           source for public/og.png
  waitlist-sheet.gs       Apps Script that writes waitlist signups to a Google Sheet
legal/                    privacy policy + terms, Markdown, rendered at /privacy and /terms
```

## Editing copy

Each band in `components/sections/` keeps its own copy — headline and body inline,
repeated items (promises, roles, privacy guarantees) in a small array at the top of the
file. Nothing is shared between sections, so a change stays where you make it.

## Real screenshots

Every phone renders a real app screenshot from `public/screens/`, chosen by the matching key
in `components/screenshots.ts`. Set a key to `null` and `PhoneFrame` falls back to the
hand-built mock of that screen in `components/screens/`. See **Screenshots** below for how
to import a new shot.

## Waitlist

`POST /api/waitlist` validates the submission and forwards it to whatever JSON endpoint
`WAITLIST_WEBHOOK_URL` names. The intended target is a Google Sheet, via the Apps Script in
`scripts/waitlist-sheet.gs`; a Slack incoming webhook or Zapier/Make hook also works.

**Set that variable before the site takes real traffic.** Without it the route still
answers `200`, but the signup is only written to the server log, so nothing is kept.

Google Sheet setup, once:

1. Create a blank Google Sheet.
2. Extensions → Apps Script. Replace the editor contents with `scripts/waitlist-sheet.gs`
   and save.
3. Deploy → New deployment → type **Web app**. Execute as **Me**, who has access
   **Anyone**. Authorize when prompted.
4. Copy the web app URL (ends in `/exec`) into `.env.local` as `WAITLIST_WEBHOOK_URL`.
   Opening that URL in a browser should show `{"ok":true,...}`.

Rows land on a `Waitlist` tab: submitted time, email, phone, chapter, and a source column that
reads `duplicate` for a repeat email. Editing the script later needs a **new deployment**
(Deploy → Manage deployments → edit → new version) or the old code keeps running.

```bash
# .env.local  (see .env.example)
WAITLIST_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
NEXT_PUBLIC_SITE_URL=https://joinchapterroom.com   # used for canonical + OG URLs
```

## Type

- **Bricolage Grotesque** (the hero and the closing statement) — self-hosted by `next/font`.
- **Cabinet Grotesk** (section headings) and **General Sans** (everything else) — Fontshare
  CDN, linked in `app/layout.tsx`. Neither has a Google Fonts equivalent.

## The phone mockups

The screens in `components/screens/` are authored against a 300px-wide reference phone and
sized entirely in `u-*` classes. Inside a `.phone-ui`, `--u` resolves to the frame's real
width ÷ 300, so a screen holds its proportions in a 322px hero phone and a 260px card phone
alike. Outside a phone `--u` falls back to `1px`.

The frame's own proportions (bezel radius, padding, notch) are container-query units on
`.phone-frame`, which is why it sits inside a separate `.phone` container — `cqw` resolves
against an element's nearest *ancestor* container, never itself.

## Regenerating the colony map

The map is projected at build time so the page ships no mapping JavaScript:

```bash
npm i --no-save d3-geo topojson-client topojson-simplify
node scripts/generate-colony-map.mjs
```

Edit `HIGHLIGHT` (state FIPS ids) and `CITIES` (city, school, coordinates) in that script to
change which schools show. Every state is hoverable/tappable: colony states list their
schools, the rest link to the waitlist.

## Screenshots

Import each 1206 x 2622 simulator shot with
`node scripts/import-screen.mjs "<shot>.png" <slot>` (slot names are the keys in
`components/screenshots.ts`; the script blanks the simulator status bar so every phone matches),
then run `npm run screens`. That renders each shot at the exact pixel width its phone frame
draws it at, for 1x, 1.25x, 1.5x, 2x and 3x displays, so the browser never has to shrink the
original itself (which blurs the UI text). New phone slots need a line in the `FRAMES` map in
`scripts/build-screens.mjs`.

## Legal pages

`legal/privacy-policy.md` and `legal/terms-of-service.md` are the source of truth; `lib/legal.ts`
converts them with `marked` at build time and `components/LegalPage.tsx` renders them at
`/privacy` and `/terms`. Edit the Markdown, bump the "Last updated" line, and redeploy.

Before launch:

- Fill in the platform fee line in the terms, Section 8.
- Have a lawyer review both documents. They were drafted against the App Store (5.1.1,
  1.2), Google Play Data Safety, Stripe DPA, state privacy law and Wisconsin breach
  notification requirements, but they are not legal advice.
- Marketing email (the waitlist launch mail) must carry a physical mailing address and an
  unsubscribe link under CAN-SPAM.
- Put the `/privacy` URL in App Store Connect and Play Console, link it inside the app, and
  make sure account deletion works from inside the app (App Store 5.1.1(v)).

## Regenerating the OG card

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --force-device-scale-factor=1 --virtual-time-budget=8000 --window-size=1200,630 \
  --screenshot=public/og.png scripts/og-image.html
```

## Deploy

Push to GitHub and import into Vercel. Set `WAITLIST_WEBHOOK_URL` and `NEXT_PUBLIC_SITE_URL`
in the project's environment variables.
