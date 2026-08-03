# Vercel Deploy Guide - Rahat Ahmed Portfolio (Bangla)

> Ei guide ta apnar current codebase (main branch e merge kora) ke Vercel e deploy korar jonno step-by-step.

## 0) Ki fix kora holo? (Summary)

**A. Auth bug fix**
- Aage `requireAdmin()` sudhu `profiles.role` dekhto, kintu apnar DB te role ache `role_id` te (`super_admin`, `admin`, `manager`...)
- Ekhon `src/lib/auth/session.ts` e `getEffectiveRole()`, `isAdminProfile()`, `isAtLeastClientProfile()` add kora holo. Admin layout + middleware eo `manager` include.
- Fole login korar por ar `/admin` e 403 / unauthorized ashbe na.

**B. File Vault blob:URL bug fix**
- Aage `FileVaultUI` te `URL.createObjectURL()` diye blob: URL DB te save hoto - tab bondho korlei file dead.
- Ekhon permanent Cloudinary upload: unsigned preset thakle direct, na thakle signed endpoint `/api/uploads/sign-client` diye.
- Notun endpoint `src/app/api/uploads/sign-client/route.ts` add kora holo client der jonno.

**C. Config hardening**
- `next.config.mjs` e Supabase storage domain image remotePatterns e add.
- `future-architecture.ts` theke `console.log` remove (ekhon src/ te 0 ta console.log).
- Build verified: `npm run typecheck`, `npm run lint`, `npm run build` OK (47 routes).

---

## 1) Supabase - Migration 0009 apply (MUST)

Eita na korle order submission + admin visibility bug thakbe.

1. https://supabase.com/dashboard -> apnar project `aaejtdpadrxwplomraog` select
2. Left sidebar -> **SQL Editor** -> **New query**
3. Repo theke `supabase/migrations/0009_fix_orders_submission_and_admin_access.sql` file er full content copy-paste
4. **Run** press

Verify:
```sql
select policyname, cmd from pg_policies where tablename='orders' order by cmd;
-- expect 4 rows: insert / select / update / delete

select public.is_admin();
-- apni admin user hoye login thakle expect true
```

---

## 2) Cloudinary - Unsigned preset banan (Recommended)

Apni diyechen `ml_default` - eta **signed** preset. Unsigned upload fail korbe "must be whitelisted for unsigned" diye.

**Option A - Best for public (Recommended):**
1. https://console.cloudinary.com -> Settings (gear) -> **Upload**
2. **Upload presets** -> **Add upload preset**
3. Settings:
   - **Signing Mode**: `Unsigned`  <-- important
   - **Preset name**: `rahatverse_uploads` (nijer moto naam o dite paren)
   - **Folder**: `rahatverse`
   - **Max file size**: 10 MB
   - **Allowed formats**: jpg, png, webp, pdf, doc, zip etc
4. Save

**Option B - Admin only:**
- Kono preset lagbe na, shudhu server keys diye admin media library cholbe. Public file upload disabled thakbe, user der bola hobe email/WhatsApp e pathate.

> Note: `ml_default` signed, tai browser theke direct upload hobena. Tai unsigned preset bananoi valo.

---

## 3) Vercel e deploy

### 3.1 Project import
1. https://vercel.com -> **Add New** -> **Project**
2. Import GitHub repo: `rahatahmedbd/rahatahmedbd.github.io`
3. Framework preset: **Next.js** (auto detect)
4. Root directory: `./` (default)
5. Build command: `npm run build` (default)
6. Output directory: `.next` (default)

### 3.2 Environment Variables (Vercel Dashboard -> Settings -> Environment Variables)

**Production, Preview, Development - sobgulote same value dite hobe:**

| Variable | Value | Note |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://aaejtdpadrxwplomraog.supabase.co` | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` (apnar anon key) | public but secret rakhen, git e push korben na |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...service_role` | **Server only, NEVER NEXT_PUBLIC_** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `kbc3dfnj` | public |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `rahatverse_uploads` (unsigned) or `ml_default` hole signed mode e jabe | public |
| `CLOUDINARY_API_KEY` | `313952973845476` | Server only |
| `CLOUDINARY_API_SECRET` | `3HOZ1VLD0ibbWjp1hoObAlOJo3c` | Server only |
| `NEXT_PUBLIC_SITE_URL` | `https://apnar-vercel-url.vercel.app` (deploy er por custom domain) | public |
| `NEXT_PUBLIC_FORMSPREE_ID` | (optional) Formspree form ID | public |

