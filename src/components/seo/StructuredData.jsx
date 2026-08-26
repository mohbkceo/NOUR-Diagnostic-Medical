import { useEffect } from 'react'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useOpeningStatus } from '../../hooks/useOpeningStatus'
import { weekdayLabels } from '../../styles/tokens'

// Injects a MedicalClinic JSON-LD block built from live site_settings /
// opening_hours data — never hardcoded — so it can never assert facts
// (address, phone, hours) that haven't actually been set in Admin yet.
export function StructuredData() {
  const { settings } = useSiteSettings()
  const { hours } = useOpeningStatus()

  useEffect(() => {
    const openingHoursSpecification = hours
      .filter((h) => !h.is_closed && h.open_time && h.close_time)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: weekdayLabels[h.weekday],
        opens: h.open_time,
        closes: h.close_time,
      }))

    const data = {
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      name: settings.site_name,
      telephone: settings.phone || undefined,
      email: settings.email || undefined,
      address: settings.address || undefined,
      openingHoursSpecification: openingHoursSpecification.length ? openingHoursSpecification : undefined,
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    script.id = 'structured-data-medical-clinic'
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [settings, hours])

  return null
}
