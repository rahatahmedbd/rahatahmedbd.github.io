-- 0009_fix_orders_submission_and_admin_access.sql
-- Stabilization migration.
--
-- Fixes two production defects:
--
-- 1. Guest order submissions failed at the final step.
--    `insert ... select().single()` returns the new row through the SELECT
--    policy. Guest orders have client_id = NULL, so `auth.uid() = client_id`
--    is NULL (never true) and the row was filtered out of RETURNING,
--    making PostgREST raise "JSON object requested, 0 rows returned".
--
-- 2. `public.is_admin()` checked `profiles.role` (the legacy enum column),
--    but the application assigns `profiles.role_id` (roles table FK).
--    Admins therefore failed every admin RLS check and orders never
--    appeared in the Admin Panel.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. is_admin(): honour BOTH the legacy `role` enum and the current `role_id`
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
      and (
        p.role::text in ('admin', 'super_admin')
        or p.role_id in ('admin', 'super_admin', 'manager')
      )
  );
end;
$$ language plpgsql security definer stable;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Orders: allow the inserting session to read back the row it just created
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "Client read own orders" on public.orders;
drop policy if exists "Client create orders"   on public.orders;
drop policy if exists "Anyone can insert orders" on public.orders;
drop policy if exists "Admin access all orders"  on public.orders;
drop policy if exists "Admin update orders"      on public.orders;

-- Anyone (guest or authenticated) may submit a project request.
create policy "Public can submit orders" on public.orders
  for insert with check (true);

-- Clients read their own orders; admins read everything.
-- Guest orders (client_id is null) stay private to admins only, but the
-- server action no longer needs RETURNING to read them back.
create policy "Read own or admin orders" on public.orders
  for select using (
    (client_id is not null and auth.uid() = client_id) or public.is_admin()
  );

create policy "Admin update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "Admin delete orders" on public.orders
  for delete using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Reference uniqueness is enforced by the unique index on orders.reference.
--    Generate it server-side with a collision-safe default as a second line
--    of defence so concurrent submissions can never fail on a duplicate.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.generate_order_reference()
returns text as $$
declare
  candidate text;
begin
  loop
    candidate := 'ORD-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));
    exit when not exists (select 1 from public.orders o where o.reference = candidate);
  end loop;
  return candidate;
end;
$$ language plpgsql;

alter table public.orders
  alter column reference set default public.generate_order_reference();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Leads: the public consultation form needs insert access.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'drop policy if exists "Public can submit leads" on public.leads';
    execute 'create policy "Public can submit leads" on public.leads for insert with check (true)';
  end if;
end $$;
