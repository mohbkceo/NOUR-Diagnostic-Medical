import { supabase, STORAGE_BUCKET_RESERVATIONS } from '../lib/supabase'
import { buildSafeStoragePath } from '../utils/file'

// 1. Upload the (already client-validated) document to a private, write-only
//    bucket. The anon key can INSERT here but cannot read back or list
//    objects — see supabase/migrations for the storage policies.
export async function uploadReservationDocument(file) {
  const path = buildSafeStoragePath(file)
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET_RESERVATIONS)
    .upload(path, file, { upsert: false, contentType: file.type })
  if (error) throw error
  return path
}

// 2. Hand the reservation off to the Edge Function, which independently
//    re-validates everything, verifies the Turnstile token server-side,
//    applies rate limiting, and inserts the row with the service_role key.
// The reservation is never written directly from the browser.
export async function submitReservation(payload) {
  const { data, error } = await supabase.functions.invoke('create-reservation', {
    body: payload,
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

// --- Admin-only operations (enforced by RLS via the `admins` table) -------

export async function listReservations({ status, search, from, to } = {}) {
  let query = supabase.from('reservations').select('*, service:services(name)').order('created_at', {
    ascending: false,
  })

  if (status && status !== 'all') query = query.eq('status', status)
  if (from) query = query.gte('preferred_date', from)
  if (to) query = query.lte('preferred_date', to)
  if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateReservation(id, values) {
  const { data, error } = await supabase
    .from('reservations')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getReservationDocumentUrl(path) {
  if (!path) return null
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_RESERVATIONS)
    .createSignedUrl(path, 60 * 5) // 5 minutes
  if (error) throw error
  return data.signedUrl
}
