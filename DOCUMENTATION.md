# 📖 Rahat Ahmed Portfolio & Web Agency Business Platform — Platform Documentation (Phases 3 - 8)

Welcome to the unified documentation of your premium, enterprise-ready Web Agency Business Platform! This guide outlines the technology stack, directory mappings, environment configurations, relational database schemas, admin operations, and future-ready scale architectures.

---

## 🏗️ 1. Project & Directory Structure

The project is built on Next.js 14 App Router, TypeScript, TailwindCSS, Supabase, and Cloudinary. Below is the directory mapping of newly added systems:

```
rahatahmedbd.github.io/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Authentication views
│   │   │   ├── login/          # Secure Sign In Form (w/ first Admin setup prompt)
│   │   │   ├── forgot-password/# Reset Request Link wizard
│   │   │   ├── reset-password/ # Set New Password Recovery thread
│   │   │   └── unauthorized/   # Custom 404 access-denied screen
│   │   ├── admin/              # Super Admin SaaS CMS Dashboard
│   │   │   ├── faq/            # FAQ QA editor and reordering list
│   │   │   ├── media/          # Cloudinary Media Manager (CDN uploader & clipboard)
│   │   │   ├── notifications/  # Admin Real-time Alerts dashboard
│   │   │   ├── orders/         # Project Requests lifecycles & quotes linker
│   │   │   ├── portfolio/      # Portfolio projects & technology tags CMS
│   │   │   ├── profile/        # Admin personal profile & credential manager
│   │   │   ├── services/       # Services listings translations manager
│   │   │   ├── settings/       # Global website variables & contacts settings
│   │   │   └── page.tsx        # Dashboard Statistics & Activities overview
│   │   ├── dashboard/          # Premium Client Dashboard Portal
│   │   │   ├── files/          # Attached requirement assets & final download links
│   │   │   ├── invoices/       # Invoices recap & payment tracking ( INV-XXXXXX )
│   │   │   ├── messages/       # In-App Project conversation chat bubble feeds
│   │   │   ├── notifications/  # Real-time client status & message alerts
│   │   │   ├── profile/        # Client profile & password details editor
│   │   │   ├── projects/       # 9-Stage dynamic progress timeline card expansion
│   │   │   └── revisions/      # Client revisions logger & Developer feedback notes
│   │   ├── order/              # Multi-Step project request form (Multi-selection)
│   │   ├── actions/            # Secure Server-Side Actions
│   │   │   ├── auth.ts         # Login, Logout, and Admin Setup actions
│   │   │   ├── cms.ts          # FAQ, Services, Testimonials, Projects and SEO actions
│   │   │   ├── chat.ts         # Project-specific message threads actions
│   │   │   └── profile.ts      # Client profile edit actions
│   │   ├── layout.tsx          # Conditional layout header / footer isolating logic
│   │   ├── not-found.tsx       # Custom Error 404 Lost in space page
│   │   └── error.tsx           # Custom Error 500 Server Crash rescue page
│   ├── config/
│   │   └── env.ts              # Type-safe Environment Variables validation
│   ├── lib/
│   │   ├── auth/
│   │   │   └── session.ts      # Active Session profile & role require guards
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser Supabase constructor
│   │   │   ├── middleware.ts   # HTTP Cookie rotations & Role access-control middleware
│   │   │   └── server.ts       # Server-Side Supabase constructor
│   │   └── validation/
│   │       └── schemas.ts      # Zod validation schemas for logins & forms
```

---

## 🔑 2. Environment Variables (`.env.local`)

Register these variables inside your Vercel/local hosting environment to authenticate APIs:

```env
# ── Contact form (Formspree ID) ───────────────────────────
NEXT_PUBLIC_FORMSPREE_ID=your_form_id_here

# ── Supabase (Auth, DB, Storage) ──────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://aaejtdpadrxwplomraog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_secure_service_role_key_here

# ── Cloudinary (Image Hosting CDN) ───────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=kbc3dfnj
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# ── Site URL ──────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://rahatahmedbd.github.io
```

---

## 🗄️ 3. Relational Database Migrations Schema

Your database has been fully structured across several backward-compatible SQL files:

