import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Calendar, ChevronLeft } from 'lucide-react'
import { Section, Button, Badge, Skeleton } from '../components/ui'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { contentQueries } from '../services/content'
import { placeholderServices } from '../data/placeholders'

export default function ServiceDetails() {
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
        <p className="text-ink-soft">Service introuvable.</p>
        <Link to="/services" className="mt-4 inline-flex items-center gap-1 text-primary">
          <ChevronLeft size={16} /> Retour aux services
        </Link>
      </Section>
    )
  }

  return (
    <Section tone="white" className="min-h-[60vh]">
      <Link to="/services" className="mb-8 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
        <ChevronLeft size={16} /> Tous les services
      </Link>

      <div className="max-w-2xl">
        {service.requires_appointment ? (
          <Badge tone="primary" className="mb-4">
            Rendez-vous requis
          </Badge>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{service.name}</h1>
        {service.short_description ? <p className="mt-3 text-ink-soft">{service.short_description}</p> : null}

        {service.image_path ? (
          <img
            src={service.image_path}
            alt={service.name}
            className="mt-8 aspect-video w-full rounded-lg object-cover"
            loading="lazy"
          />
        ) : null}

        {service.preparation_info ? (
          <div className="mt-8">
            <h2 className="font-medium text-ink">Préparation</h2>
            <p className="mt-2 text-ink-soft">{service.preparation_info}</p>
          </div>
        ) : null}

        <Button as={Link} to="/rendez-vous" state={{ serviceId: service.id }} size="lg" className="mt-10">
          <Calendar size={18} />
          Prendre rendez-vous
          <ArrowRight size={16} />
        </Button>
      </div>
    </Section>
  )
}
