import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeading, EmptyState } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderDepartments } from '../../data/placeholders'
import { fr } from '../../content/fr'

export function CategoryList() {
  // `data` is never null — it's the placeholder content until the real
  // query settles, then the live rows. Rendering on `data` (rather than
  // gating on `loading`) means a slow/misconfigured connection never hides
  // perfectly good fallback content behind a skeleton.
  const { data: departments } = useSupabaseData(contentQueries.departments, [], placeholderDepartments)

  return (
    <Section id="services" tone="white">
      <SectionHeading title={fr.services.title} intro={fr.services.intro} />

      {!departments?.length ? (
        <EmptyState title={fr.common.emptyServices} />
      ) : (
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              to={`/services?dept=${dept.slug}`}
              className="group flex flex-col justify-between gap-6 bg-white p-7 transition-colors hover:bg-surface-muted sm:p-8"
            >
              <div>
                <h3 className="text-lg font-semibold text-ink">{dept.name}</h3>
                {dept.description ? (
                  <p className="mt-2 text-sm text-ink-soft">{dept.description}</p>
                ) : null}
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {fr.services.cta}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </Section>
  )
}
