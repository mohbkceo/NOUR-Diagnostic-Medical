export function getLocalizedField(record, field, locale = 'fr') {
  if (!record) return ''
  const order = locale === 'ar'
    ? [`${field}_ar`, `${field}_fr`, field]
    : [`${field}_fr`, field, `${field}_ar`]
  for (const key of order) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value
    if (Array.isArray(value) && value.length) return value
  }
  return ''
}

export function getSiteDisplayName(settings, locale, copy) {
  if (locale === 'ar') return `${copy.brand.name} ${copy.brand.tagline}`.trim()
  return settings?.site_name || `${copy.brand.name} ${copy.brand.tagline}`.trim()
}
