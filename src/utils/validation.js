// Client-side validation for the reservation form.
// IMPORTANT: this mirrors, but never replaces, the server-side checks
// performed in supabase/functions/create-reservation. An attacker can
// bypass all of this by calling the API directly, so nothing here should
// be treated as a security boundary.

export const LIMITS = {
  fullName: { min: 2, max: 80 },
  phone: { min: 8, max: 20 },
  message: { max: 500 },
  fileSizeBytes: 8 * 1024 * 1024, // 8MB
}

const PHONE_RE = /^[0-9+()\s.-]{8,20}$/

export function validateReservation(values) {
  const errors = {}

  const fullName = (values.fullName ?? '').trim()
  if (!fullName) {
    errors.fullName = 'Le nom complet est requis.'
  } else if (fullName.length < LIMITS.fullName.min || fullName.length > LIMITS.fullName.max) {
    errors.fullName = `Le nom doit contenir entre ${LIMITS.fullName.min} et ${LIMITS.fullName.max} caractères.`
  }

  const phone = (values.phone ?? '').trim()
  if (!phone) {
    errors.phone = 'Le numéro de téléphone est requis.'
  } else if (!PHONE_RE.test(phone)) {
    errors.phone = 'Numéro de téléphone invalide.'
  }

  if (!values.serviceId) {
    errors.serviceId = 'Veuillez sélectionner un service.'
  }

  if (!values.preferredDate) {
    errors.preferredDate = 'Veuillez choisir une date.'
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const chosen = new Date(values.preferredDate)
    if (chosen < today) {
      errors.preferredDate = 'La date doit être future.'
    }
  }

  if (!values.preferredTime) {
    errors.preferredTime = 'Veuillez choisir un horaire.'
  }

  if (values.message && values.message.length > LIMITS.message.max) {
    errors.message = `Le message est limité à ${LIMITS.message.max} caractères.`
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
