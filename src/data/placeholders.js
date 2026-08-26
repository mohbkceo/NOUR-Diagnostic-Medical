// Fallback content shown when Supabase isn't configured yet, or a query
// fails. Shapes mirror the Supabase tables exactly (see
// supabase/migrations) so swapping in real data later requires no
// component changes. Every field here is editable from /admin.

export const placeholderSiteSettings = {
  site_name: 'NOUR Diagnostic Medical',
  logo_url: null,
  phone: '+213 000 00 00 00',
  email: 'contact@nour-diagnostic.example',
  whatsapp: '+213000000000',
  address: 'Adresse à renseigner — Admin > Paramètres',
  address_map_url: '',
  facebook: '',
  instagram: '',
  tiktok: '',
}

export const placeholderOpeningHours = [
  { weekday: 0, open_time: null, close_time: null, is_closed: true },
  { weekday: 1, open_time: '08:00', close_time: '17:00', is_closed: false },
  { weekday: 2, open_time: '08:00', close_time: '17:00', is_closed: false },
  { weekday: 3, open_time: '08:00', close_time: '17:00', is_closed: false },
  { weekday: 4, open_time: '08:00', close_time: '17:00', is_closed: false },
  { weekday: 5, open_time: '08:00', close_time: '12:00', is_closed: false },
  { weekday: 6, open_time: '08:00', close_time: '17:00', is_closed: false },
]

export const placeholderDepartments = [
  {
    id: 'dept-imagerie',
    name: 'Imagerie médicale',
    slug: 'imagerie',
    description: 'Examens diagnostiques par imagerie, adaptés à chaque besoin.',
    order_index: 1,
    active: true,
  },
  {
    id: 'dept-laboratoire',
    name: "Laboratoire d'analyses médicales",
    slug: 'laboratoire',
    description: 'Analyses biologiques réalisées avec rigueur et précision.',
    order_index: 2,
    active: true,
  },
  {
    id: 'dept-examens',
    name: 'Examens spécialisés',
    slug: 'examens',
    description: 'Explorations médicales spécialisées sur rendez-vous.',
    order_index: 3,
    active: true,
  },
]

export const placeholderServices = [
  {
    id: 'srv-1',
    department_id: 'dept-imagerie',
    category: 'imagerie',
    name: 'Radiologie',
    slug: 'radiologie',
    short_description: 'Examens radiologiques standards.',
    preparation_info: 'Aucune préparation particulière, sauf indication contraire.',
    requires_appointment: true,
    image_path: null,
    order_index: 1,
    active: true,
  },
  {
    id: 'srv-2',
    department_id: 'dept-imagerie',
    category: 'imagerie',
    name: 'Échographie',
    slug: 'echographie',
    short_description: 'Examens échographiques diagnostiques.',
    preparation_info: 'Préparation variable selon la zone examinée.',
    requires_appointment: true,
    image_path: null,
    order_index: 2,
    active: true,
  },
  {
    id: 'srv-3',
    department_id: 'dept-laboratoire',
    category: 'laboratoire',
    name: 'Analyses biologiques',
    slug: 'analyses-biologiques',
    short_description: 'Bilan sanguin et analyses courantes.',
    preparation_info: 'À jeun recommandé pour certaines analyses.',
    requires_appointment: false,
    image_path: null,
    order_index: 1,
    active: true,
  },
  {
    id: 'srv-4',
    department_id: 'dept-examens',
    category: 'examens',
    name: 'Explorations spécialisées',
    slug: 'explorations-specialisees',
    short_description: 'Examens spécialisés sur prescription.',
    preparation_info: 'Se munir de la prescription médicale.',
    requires_appointment: true,
    image_path: null,
    order_index: 1,
    active: true,
  },
]

export const placeholderTeam = [
  {
    id: 'team-1',
    name: 'Dr. Nom Prénom',
    specialty: 'Radiologie',
    title: 'Médecin radiologue',
    photo_path: null,
    bio: '',
    order_index: 1,
    active: true,
  },
  {
    id: 'team-2',
    name: 'Dr. Nom Prénom',
    specialty: 'Biologie médicale',
    title: 'Médecin biologiste',
    photo_path: null,
    bio: '',
    order_index: 2,
    active: true,
  },
]

export const placeholderTestimonials = [
  {
    id: 'tst-1',
    patient_name: 'S. M.',
    rating: 5,
    quote: 'Accueil rapide et personnel attentif.',
    active: true,
    order_index: 1,
  },
  {
    id: 'tst-2',
    patient_name: 'A. K.',
    rating: 5,
    quote: 'Résultats reçus rapidement, très professionnel.',
    active: true,
    order_index: 2,
  },
]

export const placeholderFaqs = [
  {
    id: 'faq-1',
    question: 'Faut-il un rendez-vous pour une analyse ?',
    answer:
      'Certaines analyses sont réalisées sans rendez-vous, d’autres nécessitent une prise de rendez-vous. La page du service précise si un rendez-vous est requis.',
    category: 'general',
    order_index: 1,
    active: true,
  },
  {
    id: 'faq-2',
    question: 'Quels documents dois-je apporter ?',
    answer:
      'Munissez-vous de votre prescription médicale, d’une pièce d’identité et de vos éventuels examens antérieurs.',
    category: 'general',
    order_index: 2,
    active: true,
  },
]

export const placeholderPatientInfo = [
  {
    id: 'pi-1',
    title: 'Se munir de sa prescription',
    content: 'Présentez la prescription de votre médecin lors de votre passage.',
    category: 'documents',
    order_index: 1,
    active: true,
  },
  {
    id: 'pi-2',
    title: 'Jeûne recommandé',
    content: 'Certaines analyses nécessitent d’être à jeun depuis 8 à 12 heures.',
    category: 'jeune',
    order_index: 1,
    active: true,
  },
]

export const placeholderAbout = {
  title: 'NOUR Diagnostic Medical',
  content:
    'NOUR réunit imagerie médicale, laboratoire d’analyses et examens spécialisés au sein d’un même centre, pour un parcours de diagnostic clair et coordonné.',
  image_path: null,
  facts: [],
}
