# Rahat Ahmed Portfolio

Phase 0 establishes a clean Next.js foundation while preserving the existing portfolio content and visual design. No new product features, UI, or RahatVerse experience are included in this phase.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS (utilities are available; the existing stylesheet remains authoritative)
- ESLint + Prettier
- Supabase and Cloudinary integration boundaries, ready for later phases
- Vercel as the primary Next.js deployment target

## Local development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000` by default.

## Environment variables

1. At the repository root, copy `.env.example` to a new file named `.env.local`.
2. Paste your existing credentials **after the equals sign** in `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Do not place any credentials in source files, `.env.example`, Git, GitHub issues, or client-side code. `SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET` are server-only and must never use the `NEXT_PUBLIC_` prefix.

Run `npm run validate:env` after adding values. It reports only variable names and validation errors; it never prints secrets. Integrations remain intentionally disabled until the corresponding values are supplied.

For Vercel, add the same values in **Project → Settings → Environment Variables**. Add public variables and server-only secrets there exactly as named above.

## Quality checks

```bash
npm run validate:env
npm run lint
npm run type-check
npm run build
```

`npm run validate` runs all four checks in order.

## Project structure

```text
src/
├── app/          # Next.js routes, metadata, global styles
├── assets/       # Reserved for source/build-time assets
├── components/   # Reusable React components
├── config/       # Typed public/server environment validation
├── constants/    # Site-wide immutable values
├── content/      # Preserved portfolio content
├── hooks/        # Browser interaction hooks
├── layouts/      # Layout composition
├── sections/     # Portfolio section contracts
├── services/     # Future Supabase and Cloudinary boundaries
├── styles/       # Preserved modular legacy styles
├── types/        # Shared TypeScript types
└── utils/        # Focused, framework-agnostic helpers
public/
└── assets/       # Public portfolio images and favicon assets
```

## Deployment notes

- Vercel uses the standard Next.js server build so future server-only integrations can be added safely.
- Do not commit `.next`, `out`, `node_modules`, `.vercel`, or `.env.local`.
