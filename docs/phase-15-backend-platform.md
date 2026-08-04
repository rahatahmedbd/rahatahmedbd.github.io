# Phase 15 — Backend Platform & Admin Ecosystem

## What is included

- Supabase Auth integration with SSR cookie sessions.
- Route protection middleware for `/admin` and `/dashboard`.
- Server-only Supabase admin client for privileged API routes.
- Public website order API with server-side validation, canonical price calculation, rate limiting, and notification job creation.
- Admin APIs for orders, analytics, content, and Cloudinary media uploads.
- Client APIs for order history, messages, files, progress, and payment status.
- Admin Panel UI at `/admin`.
- Client Dashboard UI at `/dashboard`.
- Login page at `/login` supporting magic links plus email/password auth.
- Cloudinary uploads through server routes only, with responsive/optimized image transformations.
- SQL migration for database tables, storage buckets, RLS policies, realtime tables, indexes, and triggers.

## Environment variables

Use `.env.example` as the safe template. Do not commit real service-role or Cloudinary API secret values.

Required for production:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_EMAILS=admin@example.com
```

`ADMIN_EMAILS` is a comma-separated bootstrap allowlist. Admin role can also be assigned in Supabase:

```sql
update public.profiles
set role = 'admin'
where lower(email) = lower('admin@example.com');
```

## Applying Supabase schema

Apply:

```bash
supabase db push
```

or paste `supabase/migrations/20260804000000_phase_15_backend_platform.sql` into the Supabase SQL editor.

The migration creates:

- `profiles`
- `website_orders`
- `order_events`
- `order_messages`
- `project_files`
- `content_entries`
- `media_assets`
- `notification_jobs`
- `analytics_events`
- `error_logs`
- `media` and `project-files` storage buckets

RLS is enabled on all platform tables. Public order insert is constrained; client reads are limited to matching user/email; admin management requires `profiles.role = 'admin'`.

## Backend API map

| Route | Purpose | Auth |
| --- | --- | --- |
| `POST /api/orders` | Store website order | Public, rate-limited; links user if logged in |
| `GET /api/client/orders` | Client order history | Authenticated |
| `GET /api/client/files` | Client downloads | Authenticated |
| `GET/POST /api/client/messages` | Client messages | Authenticated |
| `GET/PATCH /api/admin/orders` | Admin order management | Admin |
| `GET/PUT /api/admin/content` | Admin content management | Admin |
| `GET/POST /api/admin/media` | Cloudinary upload/media list | Admin |
| `GET /api/admin/analytics` | Analytics dashboard data | Admin |
| `GET /api/health` | Configuration health flags | Public, no secrets |

## Notification architecture

External email/SMS providers are intentionally not hard-coded. API routes enqueue rows in `notification_jobs` such as `order.created` and `message.created`. A future Supabase Edge Function or scheduled worker can process queued rows and deliver email, SMS, WhatsApp, or push notifications.

## Cloudinary architecture

- Browser uploads go to `/api/admin/media` using `FormData`.
- The server validates MIME type and size.
- The server uploads to Cloudinary with `quality_auto` / `fetch_format_auto` transformations for image assets.
- Cloudinary credentials stay server-only.
- Public delivery uses Cloudinary CDN URLs recorded in `media_assets`.

## Validation checklist

Run before release:

```bash
npm install
npm run lint
npm run type-check
npm run build
```

Manual checks:

1. Visit `/login` and send a magic link or sign in with a configured test account.
2. Submit `/order`; confirm a row appears in `website_orders`.
3. Visit `/dashboard`; confirm the order appears for the matching email.
4. Visit `/admin` with an admin account; update order status and confirm progress updates.
5. Upload a small image in Admin Panel; confirm the asset appears in Cloudinary and `media_assets`.
6. Verify `/api/health` reports all required integrations configured in production.
