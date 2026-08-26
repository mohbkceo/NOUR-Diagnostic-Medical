import { Link } from 'react-router-dom'
import { Facebook, Instagram, MapPin, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { Container } from '../ui'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { fr } from '../../content/fr'

export function Footer() {
  const { settings } = useSiteSettings()
  const year = new Date().getFullYear()

  const socials = [
    { key: 'facebook', href: settings.facebook, Icon: Facebook },
    { key: 'instagram', href: settings.instagram, Icon: Instagram },
  ].filter((s) => s.href)

  return (
    <footer className="border-t border-line bg-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo logoUrl={settings.logo_url} siteName={settings.site_name?.split(' ')[0] ?? fr.brand.name} />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">{settings.site_name}</p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium text-ink">{fr.nav.contact}</p>
          <ul className="space-y-2 text-ink-soft">
            {settings.phone ? (
              <li className="flex items-center gap-2">
                <Phone size={14} /> {settings.phone}
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" /> {settings.address}
              </li>
            ) : null}
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium text-ink">{fr.services.title}</p>
          <ul className="space-y-2 text-ink-soft">
            <li>{fr.services.categories.imagerie}</li>
            <li>{fr.services.categories.laboratoire}</li>
            <li>{fr.services.categories.examens}</li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium text-ink">Liens</p>
          <ul className="space-y-2 text-ink-soft">
            <li>
              <Link to="/rendez-vous" className="hover:text-ink">
                {fr.nav.cta}
              </Link>
            </li>
            {socials.map(({ key, href, Icon }) => (
              <li key={key}>
                <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-ink">
                  <Icon size={14} /> {key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-line py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-ink-soft sm:flex-row">
          <p>
            © {year} {settings.site_name}. {fr.footer.rights}
          </p>
          <Link to="/admin" className="hover:text-ink">
            Admin
          </Link>
        </Container>
      </div>
    </footer>
  )
}
