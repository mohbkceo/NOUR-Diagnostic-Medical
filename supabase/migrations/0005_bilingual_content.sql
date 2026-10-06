-- Add translations alongside legacy French columns. Keep old columns for
-- existing clients and for a staged rollout.
alter table departments add column if not exists name_fr text, add column if not exists name_ar text,
  add column if not exists description_fr text, add column if not exists description_ar text;
alter table services add column if not exists name_fr text, add column if not exists name_ar text,
  add column if not exists short_description_fr text, add column if not exists short_description_ar text,
  add column if not exists preparation_info_fr text, add column if not exists preparation_info_ar text;
alter table team_members add column if not exists specialty_fr text, add column if not exists specialty_ar text,
  add column if not exists title_fr text, add column if not exists title_ar text,
  add column if not exists bio_fr text, add column if not exists bio_ar text;
alter table testimonials add column if not exists quote_fr text, add column if not exists quote_ar text;
alter table faqs add column if not exists question_fr text, add column if not exists question_ar text,
  add column if not exists answer_fr text, add column if not exists answer_ar text;
alter table patient_info add column if not exists title_fr text, add column if not exists title_ar text,
  add column if not exists content_fr text, add column if not exists content_ar text;
alter table about_content add column if not exists title_fr text, add column if not exists title_ar text,
  add column if not exists content_fr text, add column if not exists content_ar text,
  add column if not exists facts_fr jsonb, add column if not exists facts_ar jsonb;
alter table site_settings add column if not exists address_fr text, add column if not exists address_ar text;

update departments set name_fr = coalesce(name_fr, name), description_fr = coalesce(description_fr, description);
update services set name_fr = coalesce(name_fr, name), short_description_fr = coalesce(short_description_fr, short_description),
  preparation_info_fr = coalesce(preparation_info_fr, preparation_info);
update team_members set specialty_fr = coalesce(specialty_fr, specialty), title_fr = coalesce(title_fr, title),
  bio_fr = coalesce(bio_fr, bio);
update testimonials set quote_fr = coalesce(quote_fr, quote);
update faqs set question_fr = coalesce(question_fr, question), answer_fr = coalesce(answer_fr, answer);
update patient_info set title_fr = coalesce(title_fr, title), content_fr = coalesce(content_fr, content);
update about_content set title_fr = coalesce(title_fr, title), content_fr = coalesce(content_fr, content),
  facts_fr = coalesce(facts_fr, facts);
update site_settings set address_fr = coalesce(address_fr, address);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value_fr text,
  value_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;
drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content for select to anon, authenticated using (true);
drop policy if exists site_content_admin_write on public.site_content;
create policy site_content_admin_write on public.site_content for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop trigger if exists set_updated_at on public.site_content;
create trigger set_updated_at before update on public.site_content
  for each row execute function set_updated_at();
