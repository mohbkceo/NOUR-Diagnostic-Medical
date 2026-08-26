import { Section, SectionHeading, Rating, EmptyState } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderTestimonials } from '../../data/placeholders'
import { fr } from '../../content/fr'

export function TestimonialsSection() {
  const { data: testimonials } = useSupabaseData(
    contentQueries.testimonials,
    [],
    placeholderTestimonials
  )

  return (
    <Section tone="muted">
      <SectionHeading title={fr.testimonials.title} />

      {!testimonials?.length ? (
        <EmptyState title={fr.common.emptyTestimonials} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="border-l-2 border-primary pl-4">
              <Rating value={t.rating} />
              <p className="mt-2 text-ink">“{t.quote}”</p>
              <p className="mt-2 text-sm text-ink-soft">{t.patient_name}</p>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
