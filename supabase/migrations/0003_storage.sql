-- Storage buckets and policies.
--
-- reservation-documents: PRIVATE. Anon/authenticated users may only INSERT
-- (upload) — never list, read, or overwrite. Only admins can read/delete.
-- site-content: PUBLIC READ (logos, about image, service/team photos —
-- ordinary marketing assets). Only admins can write.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reservation-documents',
  'reservation-documents',
  false,
  8388608, -- 8MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-content',
  'site-content',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- reservation-documents policies
create policy "reservation_documents_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'reservation-documents');

create policy "reservation_documents_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'reservation-documents' and public.is_admin());

create policy "reservation_documents_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'reservation-documents' and public.is_admin());

-- site-content policies
create policy "site_content_public_select" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'site-content');

create policy "site_content_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-content' and public.is_admin());

create policy "site_content_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-content' and public.is_admin());

create policy "site_content_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-content' and public.is_admin());
