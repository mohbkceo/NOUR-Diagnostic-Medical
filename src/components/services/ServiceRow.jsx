import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function ServiceRow({ service }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex items-center justify-between gap-4 border-b border-line py-5 first:pt-0 last:border-b-0"
    >
      <div>
        <h4 className="font-medium text-ink">{service.name}</h4>
        {service.short_description ? (
          <p className="mt-1 text-sm text-ink-soft">{service.short_description}</p>
        ) : null}
      </div>
      <ArrowRight size={16} className="shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
