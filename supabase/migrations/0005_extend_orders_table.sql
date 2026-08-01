-- 0005_extend_orders_table.sql
-- Phase 5 - Ordering System Database Schema Extensions

alter table public.orders add column if not exists client_info jsonb default '{}'::jsonb;
alter table public.orders add column if not exists website_type text;
alter table public.orders add column if not exists required_features text[] default '{}'::text[];
alter table public.orders add column if not exists design_preference text[] default '{}'::text[];
alter table public.orders add column if not exists budget_option text;
alter table public.orders add column if not exists deadline_option text;
alter table public.orders add column if not exists project_details text;
alter table public.orders add column if not exists uploaded_files jsonb default '[]'::jsonb;
alter table public.orders add column if not exists estimated_cost numeric(12,2) default 0;
alter table public.orders add column if not exists estimated_delivery text;
alter table public.orders add column if not exists final_price numeric(12,2);
alter table public.orders add column if not exists final_delivery text;
alter table public.orders add column if not exists is_priority boolean default false;
alter table public.orders add column if not exists internal_notes text;
alter table public.orders add column if not exists internal_files jsonb default '[]'::jsonb;

-- Make client_id nullable to allow guest orders
alter table public.orders alter column client_id drop not null;

-- Add select policy for order list in admin panel
drop policy if exists "Admin update orders" on public.orders;
create policy "Admin access all orders" on public.orders
  for all using (public.is_admin());

-- Allow anyone (public) to insert new project request orders
create policy "Anyone can insert orders" on public.orders
  for insert with check (true);
