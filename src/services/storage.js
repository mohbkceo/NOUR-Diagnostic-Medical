import { supabase } from '../lib/supabase'
import { buildSafeStoragePath } from '../utils/file'

// Public bucket for editable website content (logo, about image, service
// images, team photos). Unlike reservation-documents, this bucket is
// readable by anyone (it's public marketing content) but only admins can
// write to it — see supabase/migrations for the storage policies.
export const STORAGE_BUCKET_SITE = 'site-content'

export async function uploadSiteImage(file, folder = 'misc') {
  const path = `${folder}/${buildSafeStoragePath(file)}`
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET_SITE)
    .upload(path, file, { upsert: false, contentType: file.type })
  if (error) throw error

  const { data } = supabase.storage.from(STORAGE_BUCKET_SITE).getPublicUrl(path)
  return data.publicUrl
}
