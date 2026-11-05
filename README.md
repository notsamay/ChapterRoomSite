# Chapter Room — Marketing Site

Single-page Next.js 14 (App Router) site, built from the Chapter Room Web design kit
(deep green, sage and logo cream, Cabinet Grotesk and Commissioner, real app recordings).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  layout.tsx              fonts (next/font/local), metadata, OG/Twitter cards
  page.tsx                section order + JSON-LD
  site.css                the home page's styles, every class prefixed cr-
  globals.css             Tailwind base + the legal pages' prose styles
  fonts/                  Cabinet Grotesk and Commissioner, self-hosted
  api/waitlist/route.ts   waitlist intake
  privacy/page.tsx        renders legal/privacy-policy.md
  terms/page.tsx          renders legal/terms-of-service.md
components/
  site/                   one file per home-page section (copy lives in each file)
    Nav.tsx               floating dark-glass nav, menu button on phones
    Hero.tsx
    Rivers.tsx            the tabbed showcases: features, events, dues, plus chats and feeds
    Showcase.tsx          tabs on one side, a green stage with one recording on the other
    Security.tsx          Off / Medium / Max
    Hierarchy.tsx         roles and groups
    Setup.tsx             up and running in one night + features that save you hours
    Launch.tsx            the dot map
    WaitingRoom.tsx       the waiting-room card and form
    map-data.ts           generated dot grid and school positions (960 × 600 AlbersUSA)
    media.ts              every recording and still, by name
  sections/SiteFooter.tsx footer shared with the legal pages
  LegalPage.tsx
public/media/             real recordings of the app (mp4 + poster jpg) and stills
scripts/
  og-image.html           source for public/og.png
  waitlist-sheet.gs       Apps Script that writes waitlist signups to a Google Sheet
legal/                    privacy policy + terms, Markdown, rendered at /privacy and /terms
```

## Editing copy

Each section in `components/site/` keeps its own copy inline; repeated items (tabs, roles,
groups, tiles) sit in a small array at the top of the file.

## Recordings

Every clip is a real recording of the app on the sample chapter, cropped to the exact shape
it's shown at. Swap one by replacing `public/media/<name>.mp4` and its `<name>-poster.jpg`.
Showcase tabs advance when their clip has played through, so update the tab's `ms` if a clip's
length changes.

On phones the Events, Dues and "chats and feeds" sections are hidden (the feature tabs cover
them), the map is dropped, and only the hero keeps its phone frame.

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

Rows land on a `Waitlist` tab: submitted time, email, phone, chapter, a source column that
reads `duplicate` for a repeat email, and school. Editing the script later needs a **new deployment**
(Deploy → Manage deployments → edit → new version) or the old code keeps running.

```bash
# .env.local  (see .env.example)
WAITLIST_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
NEXT_PUBLIC_SITE_URL=https://joinchapterroom.com   # used for canonical + OG URLs
```

## Type

- **Cabinet Grotesk** (headlines and the wordmark) and **Commissioner** (everything else),
  self-hosted from `app/fonts/` through `next/font/local`.

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
