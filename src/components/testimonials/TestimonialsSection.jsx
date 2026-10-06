import { getLocalizedField } from '../../i18n/localizedField'
import { useLocale } from '../../i18n/LocaleProvider'
import { Section, SectionHeading, Rating, EmptyState } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderTestimonials } from '../../data/placeholders'

export function TestimonialsSection() {
  const { copy, locale } = useLocale()
  const { data: testimonials } = useSupabaseData(
    contentQueries.testimonials,
    [],
    placeholderTestimonials
  )

  return (
    <Section tone="muted">
      <SectionHeading title={copy.testimonials.title} />

      {!testimonials?.length ? (
        <EmptyState title={copy.common.emptyTestimonials} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="border-s-2 border-primary ps-4">
              <Rating value={t.rating} />
              <p className="mt-2 text-ink">“{getLocalizedField(t, 'quote', locale)}”</p>
              <p className="mt-2 text-sm text-ink-soft">{t.patient_name}</p>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
