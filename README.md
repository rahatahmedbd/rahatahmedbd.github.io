# Rahat Ahmed — Portfolio v3.0

Premium, bilingual (বাংলা / English) personal portfolio for **Rahat Ahmed** — student, teacher, blood donor, BNCC cadet & web developer from Sunamganj, Bangladesh.

> **Phase 1 — UI/UX redesign & architecture foundation.** Every section from the original site is preserved verbatim; the design, UX, performance, accessibility, and code structure have been completely rebuilt.

---

## ✨ Highlights

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- Premium, dark-capable **tech aesthetic** with restrained crimson brand accents
- Full **Bengali ⇄ English** toggle (persisted) and **dark ⇄ light** theme (no flash)
- Smooth, performant **scroll-reveal, hover, count-up** animations (respects `prefers-reduced-motion`)
- Fully **responsive**, mobile-app-feel navigation with accessible drawer
- **Accessible**: semantic landmarks, keyboard support, ARIA, focus rings, reduced-motion
- Built for **Core Web Vitals**: static prerender, ~121 kB First Load JS, lazy images
- Architecture **ready for Vercel + Supabase + Cloudinary** (see [Future phases](#-future-phases))

---

## 🌆 RahatVerse — Chapter 2 · The Digital City

An explorable, open-world **3D digital city** built with Three.js — accessible at **`/rahatverse`** (from the navbar or the gold *"Enter RahatVerse"* button on the homepage). This is the foundation of RahatVerse: a living world every future chapter will expand.

**What's inside (foundation only — no buildings yet):**

- **Central Plaza** with a giant holographic logo, a floating digital globe and animated lighting.
- **Full road network** — radial avenues, ring roads, bridges, walkways, and four parks.
- **8 reserved districts** (Agency HQ, Portfolio Museum, Website Factory, AI Lab, Service District, Order Center, Client Hub, Innovation Tower) plus a hidden **Secret District** on an island across a bridge — all clearly marked, intentionally not built.
- **Navigation** — direction signs, floating holo-arrows, district markers, live mini-map and an interactive map terminal.
- **Living world** — NPC citizens (visitors, developers, designers, robots) that walk, look at you and wave; patrolling drones; decorative flying vehicles; drifting particles.
- **Premium animated sky** with smooth Morning → Day → Sunset → Night transitions and a time-of-day switcher in the HUD.
- **Procedural ambient audio** (wind, soft electronic pad, fountain, drones) via Web Audio — no audio files.
- **Interaction** — screens, billboards, kiosks and collectible crystals; a clean HUD (mini-map, district name, hints).
- **Performance** — procedural textures (no asset downloads), Three.js frustum culling, capped pixel-ratio & shadows, static geometry.

> WebGL is required. The site falls back to a friendly notice if WebGL is unavailable.

---

## 🧱 Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js 14 (App Router) + React 18 + TypeScript   |
| Styling        | Tailwind CSS (design tokens, dark mode)           |
| Icons          | lucide-react                                       |
| Theming        | next-themes                                        |
| Hosting        | Vercel                                             |
| Database/Auth  | Supabase (wired for future phases)                |
| Media/CDN      | Cloudinary (wired for future phases)              |
| Contact form   | Formspree (Phase 1)                                |

---

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in values

# 3. Run the dev server
npm run dev                  # http://localhost:3000

# 4. Production build
npm run build && npm run start
```

Requires **Node ≥ 18.18**.

---

## 🔑 Environment variables

Defined in [`.env.example`](./.env.example). Copy to `.env.local` (git-ignored) and on Vercel set them in **Project → Settings → Environment Variables**.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_FORMSPREE_ID` | public | Contact form endpoint (Phase 1) |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key (enable **RLS** on all tables) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Privileged ops (Server Components/Actions) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | public | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | public | Unsigned upload preset |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | **server only** | Signed uploads/transformations |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical site URL |

> ⚠️ Never commit real secrets. `.env.local` is git-ignored. Keep the service-role key and Cloudinary API secret **server-side only**.

---

## 📁 Project structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout: fonts, SEO metadata, providers, JSON-LD
│   ├── page.tsx              # Home (composes all sections)
│   ├── globals.css           # Design tokens + base + utilities
│   ├── robots.ts             # /robots.txt
│   └── sitemap.ts            # /sitemap.xml
├── components/
│   ├── ui/                   # Reusable primitives (Button, Card, Reveal, Chip…)
│   ├── layout/               # Navbar, Footer, ThemeToggle, LanguageToggle…
│   ├── sections/             # Hero, About, Education, Achievements, … Contact
│   └── providers/            # ThemeProvider, LanguageProvider
├── content/                  # All site copy (bilingual) — CMS-ready data layer
├── hooks/                    # useInView, useCountUp, useActiveSection, useScrolled
├── lib/
│   ├── site.ts               # Site config, nav, socials, Formspree helper
│   ├── utils.ts              # cn() class merge
│   ├── supabase/client.ts    # ⚡ Browser Supabase client (readiness)
│   └── cloudinary.ts         # ⚡ Cloudinary URL builder (readiness)
└── types/                    # Shared TypeScript types
public/
├── images/                   # Photos (profile, gallery, logo…)
└── favicon/                  # Favicon set + PWA manifest
```

**All editable text lives in `src/content/*`** — a single, typed, bilingual data layer that a future CMS (Portfolio/Blog) can replace without touching components.

---

## ☁️ Deploy to Vercel

1. Push this branch to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new) (framework auto-detected as Next.js).
3. Add the environment variables (see above).
4. Deploy. Every push to `main` redeploys automatically.

> **Custom domain:** Settings → Domains. Update `NEXT_PUBLIC_SITE_URL` to match.

---

## 🔭 Future phases (scaffolded, not built)

The structure is intentionally ready for these — **none are implemented yet**:

- **Website Ordering System** · **Client Dashboard** · **Admin Panel**
- **Authentication** (Supabase Auth — use `lib/supabase`)
- **Portfolio CMS** & **Blog CMS** (replace `src/content/*` with data from Supabase)
- **Analytics Dashboard** · **Notifications** · **Payment Integration** · **Email System**
- **Cloudinary media management** (replace local images in `public/images`)

---

## 📝 Phase 1 notes

- **Fonts:** loaded via `<link>` (Inter + Hind Siliguri) so the build is offline-safe and works everywhere. On Vercel you may switch to `next/font/google` for self-hosting.
- **Contact form:** requires a real Formspree ID in `NEXT_PUBLIC_FORMSPREE_ID`. Until set, the form shows a friendly fallback directing visitors to email.
- **Gallery:** 7 photos referenced in `src/content/gallery.ts` are not yet supplied — they render an elegant “coming soon” placeholder. Drop the files into `public/images/` and set `missing: false`.
- **Legacy:** the original static site is preserved under [`_legacy/`](./_legacy) for reference.

---

© Rahat Ahmed · Sunamganj, Bangladesh · Made with ❤️
