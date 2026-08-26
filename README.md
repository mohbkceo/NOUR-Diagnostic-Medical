# NOUR Diagnostic Medical

Production-ready marketing site + reservation system + admin panel for NOUR
Diagnostic Medical (Imagerie médicale, Laboratoire d'analyses médicales,
Examens spécialisés). React + Vite + Tailwind, Supabase for data/auth/storage,
Cloudflare for DNS/CDN/WAF/Turnstile.

No reference brand assets (logo, real address/phone, real service catalogue)
were available when this was built, so the site ships with clearly-labeled
placeholder content everywhere real content is unknown — all of it editable
from `/admin` (see [Content management](#content-management)).

## Quick start

```bash
npm install
cp .env.example .env   # fill in your Supabase project + Turnstile key
npm run dev
npm run build           # production build → dist/
```

The site renders and is fully navigable even with `.env` unfilled — every
public section falls back to placeholder content until Supabase is
configured (see `src/data/placeholders.js`).

## Stack

- **React + Vite + Tailwind CSS**, plain JavaScript (no TypeScript, no Next.js)
- **Supabase**: Postgres, Auth, Storage, Edge Functions
- **Cloudflare**: DNS, CDN/HTTPS, WAF, Turnstile, Pages hosting
- **Lucide React** for the handful of icons actually used

## Project structure

```
src/
  components/
    layout/        Logo, Footer, AppShell (public page shell)
    navigation/     Navbar, MobileStickyCTA
    glass/          The one reusable Liquid Glass surface + nav/button/sheet
    ui/             Button, Section, Field/Input/Select, Accordion, Badge, …
    hero/, services/, departments/, about/, team/, patient-info/,
    how-it-works/, testimonials/, faq/, contact/, reservation/, seo/,
    admin/          CrudManager, AdminImageUpload, ProtectedRoute
  pages/            Home, Services, ServiceDetails, Reservation, NotFound
  pages/admin/      Login, AdminLayout, Dashboard, Reservations, Services,
                    Departments, Team, Testimonials, Faq, PatientInfo, Settings
  content/fr.js     Central French UI copy (swap/extend for future locales)
  data/placeholders.js  Fallback content shaping every table's shape
  hooks/            useAuth, useSupabaseData, useSiteSettings, useOpeningStatus, …
  services/         content.js (public reads), admin.js (CRUD), reservations.js,
                    storage.js — the only files that talk to Supabase
  lib/supabase.js   The single shared Supabase client
  styles/tokens.js  Design tokens (colors, radii, spacing, glass, timing)
supabase/
  migrations/       0001 schema, 0002 RLS, 0003 storage buckets/policies, 0004 seed
  functions/
    create-reservation/  Edge Function — the only writer of `reservations`
public/
  _headers, _redirects   Cloudflare Pages config (SPA fallback + security headers)
```

Admin code is route-based `React.lazy`-split (see `src/App.jsx`), so none of
it ships in the public homepage bundle.

## What was implemented

- Full public site: Hero, Services (3 categories → service list → service
  detail), Why NOUR, Departments strip, About, Team (with detail sheet),
  Patient information (accordion), How it works, Testimonials, FAQ, Contact,
  and the Reservation page.
- Reservation flow: client validation → file signature/size/type check →
  upload to a private bucket → Cloudflare Turnstile → Edge Function
  (server-side re-validation, Turnstile verification, rate limiting) → insert
  → admin dashboard → WhatsApp confirmation offered on success.
- Admin panel at `/admin`: dashboard with reservation counts, a full
  reservations manager (search/filter/status/notes/document view), and CRUD
  screens for Services, Departments, Team, Testimonials, FAQ, Patient info,
  and global Settings (contact info, socials, logo, opening hours, About).
- One reusable Liquid Glass surface (`glass-surface` in `src/styles/index.css`
  + `components/glass/*`), used only for the navbar, mobile sticky CTA,
  sheets/modals — never for ordinary content cards.
- Design tokens centralized in `tailwind.config.js` / `src/styles/tokens.js`.
- Accessibility: semantic sections/headings, visible focus rings,
  `prefers-reduced-motion` support, labeled form fields with inline errors.
- SEO: per-page title/meta/OG tags in `index.html`, and a `MedicalClinic`
  JSON-LD block built live from actual `site_settings`/`opening_hours` data
  (never hardcoded, so it can't assert facts that haven't been set yet).

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/` **in order** (SQL editor or `supabase db push`
   if using the CLI): `0001_schema.sql`, `0002_rls.sql`, `0003_storage.sql`, `0004_seed.sql`.
3. Create your admin user in **Authentication → Users** (email/password), then
   promote it from the SQL editor:
   ```sql
   insert into admins (id, name) values ('<user-uuid-from-auth.users>', 'Admin');
   ```
   There is deliberately no self-service "become admin" UI.
4. Deploy the Edge Function:
   ```bash
   supabase functions deploy create-reservation
   supabase secrets set \
     SUPABASE_URL=https://YOUR-PROJECT.supabase.co \
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
     TURNSTILE_SECRET_KEY=your-turnstile-secret-key
   ```
5. Fill `.env` (browser-safe values only — see `.env.example`).

### Schema summary

`site_settings`, `about_content`, `opening_hours`, `opening_hours_exceptions`,
`departments`, `services`, `team_members`, `testimonials`, `faqs`,
`patient_info`, `reservations`, `reservation_rate_limits`, `admins`. Enums:
`reservation_status` (new/reviewing/confirmed/completed/cancelled),
`service_category` (imagerie/laboratoire/examens), `patient_info_category`.

Storage buckets: `reservation-documents` (private, anon can only INSERT,
only admins can read/delete, 8MB limit, MIME-restricted at the bucket level)
and `site-content` (public read for logos/photos, admin-only write, 5MB
limit, image MIME-restricted).

### Row Level Security

RLS is enabled on every table with no permissive defaults:

- Public content tables: anonymous **read-only**, active rows only.
- `reservations`: **no anonymous access at all**, in either direction — the
  Edge Function inserts using the `service_role` key, which bypasses RLS by
  design. Admins can select/update.
- `reservation_rate_limits`: no client policies whatsoever; only the
  service role touches it.
- All writes to content tables require `is_admin()` (a row in `admins`).

## Environment variables

See `.env.example`. Browser-safe (`VITE_*`): `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY`. Edge Function only
(`supabase secrets set`, never `VITE_`-prefixed, never shipped to the
browser): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`.

## Cloudflare configuration

1. Point DNS for the domain at Cloudflare (orange-clouded / proxied) and
   enforce HTTPS (Always Use HTTPS + HSTS in SSL/TLS settings).
2. Deploy the built `dist/` to **Cloudflare Pages** (or any static host behind
   Cloudflare) — `public/_redirects` handles SPA routing and `public/_headers`
   sets security headers + long-lived asset caching.
3. Turnstile: create a widget in the Cloudflare dashboard, put the **site
   key** in `VITE_TURNSTILE_SITE_KEY` and the **secret key** in the Edge
   Function's `TURNSTILE_SECRET_KEY` secret.
4. WAF / rate limiting: add a rate-limiting rule on the reservation submission
   path (and generally on `/rest/v1/*` and the Edge Function URL if you proxy
   Supabase through your own domain) as a second layer on top of the
   Edge Function's own IP/phone rate limiting.
5. Consider Bot Fight Mode / Super Bot Fight Mode for additional abuse
   protection on the reservation endpoint.

## Content management

Everything the brief lists as admin-editable is: global settings (logo,
name, phone, email, WhatsApp, address, socials, opening hours), services,
departments, team, testimonials, FAQ, patient info, and the About section —
all under `/admin`. Reservations are managed from `/admin/reservations`
(search, filter, status changes, notes, document viewing via short-lived
signed URLs, and WhatsApp/call shortcuts).

## Remaining setup steps before going live

- Replace all placeholder content (address, phone, WhatsApp, logo, service
  catalogue, team, opening hours) via `/admin` or by editing the seed SQL.
- Add a real `/og-cover.png` (1200×630) and re-add the `og:image` tag in
  `index.html` once one exists.
- Create the first admin user and run the `insert into admins …` step above.
- Set real Turnstile keys and Supabase Edge Function secrets.
- Review the CSP in `public/_headers` if you add any new third-party script
  or API host.

## Security considerations still requiring production configuration

- The Edge Function's rate limits (5 requests / 10 min per IP, 3 per phone)
  are conservative defaults — tune to real traffic.
- Cloudflare WAF/rate-limiting rules are a dashboard configuration step, not
  something committed in this repo — set them up on the live zone.
- Rotate the Supabase `service_role` key if it is ever exposed, and confirm
  it is only ever set via `supabase secrets set`, never in a `VITE_`-prefixed
  variable or client bundle.
- The reservation document bucket is private by design; periodically review
  storage policies after any Supabase dashboard changes to make sure no
  public-read policy was added by mistake.
# NOUR-Diagnostic-Medical
