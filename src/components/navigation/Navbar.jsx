import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ArrowUpRight } from "lucide-react";

import { GlassNav, GlassSheet } from "../glass";
import { Button } from "../ui";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { fr } from "../../content/fr";

const logo = "./logo.png";

const links = [
  { to: "/#services", label: fr.nav.services },
  { to: "/#about", label: fr.nav.about },
  { to: "/#team", label: fr.nav.team },
  { to: "/#faq", label: fr.nav.faq },
  { to: "/#contact", label: fr.nav.contact },
];

export function Navbar() {
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);

  const brandName = settings.site_name?.split(" ")[0] ?? fr.brand.name;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <GlassNav
          className="
            mx-auto max-w-7xl
            border border-white/40
            bg-white/70
            
            backdrop-blur-2xl
            supports-[backdrop-filter]:bg-white/55
            rounded-[3rem]
          "
        >
          <div className="flex h-[60px] items-center justify-between rounded-[3rem]  px-2 sm:px-3">
            {/* Brand */}
            <Link
              to="/"
              className="
                group flex min-w-0 items-center
                rounded-xl px-2 py-1.5
                transition-opacity
                hover:opacity-80
              "
            >
              <img
                src={logo}
                alt={brandName}
                className="
                  block h-8 w-auto
                  object-contain
                  sm:h-9
                "
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden rounded-2xl lg:flex items-center">
              <div
                className="
                  flex items-center gap-1
                  rounded-2xl
                  border border-slate-200/70
                  bg-slate-100/55
                  p-1
                  backdrop-blur-xl
                "
              >
                {links.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    className="
                      rounded-lg
                      px-3.5 py-2
                      text-[13px] font-medium
                      text-slate-600
                      transition-all duration-200
                      hover:bg-white/80
                      hover:text-blue-600
                    "
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                as={Link}
                to="/rendez-vous"
                size="sm"
                className="
                  hidden sm:inline-flex
                  rounded-xl
                  border border-blue-500/20
                  bg-blue-600
                  px-4
                  font-medium
                  text-white
                  shadow-xs
                  transition-all
                  hover:bg-blue-700
                  active:scale-[0.98]
                "
              >
                {fr.nav.cta}
              </Button>

              <button
                type="button"
                aria-label="Ouvrir le menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="
                  inline-flex
                  h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-slate-200/70
                  bg-white/65
                  text-slate-700
                  backdrop-blur-xl
                  transition-all
                  hover:bg-white
                  hover:text-blue-600
                  active:scale-[0.96]
                  lg:hidden
                "
              >
                <Menu size={19} strokeWidth={2} />
              </button>
            </div>
          </div>
        </GlassNav>
      </div>

      {/* Mobile sheet */}
      <GlassSheet
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        title={brandName}
      >
        <div className="flex h-full flex-col">
          <nav className="space-y-1">
            {links.map((link) => (
              <a
                key={link.to}
                href={link.to}
                onClick={() => setOpen(false)}
                className="
                  group flex items-center justify-between
                  rounded-xl
                  border border-transparent
                  px-4 py-3.5
                  text-[15px] font-medium
                  text-slate-700
                  transition-all
                  hover:border-blue-100
                  hover:bg-blue-50/70
                  hover:text-blue-600
                "
              >
                <span>{link.label}</span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="
                    text-slate-400
                    transition-transform
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-blue-500
                  "
                />
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <div className="mb-4 h-px bg-slate-200/80" />

            <Button
              as={Link}
              to="/rendez-vous"
              className="
                w-full
                rounded-xl
                bg-blue-600
                py-3
                font-medium
                text-white
                shadow-xs
                hover:bg-blue-700
              "
              onClick={() => setOpen(false)}
            >
              {fr.nav.cta}
            </Button>
          </div>
        </div>
      </GlassSheet>
    </>
  );
}
