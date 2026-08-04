-- Phase 15 Backend Platform & Admin Ecosystem
-- Apply in Supabase SQL editor or through Supabase CLI after reviewing admin emails.

create extension if not exists "pgcrypto";

do $$
begin
  create type public.platform_role as enum ('client', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum (
    'new',
    'confirmed',
    'planning',
    'design',
    'development',
    'review',
    'delivered',
    'completed',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum ('not_started', 'pending', 'partial', 'paid', 'refunded');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.content_resource as enum (
    'portfolio',
    'services',
    'pricing',
    'gallery',
    'achievements',
    'education',
    'contact'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.message_sender_role as enum ('client', 'admin', 'system');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.platform_role not null default 'client',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_key on public.profiles (lower(email));

create table if not exists public.website_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  business_name text,
  message text,
  website_type_id text not null,
  package_id text not null,
  extras text[] not null default '{}',
  source text not null default 'website',
  pricing jsonb not null default '{}'::jsonb,
  catalog_snapshot jsonb not null default '{}'::jsonb,
  status public.order_status not null default 'new',
  progress_percent integer not null default 5 check (progress_percent between 0 and 100),
  payment_status public.payment_status not null default 'not_started',
  admin_notes text,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists website_orders_user_id_idx on public.website_orders (user_id);
create index if not exists website_orders_contact_email_idx on public.website_orders (lower(contact_email));
create index if not exists website_orders_status_created_idx on public.website_orders (status, created_at desc);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.website_orders(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.website_orders(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_role public.message_sender_role not null,
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists order_messages_order_created_idx on public.order_messages (order_id, created_at);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.website_orders(id) on delete cascade,
  label text not null,
  file_name text not null,
  file_url text not null,
  file_size bigint,
  mime_type text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  resource public.content_resource not null,
  key text not null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'published',
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (resource, key)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  asset_id text,
  url text,
  secure_url text not null,
  resource_type text not null,
  format text,
  bytes bigint,
  width integer,
  height integer,
  folder text,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  channel text not null,
  recipient text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  visitor_id text,
  user_id uuid references auth.users(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.error_logs (
  id uuid primary key default gen_random_uuid(),
  context text not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists website_orders_set_updated_at on public.website_orders;
create trigger website_orders_set_updated_at
before update on public.website_orders
for each row execute function public.set_updated_at();

drop trigger if exists content_entries_set_updated_at on public.content_entries;
create trigger content_entries_set_updated_at
before update on public.content_entries
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.owns_order(order_row public.website_orders)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null and (
    order_row.user_id = auth.uid()
    or lower(order_row.contact_email) = lower(coalesce((select email from auth.users where id = auth.uid()), ''))
  );
$$;

alter table public.profiles enable row level security;
alter table public.website_orders enable row level security;
alter table public.order_events enable row level security;
alter table public.order_messages enable row level security;
alter table public.project_files enable row level security;
alter table public.content_entries enable row level security;
alter table public.media_assets enable row level security;
alter table public.notification_jobs enable row level security;
alter table public.analytics_events enable row level security;
alter table public.error_logs enable row level security;

drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select" on public.profiles
for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = 'client');

drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles" on public.profiles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anon can submit website orders" on public.website_orders;
create policy "anon can submit website orders" on public.website_orders
for insert to anon, authenticated
with check (status = 'new' and progress_percent between 0 and 10);

drop policy if exists "clients read own orders" on public.website_orders;
create policy "clients read own orders" on public.website_orders
for select to authenticated using (public.owns_order(website_orders) or public.is_admin());

drop policy if exists "admins manage website orders" on public.website_orders;
create policy "admins manage website orders" on public.website_orders
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "clients read own order events" on public.order_events;
create policy "clients read own order events" on public.order_events
for select to authenticated using (
  exists (select 1 from public.website_orders where id = order_id and (public.owns_order(website_orders) or public.is_admin()))
);

drop policy if exists "admins write order events" on public.order_events;
create policy "admins write order events" on public.order_events
for insert to authenticated with check (public.is_admin());

drop policy if exists "participants read messages" on public.order_messages;
create policy "participants read messages" on public.order_messages
for select to authenticated using (
  exists (select 1 from public.website_orders where id = order_id and (public.owns_order(website_orders) or public.is_admin()))
);

drop policy if exists "participants send messages" on public.order_messages;
create policy "participants send messages" on public.order_messages
for insert to authenticated with check (
  sender_id = auth.uid()
  and exists (select 1 from public.website_orders where id = order_id and (public.owns_order(website_orders) or public.is_admin()))
);

drop policy if exists "participants read project files" on public.project_files;
create policy "participants read project files" on public.project_files
for select to authenticated using (
  exists (select 1 from public.website_orders where id = order_id and (public.owns_order(website_orders) or public.is_admin()))
);

drop policy if exists "admins manage project files" on public.project_files;
create policy "admins manage project files" on public.project_files
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "published content is public" on public.content_entries;
create policy "published content is public" on public.content_entries
for select to anon, authenticated using (status = 'published' or public.is_admin());

drop policy if exists "admins manage content" on public.content_entries;
create policy "admins manage content" on public.content_entries
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "media is public readable" on public.media_assets;
create policy "media is public readable" on public.media_assets
for select to anon, authenticated using (true);

drop policy if exists "admins manage media" on public.media_assets;
create policy "admins manage media" on public.media_assets
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read notification jobs" on public.notification_jobs;
create policy "admins read notification jobs" on public.notification_jobs
for select to authenticated using (public.is_admin());

drop policy if exists "authenticated creates analytics" on public.analytics_events;
create policy "authenticated creates analytics" on public.analytics_events
for insert to anon, authenticated with check (true);

drop policy if exists "admins read analytics" on public.analytics_events;
create policy "admins read analytics" on public.analytics_events
for select to authenticated using (public.is_admin());

drop policy if exists "admins read errors" on public.error_logs;
create policy "admins read errors" on public.error_logs
for select to authenticated using (public.is_admin());

-- Storage buckets for future direct Supabase storage usage. Cloudinary remains
-- the primary CDN for public media; project-files is private by policy.
insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('project-files', 'project-files', false)
on conflict (id) do nothing;

drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "admins manage media bucket" on storage.objects;
create policy "admins manage media bucket" on storage.objects
for all to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins manage project files bucket" on storage.objects;
create policy "admins manage project files bucket" on storage.objects
for all to authenticated using (bucket_id = 'project-files' and public.is_admin()) with check (bucket_id = 'project-files' and public.is_admin());

do $$
begin
  alter publication supabase_realtime add table public.website_orders;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.order_messages;
exception when duplicate_object then null;
end $$;
