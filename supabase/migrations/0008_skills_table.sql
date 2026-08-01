-- 0008_skills_table.sql
-- Phase 8/9 - Skills Database Table

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. skills Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- 'Frontend', 'Backend', 'Database', 'Other'
  proficiency integer not null default 80, -- percentage (0-100)
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on skills
alter table public.skills enable row level security;

-- Policies for skills: public read, admin write
create policy "Public read skills" on public.skills
  for select using (true);
create policy "Admin can manage skills" on public.skills
  for all using (public.is_admin());

-- Insert initial skills data
insert into public.skills (name, category, proficiency, sort_order) values
  ('React / Next.js', 'Frontend', 90, 1),
  ('TypeScript', 'Frontend', 85, 2),
  ('TailwindCSS', 'Frontend', 95, 3),
  ('Node.js / Express', 'Backend', 80, 4),
  ('PostgreSQL / Supabase', 'Database', 85, 5),
  ('Git & GitHub', 'Other', 90, 6)
on conflict do nothing;
