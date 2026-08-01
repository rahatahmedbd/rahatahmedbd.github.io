# Supabase Configuration & Schema

This directory contains the database schema and storage bucket definitions for Phase 2 of Rahat Ahmed's Portfolio backend foundation.

## Migrations

- **`0001_initial_schema.sql`**: Configures custom ENUM types (`user_role`, `project_status`, `testimonial_status`, `order_status`, `notification_type`, `blog_post_status`, `payment_status`, `invoice_status`), all 14 core domain tables (`profiles`, `categories`, `projects`, `portfolio_items`, `testimonials`, `orders`, `messages`, `notifications`, `file_assets`, `settings`, `faqs`, `blog_posts`, `payments`, `invoices`), SQL helper `public.is_admin()`, auto-profile creation trigger on signup, and Row Level Security (RLS) policies.
- **`0002_storage_buckets.sql`**: Configures the 4 core Supabase Storage buckets (`client-documents`, `project-files`, `attachments`, `logos`) along with RLS storage policies.

## Storage Buckets
- `client-documents` (private)
- `project-files` (private)
- `attachments` (private)
- `logos` (public)
