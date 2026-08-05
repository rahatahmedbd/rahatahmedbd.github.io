-- Phase 20: Contact form messages
-- Apply in Supabase SQL editor or through Supabase CLI.
--
-- Table used by the public contact form on the portfolio website.
-- Public users can INSERT only; nobody can read messages without an
-- admin role (RLS insert-only for anon/authenticated, select for admins).

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Public (anon + any authenticated user) may submit a message.
drop policy if exists "public can submit contact messages" on public.contact_messages;
create policy "public can submit contact messages" on public.contact_messages
for insert to anon, authenticated
with check (true);

-- There is intentionally NO select policy for anon: public cannot read.
-- Admins can read contact messages.
drop policy if exists "admins read contact messages" on public.contact_messages;
create policy "admins read contact messages" on public.contact_messages
for select to authenticated using (public.is_admin());

-- Admins can also update/delete (e.g. mark handled or remove spam).
drop policy if exists "admins manage contact messages" on public.contact_messages;
create policy "admins manage contact messages" on public.contact_messages
for all to authenticated using (public.is_admin()) with check (public.is_admin());
