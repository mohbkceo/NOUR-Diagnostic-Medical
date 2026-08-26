import { Link } from 'react-router-dom'
import { Section, SectionHeading } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderDepartments } from '../../data/placeholders'
import { fr } from '../../content/fr'

// Minimal navigational strip distinct from the Services section — plain
// labels only, no descriptions or cards, so it reads as structure rather
// than a duplicate of the services grid above it.
export function DepartmentsStrip() {
  const { data: departments } = useSupabaseData(contentQueries.departments, [], placeholderDepartments)

  return (
    <Section tone="white" className="!py-10 sm:!py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionHeading title={fr.departments.title} className="mb-0" />
        <div className="flex flex-wrap gap-x-6 gap-y-2 pb-2">
          {(departments ?? []).map((dept, i) => (
            <span key={dept.id} className="flex items-center gap-6">
              <Link to={`/services?dept=${dept.slug}`} className="text-sm font-medium text-ink-soft hover:text-primary">
                {dept.name}
              </Link>
              {i < departments.length - 1 ? <span className="hidden h-4 w-px bg-line sm:block" /> : null}
            </span>
          ))}
        </div>
      </div>
    </Section>
  )
}