### Migration 0003: Core Roles, Permissions & Logs
- **`roles`**: Predefined text-based roles (`super_admin`, `admin`, `manager`, `developer`, `designer`, `content_manager`, `support_agent`, `client`, `visitor`).
- **`permissions`**: Fine-grained authorization permissions (`manage:website`, `manage:users`, `track:projects`, `view:invoices`, etc.).
- **`role_permissions`**: Many-to-many junction table assigning permissions to specific roles.
- **`activity_logs`**: Capture precise timestamps, User IP, and User Agents for updates.
- **`login_history`**: Audit logs for session credentials validation tracking.
- **`session_records`**: Tracking login token records for active device revocation.

### Migration 0004: Services & Multilingual translations
- **`services`**: Database table storing bilingual title/description translations (`title_en`, `title_bn`, `description_en`, `description_bn`), Lucide icon class mapping, and sort indexes.

### Migration 0005: Extended Project Orders
- Extends `orders` table to track complete project request parameters (`client_info` JSONB, `website_type`, `required_features` array, `design_preference`, `budget_option`, `deadline_option`, `project_details`, `uploaded_files` JSONB, `estimated_cost`, `estimated_delivery`, `final_price`, `final_delivery`, `is_priority`, `internal_notes`, and `internal_files`).
- Sets RLS inserts for public client project request form submissions.

### Migration 0006: Client Messaging & Revisions
- **`project_messages`**: Connects real-time chat bubble feeds, sender references, and files attached on messages.
- **`revisions`**: Manages client review logs, statuses (`pending`, `approved`, `rejected`, `completed`), and developer feedback.

---

## 👑 4. Super Admin Operations Workflow

### A. Initializing the Super Admin
1. Navigate to `/login`.
2. If there are no administrative profiles found, click the prominent **"Initialize Super Admin"** link.
3. Register your Full Name, Email, Password, and Phone details.
4. **Security Check**: This registration page is permanently closed immediately after the first record is written. The PostgreSQL DB trigger forces any subsequent admin signups to resolve as the default `'visitor'` role, preventing public administration elevation.

### B. Project & Quote Conversion Lifecycle
1. Navigate to **Website Orders** inside the Admin sidebar.
2. Review the client's information, features selected, and download their briefs/logos.
3. Open **Quotes & Proposals** and click **Generate Quote** specifying custom timelines and finalized pricing based on your discussion.
4. Once the client approves, click **Convert Quote** on their quotation inside your Admin panel. This automatically updates the quote status to `'converted'` and sets their order status to `'quote accepted'`, prompting the project tracking timeline!

### C. General Website & SEO Management
- Manage site settings under **Website Settings** (contacts, WhatsApp, addresses, copyright details) and **SEO Manager** (Open Graph images, Robots.txt content, meta descriptors, keywords).

---

## 👥 5. Client Workflow & Portal Engagement

### A. Requesting a Project
1. Client clicks **"Order Website"** on the public navigation menu.
2. Fills in contact info, category selection, checkboxes core features, layout style (corporate, dark, creative), and budget timeline.
3. Live Cost Estimator adds pricing parameters dynamically on selections.
4. Client uploads logo details and description briefs and submits.
5. Receives a custom **`ORD-XXXXXX` ID** and is prompted to register/login.

### B. Tracking Progress
- Client logs in to `/dashboard` to view active project timelines, upload supplementary assets, message support teams directly on the thread, log revision requests, and view/download final bill receipts.

---

## ⚡ 6. Performance, SEO & Security Hardening (Phase 8 Optimized)

1. **AI Business Assistant**: Integrated an interactive helper at `/admin/ai-assistant` assisting administrators in parsing client requirements, suggesting milestones, detecting missing links, and drafting response emails.
2. **SEO Structured Data**: Injected meta headers and isolated sitemaps configurations completely dynamic from the database settings.
3. **Layout Separation**: Programmed server-side header parsers inside Next.js `layout.tsx` that isolate public scroll pages from Admin/Client SaaS layouts dynamically based on pathname.
4. **WCAG Accessibility Enforcements**: Form buttons and selects use proper focus borders, high-contrast text ratios, semantic HTML cards, and Lucide ARIA roles.
5. **Typescript Strict Enforcements**: Enforced explicit TypeScript types and validations across all custom forms, payload objects, and state parameters.
