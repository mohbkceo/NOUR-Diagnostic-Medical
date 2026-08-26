import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env and fill in your project credentials. ' +
      'Falling back to placeholder content until then.'
  )
}

// createClient throws synchronously on an empty/invalid URL, which would
// crash the whole app at import time on a fresh clone with no .env yet.
// A syntactically valid but unresolvable placeholder lets the app boot;
// every query then fails fast and every component falls back to its
// placeholder content (see useSupabaseData).
const SAFE_FALLBACK_URL = 'https://placeholder.supabase.co'
const SAFE_FALLBACK_KEY = 'placeholder-anon-key'

// A single shared Supabase client for the whole app. Never instantiate
// another client, and never import the service_role key here — that key
// only ever lives in the Edge Function environment.
export const supabase = createClient(supabaseUrl || SAFE_FALLBACK_URL, supabaseAnonKey || SAFE_FALLBACK_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const STORAGE_BUCKET_RESERVATIONS = 'reservation-documents'
