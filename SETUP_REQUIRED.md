# Two things only you can do

I cannot do either of these from here — both need credentials I do not and
should not have. Each takes a few minutes.

---

## 1. Run migration `0009` (required — orders stay broken without it)

This is the fix for the order submission bug. Until it runs, admins still
fail every permission check and orders will not show in the Admin Panel.

### Easiest way — Supabase SQL Editor

1. Open <https://supabase.com/dashboard> → your project
   (`aaejtdpadrxwplomraog`)
2. Left sidebar → **SQL Editor** → **New query**
3. Open `supabase/migrations/0009_fix_orders_submission_and_admin_access.sql`
   in this repo, copy the whole file, paste it in
4. Press **Run**

It is safe to run more than once (`drop policy if exists` / `create or
replace` throughout), so if you are unsure whether it already ran, just run it.

### Verify it worked

Run this in the same SQL Editor afterwards:

```sql
-- Expect 4 rows: insert / select / update / delete
select policyname, cmd
from pg_policies
where tablename = 'orders'
order by cmd;

-- Expect true for your own admin account while logged in as that user
select public.is_admin();

-- Expect a default of public.generate_order_reference()
select column_default
from information_schema.columns
where table_name = 'orders' and column_name = 'reference';
```

### Then test the real thing

1. Open `/order` in a **private/incognito window** (this tests the guest path,
   which is the one that was broken)
2. Complete the flow and submit
3. You should get a reference like `ORD-A7K2M9QP`
4. Log into `/admin/orders` — the order must be listed there

Do this two or three times. If any submission fails, send me the exact error
text shown on screen.

---

## 2. `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — what it is and what to do

### What it actually is

An **upload preset** is a named set of rules saved in your Cloudinary account
(where files land, size limits, allowed formats). An *unsigned* preset lets a
visitor's browser upload straight to Cloudinary without your secret key —
which is exactly what you want for a public order form, because the secret
key must never reach the browser.

`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is just the preset's **name**. The
`NEXT_PUBLIC_` prefix means it is visible in the browser — that is fine and
intended. An unsigned preset name is not a secret.

Your cloud name (`kbc3dfnj`) is already configured. Only the preset is missing.

### You have three options

| Option | Effect | Choose if |
|---|---|---|
| **A — create the preset** | Clients and visitors can attach files | You want file uploads (recommended) |
| **B — do nothing** | Uploads stay disabled with a clear message; nothing breaks | You are happy collecting files by email/WhatsApp |
| **C — admin-only uploads** | Only you can upload, via server signing | You want the media library but not public uploads |

**Option B is genuinely fine.** After the last fix, the app now hides the
upload button and tells people to send files by email instead. Nothing is
silently lost. Do not feel you must set this up today.

### Option A — create an unsigned preset (about 3 minutes)

1. <https://console.cloudinary.com> → **Settings** (gear icon) → **Upload**
2. Scroll to **Upload presets** → **Add upload preset**
3. Set:
   - **Signing Mode**: `Unsigned` ← the important one
   - **Preset name**: `rahatverse_uploads` (or anything you like)
   - **Folder**: `rahatverse` (keeps your media tidy)
4. Save, then copy the preset name

Then add to `.env.local` for local dev:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=kbc3dfnj
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=rahatverse_uploads
```

And in **Vercel** → Project → Settings → Environment Variables, add the same
two for Production, Preview and Development. **Redeploy after adding them** —
`NEXT_PUBLIC_*` values are baked in at build time, so an existing deployment
will not pick them up.

> Please also set a **max file size** on the preset (say 10 MB) and restrict
> formats to what you actually need. An unsigned preset is a public upload
> endpoint; without limits, anyone who reads your page source could upload
> large files to your account.

### Option C — admin-only uploads

Skip the preset. Add these **server-side** variables instead (no
`NEXT_PUBLIC_` prefix — these are secret and must never be exposed):

```bash
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Admin uploads at `/admin/media` will then work through the existing signing
endpoint. The public order form will still have uploads disabled.

---

## Already handled for you

While checking this I found the Content-Security-Policy in `vercel.json`
allowed `connect-src` only to Supabase and Formspree — **not** to
`api.cloudinary.com`. Even with a correct preset, the browser would have
blocked every upload with an opaque CSP error. That is now fixed, so option A
will work as soon as you add the variable.
