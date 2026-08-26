import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Section, SectionHeading, EmptyState } from '../components/ui'
import { ServiceRow } from '../components/services/ServiceRow'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { contentQueries } from '../services/content'
import { placeholderDepartments, placeholderServices } from '../data/placeholders'
import { fr } from '../content/fr'

export default function Services() {
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
      <SectionHeading title={fr.services.title} intro={fr.services.intro} />

      <div className="space-y-12">
        {grouped.map(({ dept, items }) => (
          <div key={dept.id}>
            <h3 className="mb-4 text-lg font-semibold text-ink">{dept.name}</h3>
            {items.length ? (
              <div>
                {items.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <EmptyState title={fr.common.emptyServices} />
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
