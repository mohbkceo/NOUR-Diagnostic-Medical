-- NOUR Diagnostic Medical — core schema
-- Requires pgcrypto (gen_random_uuid), enabled by default on Supabase.

create type reservation_status as enum ('new', 'reviewing', 'confirmed', 'completed', 'cancelled');
create type service_category as enum ('imagerie', 'laboratoire', 'examens');
create type patient_info_category as enum ('preparation', 'documents', 'jeune', 'consignes');

-- Admins are ordinary Supabase Auth users additionally listed here.
-- Row insertion into this table must only ever be done from the SQL editor
-- or a trusted server context — never exposed to the client.
create table admins (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'NOUR Diagnostic Medical',
  logo_url text,
  phone text,
  email text,
  whatsapp text,
  address text,
  address_map_url text,
  facebook text,
  instagram text,
  tiktok text,
  updated_at timestamptz not null default now()
);

create table opening_hours (
  weekday smallint primary key check (weekday between 0 and 6),
  open_time time,
  close_time time,
  is_closed boolean not null default false
);

create table opening_hours_exceptions (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_closed boolean not null default true,
  open_time time,
  close_time time,
  note text
);

create table departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references departments (id) on delete set null,
  category service_category not null,
  name text not null,
  slug text not null unique,
  short_description text,
  preparation_info text,
  requires_appointment boolean not null default true,
  image_path text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  title text,
  photo_path text,
  bio text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  quote text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  active boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table patient_info (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category patient_info_category,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table about_content (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'NOUR Diagnostic Medical',
  content text,
  image_path text,
  facts jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  service_id uuid references services (id) on delete set null,
  preferred_date date not null,
  preferred_time time not null,
  message text,
  status reservation_status not null default 'new',
  document_path text,
  admin_notes text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reservations_status_idx on reservations (status);
create index reservations_created_at_idx on reservations (created_at desc);

-- Written only by the Edge Function (service_role) to back its rate
-- limiting / duplicate-submission checks. Never read or written by clients.
create table reservation_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  phone text,
  created_at timestamptz not null default now()
);

create index reservation_rate_limits_ip_idx on reservation_rate_limits (ip_hash, created_at desc);

-- Keep updated_at fresh automatically.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'departments', 'services', 'team_members',
    'testimonials', 'faqs', 'patient_info', 'about_content', 'reservations'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on %I for each row execute function set_updated_at();',
      t
    );
  end loop;
end $$;
