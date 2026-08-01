-- 0002_storage_buckets.sql
-- Core Phase 2 Storage Buckets (Source of Record)

insert into storage.buckets (id, name, public)
values
  ('client-documents', 'client-documents', false),
  ('project-files', 'project-files', false),
  ('attachments', 'attachments', false),
  ('logos', 'logos', true)
on conflict (id) do update set
  public = excluded.public;

-- Logos: public read access
create policy "Public read logos"
  on storage.objects for select
  using (bucket_id = 'logos');

-- Admin full access to all storage objects
create policy "Admin access storage"
  on storage.objects for all
  using (public.is_admin());
