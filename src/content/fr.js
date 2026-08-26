// Central UI copy. Components import from here instead of hardcoding
// strings, so a future locale (e.g. `ar.js`) can be dropped in and switched
// via a LocaleProvider without touching component code.
export const fr = {
  brand: {
    name: 'NOUR',
    tagline: 'Diagnostic Medical',
  },
  nav: {
    services: 'Services',
    about: 'À propos',
    team: 'Équipe',
    faq: 'FAQ',
    contact: 'Contact',
    cta: 'Prendre rendez-vous',
  },
  hero: {
    eyebrow: 'Centre de diagnostic médical',
    lines: ['Imagerie médicale', 'Analyses médicales', 'Examens spécialisés'],
    cta: 'Prendre rendez-vous',
    ctaSecondary: 'WhatsApp',
  },
  services: {
    title: 'Nos services',
    intro: 'Trois pôles de diagnostic, réunis en un seul centre.',
    cta: 'Découvrir',
    categories: {
      imagerie: "Imagerie médicale",
      laboratoire: "Laboratoire d'analyses médicales",
      examens: 'Examens spécialisés',
    },
  },
  whyNour: {
    title: 'Pourquoi NOUR',
    points: [
      { title: 'Expertise', text: 'Une équipe qualifiée et expérimentée.' },
      { title: 'Prise en charge', text: 'Un accueil attentif à chaque étape.' },
      { title: 'Diagnostic', text: 'Des équipements fiables et précis.' },
      { title: 'Proximité', text: 'Un centre accessible et à l’écoute.' },
    ],
  },
  departments: {
    title: 'Nos départements',
    intro: 'La structure médicale de NOUR, en un coup d’œil.',
  },
  about: {
    title: 'À propos de NOUR',
  },
  team: {
    title: 'Notre équipe médicale',
    intro: 'Des praticiens dédiés à votre diagnostic.',
  },
  patientInfo: {
    title: 'Informations patients',
    intro: 'Ce qu’il faut savoir avant votre venue.',
    categories: {
      preparation: 'Préparation',
      documents: 'Documents',
      jeune: 'Jeûne',
      consignes: 'Consignes',
    },
  },
  howItWorks: {
    title: 'Comment ça marche',
    steps: [
      { number: '01', title: 'Demande', text: 'Vous soumettez votre demande de rendez-vous.' },
      { number: '02', title: 'Confirmation', text: 'Notre équipe confirme la disponibilité.' },
      { number: '03', title: 'Rendez-vous', text: 'Vous vous présentez à l’heure convenue.' },
      { number: '04', title: 'Consultation', text: 'Votre examen ou analyse est réalisé.' },
    ],
  },
  testimonials: {
    title: 'Ce qu’en disent nos patients',
  },
  faq: {
    title: 'Questions fréquentes',
  },
  reservation: {
    title: 'Prendre rendez-vous',
    intro:
      'Ce formulaire est destiné aux demandes de rendez-vous et démarches administratives. Il ne doit pas être utilisé en cas d’urgence médicale.',
    fields: {
      fullName: 'Nom complet',
      phone: 'Téléphone',
      service: 'Service',
      preferredDate: 'Date souhaitée',
      preferredTime: 'Horaire souhaité',
      document: 'Document / image (optionnel)',
      message: 'Message (optionnel)',
    },
    submit: 'Envoyer la demande',
    submitting: 'Envoi en cours…',
    success: {
      title: 'Demande envoyée',
      text: 'Votre demande a bien été enregistrée. Notre équipe vous contactera pour la confirmer.',
      whatsapp: 'Confirmer aussi par WhatsApp',
    },
  },
  contact: {
    title: 'Nous contacter',
    address: 'Adresse',
    phone: 'Téléphone',
    hours: 'Horaires',
    directions: 'Itinéraire',
  },
  footer: {
    rights: 'Tous droits réservés.',
  },
  common: {
    open: 'Ouvert',
    closed: 'Fermé',
    loading: 'Chargement…',
    emptyServices: 'Aucun service pour le moment.',
    emptyTestimonials: 'Aucun témoignage pour le moment.',
    emptyFaq: 'Aucune question pour le moment.',
    emptyTeam: 'Aucun membre à afficher pour le moment.',
  },
}
