import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { Section, SectionHeading, Button } from '../ui'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useOpeningStatus } from '../../hooks/useOpeningStatus'
import { weekdayLabels } from '../../styles/tokens'
import { fr } from '../../content/fr'

export function ContactSection() {
  const { settings } = useSiteSettings()
  const { hours, status } = useOpeningStatus()
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : null

  return (
    <Section id="contact" tone="muted">
      <SectionHeading title={fr.contact.title} />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-5">
          {settings.address ? (
            <div>
              <p className="text-sm text-ink-soft">{fr.contact.address}</p>
              <p className="mt-1 flex items-start gap-2 font-medium text-ink">
                <MapPin size={16} className="mt-1 shrink-0" /> {settings.address}
              </p>
              {settings.address_map_url ? (
                <a
                  href={settings.address_map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-primary"
                >
                  {fr.contact.directions}
                </a>
              ) : null}
            </div>
          ) : null}

          {settings.phone ? (
            <div>
              <p className="text-sm text-ink-soft">{fr.contact.phone}</p>
              <a href={`tel:${settings.phone}`} className="mt-1 flex items-center gap-2 font-medium text-ink">
                <Phone size={16} /> {settings.phone}
              </a>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            {whatsappHref ? (
              <Button as="a" href={whatsappHref} target="_blank" rel="noreferrer" variant="outline">
                <MessageCircle size={16} /> WhatsApp
              </Button>
            ) : null}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-ink-soft">
            {fr.contact.hours}
            <span className={status.isOpen ? 'font-medium text-emerald-600' : 'font-medium text-ink-soft'}>
              · {status.label}
            </span>
          </p>
          <dl className="divide-y divide-line border-y border-line text-sm">
            {hours.map((h) => (
              <div key={h.weekday} className="flex items-center justify-between py-2.5">
                <dt className="text-ink-soft">{weekdayLabels[h.weekday]}</dt>
                <dd className="font-medium text-ink">
                  {h.is_closed ? fr.common.closed : `${h.open_time} – ${h.close_time}`}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  )
}
