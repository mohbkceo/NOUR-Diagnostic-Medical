import { supabase } from '../lib/supabase'

// Generic authenticated CRUD helpers for admin content management.
// RLS on every table requires the caller to be present in `admins`, so
// these calls are safe to expose to the admin UI as-is — Postgres enforces
// the actual authorization, this is just a thin convenience wrapper.
export function createCrud(table) {
  return {
    async list({ orderBy = 'order_index', ascending = true } = {}) {
      const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending })
      if (error) throw error
      return data
    },
    async create(values) {
      const { data, error } = await supabase.from(table).insert(values).select().single()
      if (error) throw error
      return data
    },
    async update(id, values) {
      const { data, error } = await supabase
        .from(table)
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    async remove(id) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
    },
  }
}

export const departmentsAdmin = createCrud('departments')
export const servicesAdmin = createCrud('services')
export const teamAdmin = createCrud('team_members')
export const testimonialsAdmin = createCrud('testimonials')
export const faqAdmin = createCrud('faqs')
export const patientInfoAdmin = createCrud('patient_info')

export async function getSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').single()
  if (error) throw error
  return data
}

export async function updateSiteSettings(values) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', values.id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAboutContent() {
  const { data, error } = await supabase.from('about_content').select('*').single()
  if (error) throw error
  return data
}

export async function updateAboutContent(values) {
  const { data, error } = await supabase
    .from('about_content')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', values.id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listOpeningHours() {
  const { data, error } = await supabase.from('opening_hours').select('*').order('weekday')
  if (error) throw error
  return data
}

export async function upsertOpeningHour(values) {
  const { data, error } = await supabase
    .from('opening_hours')
    .upsert(values, { onConflict: 'weekday' })
    .select()
    .single()
  if (error) throw error
  return data
}
