import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '../../i18n/LocaleProvider'
import { getLocalizedField } from '../../i18n/localizedField'

export function ServiceRow({ service }) {
  const { locale, isRTL } = useLocale()
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex items-center justify-between gap-4 border-b border-line py-5 first:pt-0 last:border-b-0"
    >
      <div>
        <h4 className="font-medium text-ink">{getLocalizedField(service, 'name', locale)}</h4>
        {getLocalizedField(service, 'short_description', locale) ? (
          <p className="mt-1 text-sm text-ink-soft">{getLocalizedField(service, 'short_description', locale)}</p>
        ) : null}
      </div>
      <ArrowRight size={16} className={`shrink-0 text-ink-soft transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
    </Link>
  )
}
