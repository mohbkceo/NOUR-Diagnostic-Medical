// Read-only queries for public content. Every function takes the shared
// supabase client (so it can be used directly with useSupabaseData) and
// only ever selects rows that RLS already scopes to "active" / public data.

export const contentQueries = {
  siteSettings: (client) => client.from('site_settings').select('*').single(),

  openingHours: (client) => client.from('opening_hours').select('*').order('weekday'),

  openingHoursExceptions: (client) =>
    client
      .from('opening_hours_exceptions')
      .select('*')
      .gte('date', new Date().toISOString().slice(0, 10)),

  departments: (client) =>
    client.from('departments').select('*').eq('active', true).order('order_index'),

  services: (client) =>
    client.from('services').select('*').eq('active', true).order('order_index'),

  serviceBySlug: (client, slug) =>
    client.from('services').select('*').eq('slug', slug).eq('active', true).single(),

  team: (client) =>
    client.from('team_members').select('*').eq('active', true).order('order_index'),

  testimonials: (client) =>
    client.from('testimonials').select('*').eq('active', true).order('order_index'),

  faqs: (client) => client.from('faqs').select('*').eq('active', true).order('order_index'),

  patientInfo: (client) =>
    client.from('patient_info').select('*').eq('active', true).order('order_index'),

  about: (client) => client.from('about_content').select('*').single(),
}
