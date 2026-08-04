# Rahat Ahmed Portfolio — v1.0.0

Production-ready portfolio platform for Rahat Ahmed: a classic **Website
Experience**, an immersive **RahatVerse** 3D city, a guided **Website Order**
flow, a secure **Admin Panel**, a **Client Dashboard**, and a Supabase +
Cloudinary backend — all in one Next.js app.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript** on Vercel
- **Tailwind CSS 3** plus the preserved modular legacy stylesheet
- **@react-three/fiber + drei + three.js** for the RahatVerse 3D experience
- **Supabase** — Auth (SSR cookie sessions + bearer tokens), Postgres with RLS,
  storage, realtime-ready tables
- **Cloudinary** — server-only media uploads with automatic image optimization
- **Zod** — runtime validation for every API input and environment config

## Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Experience chooser (Website vs RahatVerse) | Public |
| `/portfolio` | Website Experience (sections: about, education, achievements, services, blood, gallery, contact) | Public |
| `/rahatverse` | 3D city experience with guided/auto/explore tours | Public |
| `/order` | Guided website ordering (type → package → extras → contact → review) | Public |
| `/login` | Supabase magic-link + password auth | Public (noindex) |
| `/dashboard` | Client order tracking, files, messages | Authenticated |
| `/admin` | Orders, content, media, analytics | Admin role |

API map: see `docs/phase-15-backend-platform.md` for the full backend contract.

## Local development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

## Environment variables

1. Copy `.env.example` to `.env.local` and fill in real values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only, never NEXT_PUBLIC_
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=              # server-only, never NEXT_PUBLIC_
ADMIN_EMAILS=you@example.com        # comma-separated bootstrap admin allowlist
NEXT_PUBLIC_APP_URL=https://rahatahmedbd.github.io
```

2. Run `npm run validate:env` — it reports only variable names/errors, never
   secrets. Features degrade gracefully until their credentials exist.

On Vercel, add the same values under **Project → Settings → Environment
Variables** for the Production/Preview environments.

## Quality gates

```bash
npm run validate:env   # environment template check
npm run lint           # ESLint with --max-warnings=0
npm run type-check     # tsc --noEmit (strict)
npm run build          # production build
npm run validate       # all of the above in order
npm run format         # Prettier across the repo
```

There is currently no automated test suite; release validation is the
`npm run validate` pipeline plus the smoke checklist in
`docs/phase-16-production-launch.md`.

## Project structure

```text
src/
├── app/              # App Router routes, API handlers, RahatVerse scene
│   ├── api/          # orders, client/*, admin/*, health endpoints
│   └── rahatverse/   # lazy-loaded three.js experience modules
├── components/       # UI kit + admin/auth/client/order/platform features
├── config/           # Zod-validated server & public environment loaders
├── constants/        # canonical site identity (name, URL, keywords)
├── data/             # canonical catalog: packages, extras, tour stops, profile
├── hooks/            # platform auth hook
├── layouts/          # SiteShell (provider + error boundary + navigation)
├── lib/              # backend primitives: auth, http, orders, rate limit, logger
├── services/         # Supabase (browser/server/admin) + Cloudinary clients
├── state/            # PlatformProvider (preferences, tour, order draft)
├── styles/           # legacy modular stylesheet + design tokens
├── types/            # shared TypeScript contracts
└── utils/            # browser storage + redirect sanitization
public/
├── assets/           # optimized images + PWA manifest/icons
├── robots.txt
└── sitemap.xml
supabase/
└── migrations/       # Phase 15 schema: tables, RLS, storage, triggers
docs/                 # per-phase documentation
scripts/              # validate-env.mjs (never prints secrets)
```

## Deployment

- **Runtime:** Vercel (`vercel.json` pins `npm ci` + `npm run build`). Every
  push to `main` deploys to production; pull requests get preview deployments.
- **Legacy URL:** `https://rahatahmedbd.github.io/` (GitHub Pages) serves
  `index.html`, which redirects to the Vercel production deployment — old
  links keep working.
- **Supabase schema:** apply with `supabase db push` or paste
  `supabase/migrations/20260804000000_phase_15_backend_platform.sql` into the
  Supabase SQL editor (one-time setup; already applied for production).
- **Security headers** (CSP, HSTS, X-Frame-Options, CORP/COOP, nosniff,
  referrer/permissions policies) are applied by `src/proxy.ts` in production.

## Development workflow

1. Branch from `main`, keep changes scoped to one concern.
2. Run `npm run validate` before opening a pull request.
3. Squash-merge via PR once checks and preview deployment pass.
4. Never commit `.env*` files (except `.env.example`), `.next`, `out`,
   `node_modules`, or `.vercel`.

## Maintenance notes

- **Orders:** notifications are queued in `notification_jobs`; an Edge
  Function/worker delivers them (email/SMS/WhatsApp) when connected.
- **Content:** `content_entries` stores admin-managed overrides; the catalog in
  `src/data/platform.ts` remains the canonical fallback.
- **Media:** upload through the Admin Panel only — Cloudinary credentials never
  ship to the browser.
- **Images:** keep photos under ~300 KB (JPEG q82, ≤1600px); favicons are
  already generated in `public/assets/images/favicon/`.
- **Upgrading:** `npm outdated`, bump carefully, then run `npm run validate`.

See `docs/` for the complete phase history (Phase 15 backend, Phase 16 QA and
launch).
