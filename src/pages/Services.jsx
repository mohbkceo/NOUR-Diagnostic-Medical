import { getLocalizedField } from '../i18n/localizedField'
import { useLocale } from '../i18n/LocaleProvider'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Section, SectionHeading, EmptyState } from '../components/ui'
import { ServiceRow } from '../components/services/ServiceRow'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { contentQueries } from '../services/content'
import { placeholderDepartments, placeholderServices } from '../data/placeholders'

export default function Services() {
  const { copy, locale } = useLocale()
  const [searchParams] = useSearchParams()
  const activeDept = searchParams.get('dept')

  // See CategoryList: `data` is always populated (placeholder, then live),
  // so the list renders immediately rather than gating on `loading`.
  const { data: departments } = useSupabaseData(contentQueries.departments, [], placeholderDepartments)
  const { data: services } = useSupabaseData(contentQueries.services, [], placeholderServices)

  const grouped = useMemo(() => {
    const depts = departments ?? []
    const list = services ?? []
    return depts
      .filter((d) => !activeDept || d.slug === activeDept)
      .map((dept) => ({
        dept,
        items: list.filter((s) => s.department_id === dept.id),
      }))
  }, [departments, services, activeDept])

  return (
    <Section tone="white" className="min-h-[60vh]">
      <SectionHeading title={copy.services.title} intro={copy.services.intro} />

      <div className="space-y-12">
        {grouped.map(({ dept, items }) => (
          <div key={dept.id}>
            <h3 className="mb-4 text-lg font-semibold text-ink">{getLocalizedField(dept, 'name', locale)}</h3>
            {items.length ? (
              <div>
                {items.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <EmptyState title={copy.common.emptyServices} />
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
