import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Generic read hook for public content tables.
 *
 * @param {(client: typeof supabase) => PromiseLike<{data, error}>} queryFn
 * @param {any[]} deps
 * @param {any} fallback - used when Supabase isn't configured or the query fails,
 *   so the public site still renders with editable placeholder content.
 */
export function useSupabaseData(queryFn, deps = [], fallback = null) {
  const [state, setState] = useState({ data: fallback, loading: true, error: null })
  const queryRef = useRef(queryFn)
  queryRef.current = queryFn

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))

    queryRef
      .current(supabase)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) throw error
        setState({ data: data ?? fallback, loading: false, error: null })
      })
      .catch((error) => {
        if (cancelled) return
        // eslint-disable-next-line no-console
        console.warn('[useSupabaseData] falling back to placeholder content:', error?.message)
        setState({ data: fallback, loading: false, error })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
