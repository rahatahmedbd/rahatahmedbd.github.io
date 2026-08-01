-- 0004_services_and_skills_tables.sql
-- Phase 4 - Services and Skills Database Tables

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. services Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_bn text not null,
  description_en text,
  description_bn text,
  icon text default 'Sparkles',
  sort_order integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on services
alter table public.services enable row level security;

-- Policies for services: public read, admin write
create policy "Public read enabled services" on public.services
  for select using (is_enabled = true or public.is_admin());
create policy "Admin can manage services" on public.services
  for all using (public.is_admin());

-- Insert initial services data
insert into public.services (title_en, title_bn, description_en, description_bn, icon, sort_order, is_enabled) values
  ('Web Development', 'ওয়েব ডেভেলপমেন্ট', 'Premium, secure and modern full-stack web application development services.', 'উন্নত, নিরাপদ এবং আধুনিক ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট সেবা।', 'Code', 1, true),
  ('Home Tutoring', 'গৃহ শিক্ষকতা', 'Experienced tutoring in science and computer subjects for school and college students.', 'বিজ্ঞান এবং কম্পিউটার বিষয়ে স্কুল ও কলেজ শিক্ষার্থীদের জন্য অভিজ্ঞ গৃহ শিক্ষকতা।', 'GraduationCap', 2, true),
  ('Blood SBS Volunteer', 'রক্তদান ও সামাজিক কাজ', 'Active blood donation leader and volunteer in Sunamganj Shantichakra Blood Society.', 'সুনামগঞ্জ শান্তিশতক ব্লাড সোসাইটিতে সক্রিয় রক্তদান লিডার ও সমাজসেবামূলক কর্মকাণ্ড।', 'Heart', 3, true)
on conflict do nothing;
