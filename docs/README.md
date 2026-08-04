# Rahat Ahmed Portfolio v1.0.0 — Documentation Index

| Document | Contents |
| --- | --- |
| [`../README.md`](../README.md) | Project setup, environment variables, folder structure, deployment, development workflow, maintenance notes |
| [`phase-15-backend-platform.md`](phase-15-backend-platform.md) | Supabase schema, RLS policies, API map, notification & Cloudinary architecture |
| [`phase-16-production-launch.md`](phase-16-production-launch.md) | Final QA: performance, security, accessibility and SEO audit results; release checklist |

## Quick maintenance guide

- **Change prices/packages:** edit `src/data/platform.ts` (canonical catalog).
  Server-side pricing uses this catalog, so client input can never alter totals.
- **Apply database changes:** add a new timestamped file under
  `supabase/migrations/` and run `supabase db push`.
- **Rotate secrets:** update Vercel environment variables and the Supabase /
  Cloudinary dashboards; never store secrets in the repo.
- **Check service health:** `GET /api/health` returns boolean configuration
  flags (no secrets).
- **Release:** branch from `main` → `npm run validate` → PR → squash-merge →
  verify the Vercel deployment → tag the version.

## Support contacts

- Portfolio owner: Rahat Ahmed — rahatbd20505@gmail.com
- Production URL: https://rahatahmedbd.github.io (forwards to Vercel)
