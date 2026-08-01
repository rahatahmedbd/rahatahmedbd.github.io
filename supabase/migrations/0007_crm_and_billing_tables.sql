-- 0007_crm_and_billing_tables.sql
-- Phase 7 - CRM Leads & Proposal Quotes Tables

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. leads Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company_name text,
  status text not null default 'new', -- 'new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'
  notes text,
  follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on leads
alter table public.leads enable row level security;

-- Policies for leads: Admin full access
create policy "Admin full access leads" on public.leads
  for all using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. quotes Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  client_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  services jsonb not null default '[]'::jsonb,
  timeline text,
  pricing numeric(12,2) not null default 0,
  notes text,
  terms text,
  status text not null default 'sent', -- 'draft', 'sent', 'accepted', 'declined', 'converted'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on quotes
alter table public.quotes enable row level security;

-- Policies for quotes: Client read own, Admin full access
create policy "Client read own quotes" on public.quotes
  for select using (client_id = auth.uid() or public.is_admin());
create policy "Admin manage all quotes" on public.quotes
  for all using (public.is_admin());
