# RahatVerse Stabilization Report

Branch: `arena/019fc14a-rahatahmedbd-github-io`

---

## 1. The order submission bug — root cause

The order flow reached the final step and failed. There were **two independent
defects**, both in the data layer, not the UI.

### Defect A — the insert read its own row back through RLS

`submitProjectOrderAction` did this:

```ts
const { data: order, error } = await supabase
  .from("orders")
  .insert({ ...,  client_id: clientId /* null for guests */ })
  .select()      // <-- RETURNING
  .single();     // <-- requires exactly 1 row
```

PostgREST applies the **SELECT policy** to the `RETURNING` clause of an insert.
The policy was:

```sql
using (auth.uid() = client_id or public.is_admin())
```

For a guest order `client_id` is `NULL`, so `auth.uid() = client_id` evaluates
to `NULL` — never true. The new row was filtered out of `RETURNING`, `.single()`
got zero rows and threw `PGRST116: JSON object requested, 0 rows returned`.

**The order was actually written to the database.** The visitor was shown a
failure for a row that had been saved. This is why it looked intermittent and
why retrying appeared to do nothing.

**Fix:** the action no longer reads the row back. The reference is generated
server-side and returned directly, so success no longer depends on a SELECT
policy. The insert is wrapped in a retry loop keyed on `23505` (unique
violation on `reference`).

### Defect B — admins were not admins

`public.is_admin()` checked `profiles.role` (the legacy enum from migration
0001), but every later migration and all application code assigns
`profiles.role_id` (FK to the `roles` table, added in 0003).

Consequence: `is_admin()` returned `false` for real administrators, so every
`is_admin()`-gated policy failed and **orders never appeared in the Admin
Panel** even when they were saved.

**Fix:** migration `0009` rewrites `is_admin()` to honour both `role` and
`role_id`, and rebuilds the `orders` policies cleanly (insert / select /
update / delete).

### Also hardened

- Server-side validation of name, email, phone and website type (the client
  validated, the server did not).
- Admin notification fan-out moved behind a best-effort helper — a notification
  failure can no longer turn a saved order into a reported failure.
- `alert()` replaced with an inline `role="alert"` error region.
- A DB-side `default public.generate_order_reference()` as a second line of
  defence against duplicate references.

### Verification

| Check | Result |
|---|---|
| Old code, guest order | reproduced: `PGRST116 … 0 rows returned` |
| New code, guest order | success, reference returned |
| New code, authenticated order | success |
| Admin visibility | sees 2 of 2 orders (guest + authenticated) |
| Validation (5 cases) | 5/5 pass |
| 200,000 generated references | 0 collisions; retry loop covers any |

The admin panel reads `reference`, `client_info`, `website_type`,
`required_features`, `design_preference` — exactly the fields the action
writes. Confirmed field-by-field.

> Not verifiable in this sandbox: no Postgres or Supabase credentials are
> available, so submissions were validated against a harness reproducing
> PostgREST's RLS-on-RETURNING semantics rather than a live database.
> **Apply migration `0009` before testing in production.**

---

## 2. Removed

| Item | Why |
|---|---|
| `_legacy/` | Pre-Next.js static site, fully superseded |
| `rahatahmedbd.github.io/` (nested) | A duplicate repo directory committed inside itself; its files did not compile |
| `rahatverse-chapter2-concept.png` | 4 MB unused concept art |
| `src/app/verse` + `src/components/game` | Second, unfinished 3D game — an 861 kB route duplicating `/rahatverse` |
| `src/app/order/order-form.tsx` | 751 orphaned lines; `/order` renders `ServiceDistrictMain` |
| `src/app/services`, `src/app/service-district` | Three routes rendered the identical component |
| `ecctrl`, `@react-three/rapier`, `zustand` | Only used by the deleted game — 52 packages |

Old URLs are preserved as 308 redirects (`/services → /#services`,
`/verse → /rahatverse`, `/service-district → /order`).

`console.log` count in `src/`: **0**. Remaining `console.error` calls are
deliberate server-side error reporting.

---

## 3. Build integrity

`next.config.mjs` had **both** safety nets disabled:

```js
typescript: { ignoreBuildErrors: true },
eslint: { ignoreDuringBuilds: true },
```

Both are now `false`. That surfaced 9 type errors and 11 lint errors, all
fixed — including a real one: `variant="outline"` on the order confirmation
screen was not a valid variant and rendered unstyled.

Dependency tree: no unmet peers, no version conflicts.

---

## 4. Navigation and homepage

Navigation went from 11 links (mixing anchors and routes) to **5 anchors**.
Secondary destinations moved to the footer. Anchors auto-prefix to `/#x` when
viewed off the homepage, so nav works from every route.

The homepage is now one journey with five sections matching the nav 1:1:

```
Hero → about (who) → services (what + CTA) → work (proof)
     → trust (results) → RahatVerse invite → contact
```

The hero had four competing CTAs; it now has one primary
("Start a Website Project") and one secondary ("See My Work").

**RahatVerse** is presented as an optional door, in its own section, with two
clear paths and an honest note that it is a demonstration, not a prerequisite.
Nobody is pushed into a game.

---

## 5. Performance

| Metric | Before | After |
|---|---|---|
| `/order` first-load JS | 351 kB | **123 kB** |
| Routes in build | 44 | 40 |

- three.js/drei in the visual builder and all six order tab panels are now
  `next/dynamic` — only the open tab downloads.
- Middleware skips the Supabase session round-trip on public routes and no
  longer runs on static assets.
- `/museum` and `/admin/orders` degrade to an empty state instead of a 500
  when Supabase is unreachable.

---

## 6. Route sweep

All routes return 200 (404 only for genuinely missing paths), with no
server-side exceptions:

```
/ 200   /order 200   /museum 200   /rahatverse 200   /login 200
/dashboard 200   /admin 200   /api/health 200   /unauthorized 200
/services 308→/#services   /verse 308→/rahatverse   /service-district 308→/order
/nope 404
```

`/museum` returned **500** before this work.

---

## 7. Remaining items (not done deliberately)

1. **Apply migration `0009`** — the order fix is not complete until it runs.
2. **Cloudinary upload preset** is unset, so non-image uploads fall back to
   `URL.createObjectURL`, producing a `blob:` URL that is useless server-side.
   Set `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` or disable file uploads.
3. **Fonts** still load via `<link>` to Google Fonts. Switching to `next/font`
   is a clear win but could not be verified here (no network egress to
   fonts.googleapis.com), so it was reverted rather than shipped blind.
4. **Git branches** — the remote has only `main`; there are no stale or
   unmerged branches to clean up.
5. The admin panel is large (22 sections) and largely untested. It was left
   functionally intact; consolidating it is a separate piece of work.
