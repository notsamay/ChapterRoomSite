# Chapter Room — Marketing Site

Single-page Next.js 14 (App Router) + Tailwind CSS site for Chapter Room.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy
Push to GitHub and import into Vercel — zero config needed.

## Structure
- `app/page.tsx` — the entire page (features, roles, security, CTA are data arrays at the top, edit copy there)
- `app/layout.tsx` — fonts (Alfa Slab One / Libre Franklin / IBM Plex Mono) + metadata
- `app/globals.css` — battlement dividers, eyebrow style, reveal animation
- `components/StoreBadges.tsx` — App Store / Google Play badges (SVG icons)
- `components/Reveal.tsx` — scroll-in animation wrapper
- `tailwind.config.ts` — brand colors: pine, pine-deep, pine-soft, cream, sage, gold
