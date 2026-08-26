-- Row Level Security. Public (anon) users get read-only access to active
-- content and NO access at all to reservations or admin data. Admins
-- (rows present in `admins`) get full read/write on content and
-- reservations. Nothing here is permissive-by-default: RLS denies
-- everything unless a policy explicitly allows it.

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

alter table admins enable row level security;
alter table site_settings enable row level security;
alter table opening_hours enable row level security;
alter table opening_hours_exceptions enable row level security;
alter table departments enable row level security;
alter table services enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table patient_info enable row level security;
alter table about_content enable row level security;
alter table reservations enable row level security;
alter table reservation_rate_limits enable row level security;
-- reservation_rate_limits: no policies at all — only the service_role
-- (which bypasses RLS) ever touches this table.

-- admins: a user may see their own membership row (used by the client to
-- know whether the logged-in account is an admin). Managing the admins
-- table itself is done from the SQL editor / service role, never the UI.
create policy "admins_select_self" on admins
  for select to authenticated
  using (id = auth.uid());

-- site_settings / about_content / opening hours: public, read-only.
create policy "site_settings_public_read" on site_settings
  for select to anon, authenticated
  using (true);

create policy "about_content_public_read" on about_content
  for select to anon, authenticated
  using (true);

create policy "opening_hours_public_read" on opening_hours
  for select to anon, authenticated
  using (true);

create policy "opening_hours_exceptions_public_read" on opening_hours_exceptions
  for select to anon, authenticated
  using (true);

-- Public content tables: anon/authenticated may read only active rows;
-- admins may read everything.
create policy "departments_public_read" on departments
  for select to anon, authenticated
  using (active = true or public.is_admin());

create policy "services_public_read" on services
  for select to anon, authenticated
  using (active = true or public.is_admin());

create policy "team_members_public_read" on team_members
  for select to anon, authenticated
  using (active = true or public.is_admin());

create policy "testimonials_public_read" on testimonials
  for select to anon, authenticated
  using (active = true or public.is_admin());

create policy "faqs_public_read" on faqs
  for select to anon, authenticated
  using (active = true or public.is_admin());

create policy "patient_info_public_read" on patient_info
  for select to anon, authenticated
  using (active = true or public.is_admin());

-- Admin-only write access on every content table.
create policy "site_settings_admin_write" on site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "about_content_admin_write" on about_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "opening_hours_admin_write" on opening_hours
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "opening_hours_exceptions_admin_write" on opening_hours_exceptions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "departments_admin_write" on departments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "services_admin_write" on services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "team_members_admin_write" on team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "testimonials_admin_write" on testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "faqs_admin_write" on faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "patient_info_admin_write" on patient_info
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Reservations: NO anon access at all (insert happens via the Edge
-- Function using the service_role key, which bypasses RLS entirely).
-- Only admins can read/update. Nobody can delete from the client.
create policy "reservations_admin_select" on reservations
  for select to authenticated
  using (public.is_admin());

create policy "reservations_admin_update" on reservations
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
