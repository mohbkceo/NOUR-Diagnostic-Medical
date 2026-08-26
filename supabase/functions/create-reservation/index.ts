// Supabase Edge Function: create-reservation
//
// This is the ONLY code path allowed to insert into `reservations`. The
// browser never writes that table directly (see supabase/migrations —
// there is no anon insert policy on it at all). Responsibilities here:
//   1. Re-validate every field server-side (never trust the client).
//   2. Verify the Cloudflare Turnstile token with Cloudflare's siteverify.
//   3. Apply IP + phone based rate limiting / duplicate-submission checks.
//   4. Insert the reservation using the service_role key.
//
// Deploy with:
//   supabase functions deploy create-reservation
// Configure secrets with:
//   supabase secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... TURNSTILE_SECRET_KEY=...

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const LIMITS = {
  fullName: { min: 2, max: 80 },
  phone: { min: 8, max: 20 },
  message: { max: 500 },
}
const PHONE_RE = /^[0-9+()\s.-]{8,20}$/
// Matches the paths produced by src/utils/file.js#buildSafeStoragePath —
// nothing else is accepted, so no path traversal / arbitrary object
// reference can be smuggled through this field.
const SAFE_PATH_RE = /^\d{4}-\d{2}-\d{2}\/[a-zA-Z0-9-]{8,80}\.[a-zA-Z0-9]{2,5}$/

const RATE_LIMIT_WINDOW_MINUTES = 10
const RATE_LIMIT_MAX_PER_IP = 5
const RATE_LIMIT_MAX_PER_PHONE = 3

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...CORS_HEADERS },
  })
}

async function hashIp(ip) {
  const data = new TextEncoder().encode(ip)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function validate(payload) {
  const errors = []

  const fullName = String(payload.fullName ?? '').trim()
  if (fullName.length < LIMITS.fullName.min || fullName.length > LIMITS.fullName.max) {
    errors.push('fullName')
  }

  const phone = String(payload.phone ?? '').trim()
  if (!PHONE_RE.test(phone)) errors.push('phone')

  if (!payload.serviceId || typeof payload.serviceId !== 'string') errors.push('serviceId')

  const preferredDate = String(payload.preferredDate ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) errors.push('preferredDate')
  else {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    if (new Date(`${preferredDate}T00:00:00Z`) < today) errors.push('preferredDate')
  }

  const preferredTime = String(payload.preferredTime ?? '')
  if (!/^\d{2}:\d{2}$/.test(preferredTime)) errors.push('preferredTime')

  if (payload.message && String(payload.message).length > LIMITS.message.max) errors.push('message')

  if (payload.documentPath && !SAFE_PATH_RE.test(String(payload.documentPath))) {
    errors.push('documentPath')
  }

  return { errors, fullName, phone, preferredDate, preferredTime }
}

async function verifyTurnstile(token, remoteIp) {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!secret) {
    // Not configured (local/dev) — allow through so local testing works;
    // production deployments MUST set this secret.
    console.warn('[create-reservation] TURNSTILE_SECRET_KEY not set — skipping verification')
    return true
  }
  if (!token) return false

  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (remoteIp) form.append('remoteip', remoteIp)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const data = await res.json()
  return Boolean(data.success)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'Corps de requête invalide.' }, 400)
  }

  const { errors, fullName, phone, preferredDate, preferredTime } = validate(payload)
  if (errors.length) {
    return jsonResponse({ error: `Champs invalides: ${errors.join(', ')}` }, 400)
  }

  const remoteIp =
    req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ipHash = await hashIp(remoteIp)

  const verified = await verifyTurnstile(payload.turnstileToken, remoteIp)
  if (!verified) {
    return jsonResponse({ error: 'Vérification de sécurité échouée. Veuillez réessayer.' }, 400)
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } }
  )

  // Rate limiting — by IP and by phone number, over a sliding window.
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString()

  const { count: ipCount } = await supabaseAdmin
    .from('reservation_rate_limits')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart)

  if ((ipCount ?? 0) >= RATE_LIMIT_MAX_PER_IP) {
    return jsonResponse({ error: 'Trop de demandes. Veuillez réessayer plus tard.' }, 429)
  }

  const { count: phoneCount } = await supabaseAdmin
    .from('reservation_rate_limits')
    .select('id', { count: 'exact', head: true })
    .eq('phone', phone)
    .gte('created_at', windowStart)

  if ((phoneCount ?? 0) >= RATE_LIMIT_MAX_PER_PHONE) {
    return jsonResponse({ error: 'Une demande a déjà été soumise récemment pour ce numéro.' }, 429)
  }

  // Confirm the referenced service actually exists and is active.
  const { data: service } = await supabaseAdmin
    .from('services')
    .select('id')
    .eq('id', payload.serviceId)
    .eq('active', true)
    .maybeSingle()

  if (!service) {
    return jsonResponse({ error: 'Service invalide.' }, 400)
  }

  const { data: reservation, error: insertError } = await supabaseAdmin
    .from('reservations')
    .insert({
      full_name: fullName,
      phone,
      service_id: payload.serviceId,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      message: payload.message ? String(payload.message).slice(0, 500) : null,
      document_path: payload.documentPath ?? null,
      ip_hash: ipHash,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('[create-reservation] insert failed', insertError)
    return jsonResponse({ error: 'Une erreur est survenue. Veuillez réessayer.' }, 500)
  }

  await supabaseAdmin.from('reservation_rate_limits').insert({ ip_hash: ipHash, phone })

  return jsonResponse({ id: reservation.id })
})
