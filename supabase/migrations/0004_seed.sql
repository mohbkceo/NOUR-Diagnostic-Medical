-- Placeholder content so the site is fully populated immediately after
-- setup. Every value here is editable from /admin — replace with real
-- NOUR content whenever it becomes available.

insert into site_settings (site_name, phone, email, whatsapp, address, address_map_url)
values (
  'NOUR Diagnostic Medical',
  '+213 000 00 00 00',
  'contact@nour-diagnostic.example',
  '+213000000000',
  'Adresse à renseigner — Admin > Paramètres',
  ''
);

insert into opening_hours (weekday, open_time, close_time, is_closed) values
  (0, null, null, true),
  (1, '08:00', '17:00', false),
  (2, '08:00', '17:00', false),
  (3, '08:00', '17:00', false),
  (4, '08:00', '17:00', false),
  (5, '08:00', '12:00', false),
  (6, '08:00', '17:00', false);

insert into about_content (title, content, facts)
values (
  'NOUR Diagnostic Medical',
  'NOUR réunit imagerie médicale, laboratoire d''analyses et examens spécialisés au sein d''un même centre, pour un parcours de diagnostic clair et coordonné.',
  '[]'::jsonb
);

with dept as (
  insert into departments (name, slug, description, order_index) values
    ('Imagerie médicale', 'imagerie', 'Examens diagnostiques par imagerie, adaptés à chaque besoin.', 1),
    ('Laboratoire d''analyses médicales', 'laboratoire', 'Analyses biologiques réalisées avec rigueur et précision.', 2),
    ('Examens spécialisés', 'examens', 'Explorations médicales spécialisées sur rendez-vous.', 3)
  returning id, slug
)
insert into services (department_id, category, name, slug, short_description, preparation_info, requires_appointment, order_index)
select d.id, 'imagerie', 'Radiologie', 'radiologie', 'Examens radiologiques standards.', 'Aucune préparation particulière, sauf indication contraire.', true, 1
from dept d where d.slug = 'imagerie'
union all
select d.id, 'imagerie', 'Échographie', 'echographie', 'Examens échographiques diagnostiques.', 'Préparation variable selon la zone examinée.', true, 2
from dept d where d.slug = 'imagerie'
union all
select d.id, 'laboratoire', 'Analyses biologiques', 'analyses-biologiques', 'Bilan sanguin et analyses courantes.', 'À jeun recommandé pour certaines analyses.', false, 1
from dept d where d.slug = 'laboratoire'
union all
select d.id, 'examens', 'Explorations spécialisées', 'explorations-specialisees', 'Examens spécialisés sur prescription.', 'Se munir de la prescription médicale.', true, 1
from dept d where d.slug = 'examens';

insert into team_members (name, specialty, title, order_index) values
  ('Dr. Nom Prénom', 'Radiologie', 'Médecin radiologue', 1),
  ('Dr. Nom Prénom', 'Biologie médicale', 'Médecin biologiste', 2);

insert into testimonials (patient_name, quote, rating, order_index) values
  ('S. M.', 'Accueil rapide et personnel attentif.', 5, 1),
  ('A. K.', 'Résultats reçus rapidement, très professionnel.', 5, 2);

insert into faqs (question, answer, category, order_index) values
  (
    'Faut-il un rendez-vous pour une analyse ?',
    'Certaines analyses sont réalisées sans rendez-vous, d''autres nécessitent une prise de rendez-vous. La page du service précise si un rendez-vous est requis.',
    'general',
    1
  ),
  (
    'Quels documents dois-je apporter ?',
    'Munissez-vous de votre prescription médicale, d''une pièce d''identité et de vos éventuels examens antérieurs.',
    'general',
    2
  );

insert into patient_info (title, content, category, order_index) values
  ('Se munir de sa prescription', 'Présentez la prescription de votre médecin lors de votre passage.', 'documents', 1),
  ('Jeûne recommandé', 'Certaines analyses nécessitent d''être à jeun depuis 8 à 12 heures.', 'jeune', 1);
