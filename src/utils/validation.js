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

export function validateReservation(values, messages) {
  const errors = {}

  const fullName = (values.fullName ?? '').trim()
  if (!fullName) {
    errors.fullName = messages.fullNameRequired
  } else if (fullName.length < LIMITS.fullName.min || fullName.length > LIMITS.fullName.max) {
    errors.fullName = messages.fullNameLength
  }

  const phone = (values.phone ?? '').trim()
  if (!phone) {
    errors.phone = messages.phoneRequired
  } else if (!PHONE_RE.test(phone)) {
    errors.phone = messages.phoneInvalid
  }

  if (!values.serviceId) {
    errors.serviceId = messages.serviceRequired
  }

  if (!values.preferredDate) {
    errors.preferredDate = messages.dateRequired
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const chosen = new Date(values.preferredDate)
    if (chosen < today) {
      errors.preferredDate = messages.dateFuture
    }
  }

  if (!values.preferredTime) {
    errors.preferredTime = messages.timeRequired
  }

  if (values.message && values.message.length > LIMITS.message.max) {
    errors.message = messages.messageLength
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
