import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Calendar, ChevronLeft } from 'lucide-react'
import { Section, Button, Badge, Skeleton } from '../components/ui'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { contentQueries } from '../services/content'
import { placeholderServices } from '../data/placeholders'
import { useLocale } from '../i18n/LocaleProvider'
import { getLocalizedField } from '../i18n/localizedField'

export default function ServiceDetails() {
  const { copy, locale, isRTL } = useLocale()
  const { slug } = useParams()
  const fallback = placeholderServices.find((s) => s.slug === slug) ?? null

  const { data: service, loading } = useSupabaseData(
    (client) => contentQueries.serviceBySlug(client, slug),
    [slug],
    fallback
  )

  if (loading) {
    return (
      <Section tone="white" className="min-h-[60vh]">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-4 h-4 w-2/3" />
      </Section>
    )
  }

  if (!service) {
    return (
      <Section tone="white" className="min-h-[60vh]">
        <p className="text-ink-soft">{copy.common.serviceNotFound}</p>
        <Link to="/services" className="mt-4 inline-flex items-center gap-1 text-primary">
          <ChevronLeft size={16} className={isRTL ? 'rotate-180' : ''} /> {copy.common.backToServices}
        </Link>
      </Section>
    )
  }

  return (
    <Section tone="white" className="min-h-[60vh]">
      <Link to="/services" className="mb-8 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
        <ChevronLeft size={16} className={isRTL ? 'rotate-180' : ''} /> {copy.common.allServices}
      </Link>

      <div className="max-w-2xl">
        {service.requires_appointment ? (
          <Badge tone="primary" className="mb-4">
            {copy.common.appointmentRequired}
          </Badge>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{getLocalizedField(service, 'name', locale)}</h1>
        {getLocalizedField(service, 'short_description', locale) ? <p className="mt-3 text-ink-soft">{getLocalizedField(service, 'short_description', locale)}</p> : null}

        {service.image_path ? (
          <img
            src={service.image_path}
            alt={getLocalizedField(service, 'name', locale)}
            className="mt-8 aspect-video w-full rounded-lg object-cover"
            loading="lazy"
          />
        ) : null}

        {getLocalizedField(service, 'preparation_info', locale) ? (
          <div className="mt-8">
            <h2 className="font-medium text-ink">{copy.common.preparation}</h2>
            <p className="mt-2 text-ink-soft">{getLocalizedField(service, 'preparation_info', locale)}</p>
          </div>
        ) : null}

        <Button as={Link} to="/rendez-vous" state={{ serviceId: service.id }} size="lg" className="mt-10">
          <Calendar size={18} />
          {copy.nav.cta}
          <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
        </Button>
      </div>
    </Section>
  )
}
