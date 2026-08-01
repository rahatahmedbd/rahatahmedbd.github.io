-- 0006_client_portal_tables.sql
-- Phase 6 - Client Dashboard & Project Management Portal Tables

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. project_messages Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS on project_messages
alter table public.project_messages enable row level security;

-- Policies for project_messages:
-- Clients can read and insert messages on their own orders
create policy "Clients can access own project_messages" on public.project_messages
  for all using (
    exists (
      select 1 from public.orders
      where id = order_id and (client_id = auth.uid() or public.is_admin())
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. revisions Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.revisions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  description text not null,
  attachments jsonb not null default '[]'::jsonb,
  status text not null default 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on revisions
alter table public.revisions enable row level security;

-- Policies for revisions:
create policy "Clients can access own revisions" on public.revisions
  for all using (
    client_id = auth.uid() or public.is_admin()
  );
