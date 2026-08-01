-- 0001_initial_schema.sql
-- Core Phase 2 Supabase SQL Schema (Source of Record)

-- ─────────────────────────────────────────────────────────────────────────────
-- Custom ENUM Types
-- ─────────────────────────────────────────────────────────────────────────────

create type public.user_role as enum ('visitor', 'client', 'admin');
create type public.project_status as enum ('draft', 'active', 'archived');
create type public.testimonial_status as enum ('pending', 'approved', 'rejected');
create type public.order_status as enum ('pending', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled');
create type public.notification_type as enum ('info', 'success', 'warning', 'error');
create type public.blog_post_status as enum ('draft', 'published', 'archived');
create type public.payment_status as enum ('pending', 'completed', 'failed', 'refunded');
create type public.invoice_status as enum ('draft', 'issued', 'paid', 'overdue', 'cancelled');

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. profiles
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'visitor'::public.user_role,
  avatar_url text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. categories
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. projects
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description text,
  cover_image_url text,
  gallery_urls jsonb default '[]'::jsonb,
  category_id uuid references public.categories(id) on delete set null,
  live_url text,
  repo_url text,
  status public.project_status not null default 'draft'::public.project_status,
  featured boolean not null default false,
  sort_order integer not null default 0,
  tags text[] default '{}'::text[]
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. portfolio_items
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text,
  image_url text,
  meta jsonb default '{}'::jsonb,
  published boolean not null default false,
  sort_order integer not null default 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. testimonials
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  author_avatar_url text,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null,
  status public.testimonial_status not null default 'pending'::public.testimonial_status
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. orders
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  status public.order_status not null default 'pending'::public.order_status,
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  notes text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. messages
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  body text not null,
  is_read boolean not null default false
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. notifications
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null default 'info'::public.notification_type,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. file_assets
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.file_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  bucket text not null,
  path text not null,
  name text not null,
  mime_type text,
  size_bytes bigint,
  public_url text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. settings
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. faqs
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null,
  sort_order integer not null default 0,
  published boolean not null default true
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. blog_posts
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image_url text,
  status public.blog_post_status not null default 'draft'::public.blog_post_status,
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  tags text[] default '{}'::text[]
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. payments
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status public.payment_status not null default 'pending'::public.payment_status
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 14. invoices
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  order_id uuid references public.orders(id) on delete set null,
  client_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status public.invoice_status not null default 'draft'::public.invoice_status,
  issued_at timestamptz,
  due_at timestamptz,
  pdf_url text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- SQL Helper: public.is_admin()
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
end;
$$ language plpgsql security definer;

-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-Profile-on-Signup Trigger
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    avatar_url,
    phone,
    is_active
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'visitor'::public.user_role),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS) Configuration
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.file_assets enable row level security;
alter table public.settings enable row level security;
alter table public.faqs enable row level security;
alter table public.blog_posts enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;

-- Profiles: users read own profile, admins read/update all
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- Categories: public read, admin write
create policy "Public read categories" on public.categories
  for select using (true);
create policy "Admin write categories" on public.categories
  for all using (public.is_admin());

-- Projects: public read active projects, admin full access
create policy "Public read projects" on public.projects
  for select using (status = 'active' or public.is_admin());
create policy "Admin write projects" on public.projects
  for all using (public.is_admin());

-- Portfolio Items: public read published, admin full access
create policy "Public read portfolio items" on public.portfolio_items
  for select using (published = true or public.is_admin());
create policy "Admin write portfolio items" on public.portfolio_items
  for all using (public.is_admin());

-- Testimonials: public read approved, anyone can insert, admin write
create policy "Public read approved testimonials" on public.testimonials
  for select using (status = 'approved' or public.is_admin());
create policy "Anyone insert testimonials" on public.testimonials
  for insert with check (true);
create policy "Admin write testimonials" on public.testimonials
  for all using (public.is_admin());

-- Orders: client read own orders, admin full access
create policy "Client read own orders" on public.orders
  for select using (auth.uid() = client_id or public.is_admin());
create policy "Client create orders" on public.orders
  for insert with check (auth.uid() = client_id or public.is_admin());
create policy "Admin update orders" on public.orders
  for update using (public.is_admin());

-- Messages: anyone can insert, admin read/update
create policy "Anyone insert messages" on public.messages
  for insert with check (true);
create policy "Admin access messages" on public.messages
  for all using (public.is_admin());

-- Notifications: user read own notifications
create policy "User read own notifications" on public.notifications
  for select using (auth.uid() = user_id or public.is_admin());
create policy "User update own notifications" on public.notifications
  for update using (auth.uid() = user_id or public.is_admin());
create policy "Admin write notifications" on public.notifications
  for all using (public.is_admin());

-- File Assets: owner read/write, admin full access
create policy "Owner access file assets" on public.file_assets
  for all using (auth.uid() = owner_id or public.is_admin());

-- Settings: public read, admin write
create policy "Public read settings" on public.settings
  for select using (true);
create policy "Admin write settings" on public.settings
  for all using (public.is_admin());

-- FAQs: public read published, admin full access
create policy "Public read faqs" on public.faqs
  for select using (published = true or public.is_admin());
create policy "Admin write faqs" on public.faqs
  for all using (public.is_admin());

-- Blog Posts: public read published, admin full access
create policy "Public read blog posts" on public.blog_posts
  for select using (status = 'published' or public.is_admin());
create policy "Admin write blog posts" on public.blog_posts
  for all using (public.is_admin());

-- Payments: client read own payments, admin full access
create policy "Client read own payments" on public.payments
  for select using (
    exists (select 1 from public.orders where id = order_id and client_id = auth.uid())
    or public.is_admin()
  );
create policy "Admin write payments" on public.payments
  for all using (public.is_admin());

-- Invoices: client read own invoices, admin full access
create policy "Client read own invoices" on public.invoices
  for select using (auth.uid() = client_id or public.is_admin());
create policy "Admin write invoices" on public.invoices
  for all using (public.is_admin());