**IMPORTANT:**
- `CLOUDINARY_API_KEY` / `SECRET` kokhono `NEXT_PUBLIC_` prefix diye diben na. Browser e expose hole account abuse hobe.
- `NEXT_PUBLIC_*` variables build time e bake hoy, tai env add korar por **Redeploy** korte hobe.

### 3.3 Deploy
- **Deploy** click. 2-3 min e build hobe.
- Build log e `✓ Compiled successfully` ar `Generating static pages (47/47)` dekhben.

### 3.4 Post-deploy check
- `/api/health` -> `{ status: "ok", integrations: { supabase:true, cloudinaryDelivery:true, cloudinarySigning:true } }`
- `/` -> homepage load
- `/order` -> guest hisebe order submit (incognito te test)
- `/admin/orders` -> admin login kore order list e dekhun
- `/admin/media` -> image upload test
- `/dashboard/files` -> client login e File Vault upload test

---

## 4) Logs & Error check

- `src/` e ekhon `console.log` 0 ta. Sudhu `console.error` ache server-side error reporting er jonno (intentional).
- Vercel Dashboard -> Project -> **Logs** e runtime error check korun.
- Supabase Dashboard -> **Logs** e RLS error thakle migration 0009 run korenni bujhben.

---

## 5) Custom Domain (Namecheap + Vercel)

Apni bollen future e Namecheap theke domain kinben:

1. Namecheap e domain kinen (e.g. `rahatahmed.com`)
2. Vercel Dashboard -> Project -> **Settings** -> **Domains** -> Add domain
3. Vercel apnake DNS records dibe (A / CNAME)
4. Namecheap Dashboard -> Domain List -> Manage -> Advanced DNS:
   - Type: `CNAME`, Host: `@` or `www`, Value: `cname.vercel-dns.com` (Vercel ja dey)
   - Vercel automatically SSL issue kore debe (Let's Encrypt)
5. 5-10 min propagate hole `https://yourdomain.com` live.

**www redirect:**
- Vercel e both `yourdomain.com` and `www.yourdomain.com` add korun, ekta ke primary korun.

---

## 6) Future: Hostinger VPS e host korle

Jodi pore VPS e move korte chan:

**Option A - Docker + PM2 (Recommended):**
```bash
# VPS e
git clone https://github.com/rahatahmedbd/rahatahmedbd.github.io.git
cd rahatahmedbd.github.io
npm install --legacy-peer-deps
# .env.local file create with same env vars as Vercel
npm run build
npm i -g pm2
pm2 start npm --name "rahat-portfolio" -- start
pm2 save
pm2 startup
```

**Nginx reverse proxy:**
```nginx
server {
  server_name yourdomain.com www.yourdomain.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```
- Certbot diye SSL: `certbot --nginx -d yourdomain.com -d www.yourdomain.com`

**Option B - Vercel e rekhe custom domain use kora:**
- Sobcheye easy, Vercel e auto scaling, SSL, CDN free. VPS lagbe na unless apnar special backend lagbe.

---

## 7) Security checklist (Important)

- [ ] `.env.local` / secrets kokhono GitHub e push korben na - `.gitignore` e ache
- [ ] Cloudinary unsigned preset e max size + allowed format limit set korechen?
- [ ] Supabase RLS policies migration 0009 run korechen?
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ar `CLOUDINARY_API_SECRET` sudhu server env e, Vercel e `NEXT_PUBLIC_` chara?
- [ ] Admin user er `role_id` = `super_admin` Supabase `profiles` table e set ache to?

Super admin set korte (first time):
```sql
update profiles set role_id='super_admin', is_active=true where email='apnar-admin-email@gmail.com';
```

---

## 8) Local dev test before Vercel

```bash
cp .env.example .env.local
# .env.local e apnar keys bosan (jeta Vercel e diben same)
npm install --legacy-peer-deps
npm run dev # http://localhost:3000
npm run build && npm run start # prod test
```

---

## Help lagle

- Build log e error hole Vercel -> Deployments -> View Build Logs
- Supabase RLS error hole SQL Editor e `select * from pg_policies where tablename='orders'` check
- Cloudinary 401 error hole preset unsigned kina check, ba `sign-client` endpoint er log check

**Ready?** Vercel e env vars add kore Deploy click korun - InshaAllah live hoye jabe!

---
Made with ❤️ for Rahat Ahmed - Sunamganj, Bangladesh
