import { useEffect, useId, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
let scriptPromise = null

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  return scriptPromise
}

/**
 * Cloudflare Turnstile widget. Renders nothing (and calls onVerify with a
 * dev placeholder token) if no site key is configured, so local development
 * without Cloudflare set up still works — the Edge Function independently
 * rejects missing/invalid tokens server-side.
 */
export function Turnstile({ onVerify, onExpire }) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const domId = useId()

  useEffect(() => {
    if (!siteKey) return undefined
    let cancelled = false

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': onExpire,
        theme: 'light',
      })
    })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  if (!siteKey) {
    return (
      <p className="text-xs text-ink-soft">
        Vérification anti-robot désactivée (VITE_TURNSTILE_SITE_KEY absente en développement).
      </p>
    )
  }

  return <div id={domId} ref={containerRef} />
}
