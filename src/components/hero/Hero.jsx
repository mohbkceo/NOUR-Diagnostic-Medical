import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button, Container } from '../ui'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useOpeningStatus } from '../../hooks/useOpeningStatus'
import { fr } from '../../content/fr'

export function Hero() {
  const { settings } = useSiteSettings()
  const { status } = useOpeningStatus()
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : null

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[480px] bg-gradient-to-b from-primary-50 to-transparent"
      />
      <Container className="relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">{fr.hero.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {fr.brand.name}
            <span className="mt-1 block text-2xl font-medium text-ink-soft sm:text-3xl">
              {fr.brand.tagline}
            </span>
          </h1>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base font-medium text-ink-soft sm:text-lg">
            {fr.hero.lines.map((line) => (
              <li key={line} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button as={Link} to="/rendez-vous" size="lg">
              <Calendar size={18} />
              {fr.hero.cta}
            </Button>
            {whatsappHref ? (
              <Button as="a" href={whatsappHref} target="_blank" rel="noreferrer" variant="outline" size="lg">
                <MessageCircle size={18} />
                {fr.hero.ctaSecondary}
              </Button>
            ) : null}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
            {settings.phone ? (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-ink">
                <Phone size={15} /> {settings.phone}
              </a>
            ) : null}
            {settings.address ? (
              <span className="flex items-center gap-2">
                <MapPin size={15} /> {settings.address}
              </span>
            ) : null}
            <span className="flex items-center gap-2">
              <Clock size={15} />
              <span className={status.isOpen ? 'text-emerald-600' : 'text-ink-soft'}>{status.label}</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
