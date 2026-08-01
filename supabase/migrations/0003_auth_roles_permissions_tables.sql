-- 0003_auth_roles_permissions_tables.sql
-- Phase 3 - Secure Authentication & Role-Based Access System

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. roles Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.roles (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

-- Enable RLS on roles
alter table public.roles enable row level security;

-- Policies for roles: public/authenticated read, admin modify
create policy "Anyone can read roles" on public.roles
  for select using (true);
create policy "Admin can manage roles" on public.roles
  for all using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. permissions Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.permissions (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

-- Enable RLS on permissions
alter table public.permissions enable row level security;

-- Policies for permissions: authenticated read, admin modify
create policy "Anyone can read permissions" on public.permissions
  for select using (true);
create policy "Admin can manage permissions" on public.permissions
  for all using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. role_permissions Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.role_permissions (
  role_id text references public.roles(id) on delete cascade,
  permission_id text references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- Enable RLS on role_permissions
alter table public.role_permissions enable row level security;

-- Policies for role_permissions: authenticated read, admin modify
create policy "Anyone can read role_permissions" on public.role_permissions
  for select using (true);
create policy "Admin can manage role_permissions" on public.role_permissions
  for all using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- Populate Initial Roles and Permissions
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.roles (id, name, description) values
  ('super_admin', 'Super Admin', 'Full access to manage the entire website, users, content, orders, settings, and staff.'),
  ('admin', 'Admin', 'Administrative access to manage website, content, and orders.'),
  ('manager', 'Manager', 'Management access to track orders, clients, and view analytics.'),
  ('developer', 'Developer', 'Technical access to manage technical content and projects.'),
  ('designer', 'Designer', 'Creative access to manage design assets and portfolio items.'),
  ('content_manager', 'Content Manager', 'Editorial access to manage blog posts, FAQs, and portfolio content.'),
  ('support_agent', 'Support Agent', 'Customer support access to manage messages and testimonials.'),
  ('client', 'Client', 'Client access to track own projects, invoices, upload files, and send messages.'),
  ('visitor', 'Visitor', 'Default role for newly registered guests.')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.permissions (id, name, description) values
  ('manage:website', 'Manage Website', 'Permission to manage general website configuration.'),
  ('manage:users', 'Manage Users', 'Permission to manage all user accounts and roles.'),
  ('manage:orders', 'Manage Orders', 'Permission to manage client orders.'),
  ('manage:clients', 'Manage Clients', 'Permission to manage client records and profiles.'),
  ('manage:content', 'Manage Content', 'Permission to create and edit portfolio, blog posts, FAQs.'),
  ('manage:settings', 'Manage Settings', 'Permission to edit system settings.'),
  ('manage:analytics', 'Manage Analytics', 'Permission to view business and website analytics.'),
  ('manage:staff', 'Manage Staff', 'Permission to register or manage internal staff accounts.'),
  ('track:projects', 'Track Projects', 'Permission to track own active projects.'),
  ('view:invoices', 'View Invoices', 'Permission to view and pay invoices.'),
  ('upload:files', 'Upload Files', 'Permission to upload project files and assets.'),
  ('send:messages', 'Send Messages', 'Permission to send messages to the platform.')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description;

-- Grant permissions to Super Admin (all permissions)
insert into public.role_permissions (role_id, permission_id) values
  ('super_admin', 'manage:website'),
  ('super_admin', 'manage:users'),
  ('super_admin', 'manage:orders'),
  ('super_admin', 'manage:clients'),
  ('super_admin', 'manage:content'),
  ('super_admin', 'manage:settings'),
  ('super_admin', 'manage:analytics'),
  ('super_admin', 'manage:staff'),
  ('super_admin', 'track:projects'),
  ('super_admin', 'view:invoices'),
  ('super_admin', 'upload:files'),
  ('super_admin', 'send:messages')
on conflict do nothing;

-- Grant permissions to Client
insert into public.role_permissions (role_id, permission_id) values
  ('client', 'track:projects'),
  ('client', 'view:invoices'),
  ('client', 'upload:files'),
  ('client', 'send:messages')
on conflict do nothing;

-- Grant permissions to Manager
insert into public.role_permissions (role_id, permission_id) values
  ('manager', 'manage:orders'),
  ('manager', 'manage:clients'),
  ('manager', 'manage:content'),
  ('manager', 'manage:analytics')
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. activity_logs Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  action text not null,
  ip_address text,
  user_agent text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

-- Policies for activity_logs: users read own logs, admin full access
create policy "Users can read own activity_logs" on public.activity_logs
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Admin can manage activity_logs" on public.activity_logs
  for all using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. login_history Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  ip_address text,
  user_agent text,
  status text not null, -- 'success', 'failed'
  failure_reason text,
  created_at timestamptz not null default now()
);

alter table public.login_history enable row level security;

-- Policies for login_history: users read own login history, admin full access
create policy "Users can read own login_history" on public.login_history
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Admin can manage login_history" on public.login_history
  for all using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. session_records Table
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.session_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text,
  user_agent text,
  ip_address text,
  last_active_at timestamptz not null default now(),
  is_revoked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.session_records enable row level security;

-- Policies for session_records: users read own session records, admin full access
create policy "Users can read own session_records" on public.session_records
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Admin can manage session_records" on public.session_records
  for all using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Add role_id to public.profiles
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles add column if not exists role_id text references public.roles(id) default 'visitor';

-- Update public.is_admin() to check for role = 'admin' or role_id in ('super_admin', 'admin')
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() 
      and (role = 'admin' or role_id in ('super_admin', 'admin'))
      and is_active = true
  );
end;
$$ language plpgsql security definer;

-- Update trigger handle_new_user() to set role_id appropriately as well
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_role text;
  meta_role text;
begin
  meta_role := new.raw_user_meta_data->>'role';
  
  -- map meta_role or use default 'visitor'
  if meta_role is null then
    default_role := 'visitor';
  elsif meta_role = 'admin' or meta_role = 'super_admin' then
    -- If there are no admins/super_admins yet, allow registering the first as super_admin,
    -- else fall back to visitor to prevent public admin registration
    if not exists (select 1 from public.profiles where role_id in ('super_admin', 'admin')) then
      default_role := 'super_admin';
    else
      default_role := 'visitor';
    end if;
  else
    default_role := meta_role;
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    role_id,
    avatar_url,
    phone,
    is_active
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    case 
      when default_role in ('super_admin', 'admin') then 'admin'::public.user_role
      when default_role = 'client' then 'client'::public.user_role
      else 'visitor'::public.user_role
    end,
    default_role,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    true
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    phone = coalesce(excluded.phone, profiles.phone);
  return new;
end;
$$ language plpgsql security definer;
