// Lightweight client-side heuristics only. Real rate limiting and duplicate
// detection happen server-side in the Edge Function (see
// supabase/functions/create-reservation) — this just gives the user
// immediate feedback and discourages accidental double-submits.

const STORAGE_KEY = 'nour_last_reservation_submit'
const COOLDOWN_MS = 60_000

export function getSubmitCooldownRemaining() {
  try {
    const last = Number(localStorage.getItem(STORAGE_KEY) ?? 0)
    const elapsed = Date.now() - last
    return elapsed >= COOLDOWN_MS ? 0 : COOLDOWN_MS - elapsed
  } catch {
    return 0
  }
}

export function markSubmitted() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // ignore storage errors (private browsing, etc.)
  }
}
