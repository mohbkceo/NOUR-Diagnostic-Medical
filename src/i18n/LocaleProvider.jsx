import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fr } from '../content/fr'
import { ar } from '../content/ar'
import { supabase } from '../lib/supabase'
import { contentQueries } from '../services/content'

const translations = { fr, ar }
const LocaleContext = createContext(null)
const valid = (value) => value === 'fr' || value === 'ar'

function initialLocale() {
  try {
    const saved = localStorage.getItem('nour_locale')
    if (valid(saved)) return saved
  } catch { /* private browsing */ }
  const browser = typeof navigator !== 'undefined' ? navigator.language?.split('-')[0]?.toLowerCase() : ''
  return valid(browser) ? browser : 'fr'
}

function fallbackValue(locale, key) {
  const parts = key.split('.')
  const read = (dictionary) => parts.reduce((value, part) => value?.[part], dictionary)
  return read(translations[locale]) ?? read(fr) ?? ''
}

function buildCopy(value, locale, content, path = '') {
  if (typeof value === 'string') {
    const override = content[path]?.[`value_${locale}`]
    return typeof override === 'string' && override.trim() ? override : value
  }
  if (Array.isArray(value)) return value.map((item, index) => buildCopy(item, locale, content, `${path}.${index}`))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) =>
      [key, buildCopy(item, locale, content, path ? `${path}.${key}` : key)]))
  }
  return value
}

export function LocaleProvider({ children }) {
  const [locale, setCurrentLocale] = useState(initialLocale)
  const [content, setContent] = useState({})

  const setLocale = useCallback((next) => {
    if (valid(next)) setCurrentLocale(next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem('nour_locale', locale) } catch { /* private browsing */ }
    return () => {
      document.documentElement.lang = 'fr'
      document.documentElement.dir = 'ltr'
    }
  }, [locale])

  useEffect(() => {
    let cancelled = false
    contentQueries.siteContent(supabase).then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        if (import.meta.env.DEV) console.warn('[site_content] using local translations:', error.message)
        return
      }
      setContent(Object.fromEntries((data ?? []).map((row) => [row.key, row])))
    }).catch((error) => {
      if (!cancelled && import.meta.env.DEV) console.warn('[site_content] using local translations:', error)
    })
    return () => { cancelled = true }
  }, [])

  const t = useCallback((key) => {
    const value = content[key]?.[`value_${locale}`]
    return typeof value === 'string' && value.trim() ? value : fallbackValue(locale, key)
  }, [content, locale])

  const copy = useMemo(() => buildCopy(translations[locale], locale, content), [locale, content])
  useEffect(() => {
    const previousTitle = document.title
    document.title = copy.seo.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')
    if (description) description.setAttribute('content', copy.seo.description)
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const previousOgTitle = ogTitle?.getAttribute('content')
    if (ogTitle) ogTitle.setAttribute('content', copy.seo.title)
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const previousOgDescription = ogDescription?.getAttribute('content')
    if (ogDescription) ogDescription.setAttribute('content', copy.seo.description)
    return () => {
      document.title = previousTitle
      if (description && previousDescription !== null) description.setAttribute('content', previousDescription)
      if (ogTitle && previousOgTitle !== null) ogTitle.setAttribute('content', previousOgTitle)
      if (ogDescription && previousOgDescription !== null) ogDescription.setAttribute('content', previousOgDescription)
    }
  }, [copy])
  const context = useMemo(() => ({ locale, setLocale, direction: locale === 'ar' ? 'rtl' : 'ltr', isRTL: locale === 'ar', t, copy }), [locale, setLocale, t, copy])
  return <LocaleContext.Provider value={context}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
