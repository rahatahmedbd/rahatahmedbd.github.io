# 🎬 Rahat Ahmed Portfolio — MASTER PHASE PLAN

A cinematic website built as **6 Acts / 16 phases**. Frontend first (00–13), backend last (14–15). Every phase ends with: build passes → commit → push session branch → PR → merge (after Vercel) → deploy verify.

**Stack target:** Next.js · TypeScript · Tailwind · (Supabase last) · (Cloudinary last) · Vercel · GitHub.

---

## ACT I — Foundation & Cinematic Engine

| Phase | Branch | Scope | F/B |
|---|---|---|---|
| 00 | `phase-00-foundation` | Next.js+TS+Tailwind bootstrap, **1:1 faithful content port** (site stays live & identical), Vercel-ready, lint/build/type-check CI | F |
| 01 | `phase-01-design-system` | Brand (Crimson), tokens, typography (Bangla+English), theme/mood system, i18n (bn/en) rebuilt, motion utilities, UI primitives | F |
| 02 | `phase-02-cinematic-engine` | **Cinematic heart:** preloader/intro, scroll-driven scene choreography, section transitions, film overlays, parallax, magnetic/spotlight, audio system (toggle), reduced-motion | F |
| 03 | `phase-03-app-shell` | **Multifunctional control center:** top utility bar (menu+lang+theme/mood+experience toggle) + floating bottom dock + Command Palette + Settings panel + scroll-progress/chapter rail + toast | F |

## ACT II — Entry & Hero

| Phase | Branch | Scope | F/B |
|---|---|---|---|
| 04 | `phase-04-welcome-gate` | Cinematic entry: bilingual welcome sequence + Website / RahatVerse choice (animated, sound, remember choice) | F |
| 05 | `phase-05-hero` | Cinematic hero scene: kinetic reveal, light-sweep, slow zoom, particles, CTA (content unchanged) | F |

## ACT III — The Scenes (each section = interactive scene; content verbatim)

| Phase | Branch | Scope | F/B |
|---|---|---|---|
| 06 | `phase-06-scene-about-education` | About + Education as interactive timeline + parallax reveal | F |
| 07 | `phase-07-scene-achievements-experience` | Animated count-up stats, unlock-style cards, role chips | F |
| 08 | `phase-08-scene-blood-tribute` | Emotional scene: blood-drop animation, Shantichakra stats, tribute candle/light | F |
| 09 | `phase-09-scene-gallery-contact` | Filterable gallery + cinematic lightbox + animated/multi-step contact form UI | F |

## ACT IV — Polish

| Phase | Branch | Scope | F/B |
|---|---|---|---|
| 10 | `phase-10-polish` | Motion perf, reduced-motion a11y, bilingual QA, scene-consistency, sound tuning, Lighthouse, SEO/OG/sitemap/robots, PWA, easter eggs | F |

## ACT V — RahatVerse (3D cinematic city)

| Phase | Branch | Scope | F/B |
|---|---|---|---|
| 11 | `phase-11-rahatverse-foundation` | Three.js/R3F, scene/camera/lighting, performance budget, loader, low-end fallback | F |
| 12 | `phase-12-rahatverse-city` | City build, each section = a 3D location/zone, vehicle, atmosphere/weather | F |
| 13 | `phase-13-rahatverse-tour` | Cinematic auto-drive tour + manual control (zoom/rotate/move), UI overlay, Website↔RahatVerse transition, sound | F |

## ACT VI — Backend & Launch (last)

| Phase | Branch | Scope | F/B |
|---|---|---|---|
| 14 | `phase-14-backend-supabase` | Contact form → Supabase, validation, spam protection, success/error, env/secrets | B |
| 15 | `phase-15-cloudinary-launch` | Images → Cloudinary + responsive, final production verify, deploy, live QA, domain/DNS | B |

---

## Notes
- **Information is immutable** — only design/experience changes. See `MASTER_PROMPT.md`.
- **Hosting shift:** current site = GitHub Pages (`rahatahmedbd.github.io`). Merge to `main` only after Vercel is connected, to avoid breaking the live site.
- **Known gaps to resolve later:** `assets/images/gallery/` is currently empty; contact form action is a placeholder (`formspree.io/f/YOUR_FORM_ID`) — fixed in Phase 14.
