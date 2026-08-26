import { Link } from "react-router-dom";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";

import { Container } from "../ui";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { fr } from "../../content/fr";

export function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  const socials = [
    {
      key: "facebook",
      href: settings.facebook,
      Icon: Facebook,
    },
    {
      key: "instagram",
      href: settings.instagram,
      Icon: Instagram,
    },
  ].filter((social) => social.href);

  return (
    <footer className="relative overflow-hidden bg-[#07101f] text-white">
      {/* Ambient blue glow */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute -right-32 -top-32
          h-80 w-80
          rounded-full
          bg-blue-500/10
          blur-3xl
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute -bottom-40 left-1/4
          h-72 w-72
          rounded-full
          bg-blue-600/5
          blur-3xl
        "
      />

      <Container className="relative py-14 sm:py-16 lg:py-20">
        {/* TOP */}
        <div
          className="
            flex flex-col gap-10
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          {/* BRAND */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="
                inline-flex
                transition-opacity
                hover:opacity-85
              "
              aria-label={settings.site_name ?? fr.brand.name}
            >
              <img
                src="/logo-white.png"
                alt={settings.site_name ?? fr.brand.name}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p
              className="
                mt-5
                max-w-xs
                text-sm
                leading-6
                text-white/55
              "
            >
              {settings.site_name}
            </p>
          </div>

          {/* NAVIGATION */}
          <div
            className="
              grid
              grid-cols-2
              gap-x-12
              gap-y-8
              sm:grid-cols-3
              lg:gap-x-16
            "
          >
            {/* Contact */}
            <div>
              <p
                className="
                  mb-4
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white/40
                "
              >
                {fr.nav.contact}
              </p>

              <div className="space-y-2.5 text-sm">
                {settings.phone ? (
                  <a
                    href={`tel:${settings.phone}`}
                    className="
                      block
                      text-white/70
                      transition-colors
                      hover:text-white
                    "
                  >
                    {settings.phone}
                  </a>
                ) : null}

                {settings.address ? (
                  <span
                    className="
                      block
                      max-w-[180px]
                      leading-5
                      text-white/45
                    "
                  >
                    {settings.address}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Services */}
            <div>
              <p
                className="
                  mb-4
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white/40
                "
              >
                {fr.services.title}
              </p>

              <div className="space-y-2.5 text-sm text-white/65">
                <p>{fr.services.categories.imagerie}</p>
                <p>{fr.services.categories.laboratoire}</p>
                <p>{fr.services.categories.examens}</p>
              </div>
            </div>

            {/* Links */}
            <div>
              <p
                className="
                  mb-4
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white/40
                "
              >
                Liens
              </p>

              <div className="space-y-2.5">
                <Link
                  to="/rendez-vous"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    text-white/70
                    transition-colors
                    hover:text-white
                  "
                >
                  {fr.nav.cta}

                  <ArrowUpRight
                    size={13}
                    strokeWidth={2}
                    className="
                      transition-transform
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Link>

                {socials.map(({ key, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      capitalize
                      text-white/60
                      transition-colors
                      hover:text-white
                    "
                  >
                    <Icon size={14} strokeWidth={1.8} />
                    {key}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px bg-white/10 sm:my-12" />

        {/* BOTTOM */}
        <div
          className="
            flex
            flex-col
            gap-4
            text-xs
            text-white/40
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {year} {settings.site_name}. {fr.footer.rights}
          </p>

          <Link
            to="/admin"
            className="
              transition-colors
              hover:text-white/80
            "
          >
            Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
}
