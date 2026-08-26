import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MessageCircle } from "lucide-react";

import { Button, Container } from "../ui";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { useOpeningStatus } from "../../hooks/useOpeningStatus";
import { fr } from "../../content/fr";

const heroImage = "./image.jpg";

export function Hero() {
  const { settings } = useSiteSettings();
  const { status } = useOpeningStatus();

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <section className="relative isolate overflow-hidden mt-16 bg-[#f7faff]">
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_78%_20%,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_15%_55%,rgba(96,165,250,0.08),transparent_30%)]
        "
      />

      <Container className="relative py-6 sm:py-10 lg:py-14">
        <div
          className="
            relative isolate overflow-hidden
            min-h-[640px]
            rounded-[2rem]
            border border-white/80
            bg-white
            shadow-xs
          "
        >
          {/* IMAGE / CONTENT LAYER */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt=""
              className="
                h-full w-full
                object-cover
                object-center
              "
            />

            {/* Keep the image visible while protecting text */}
            <div
              aria-hidden
              className="
                absolute inset-0
                bg-gradient-to-r
                from-white
                via-white/90
                via-[45%]
                to-transparent
              "
            />

            <div
              aria-hidden
              className="
                absolute inset-0
                bg-gradient-to-t
                from-slate-950/10
                via-transparent
                to-transparent
              "
            />
          </div>

          {/* MAIN CONTENT */}
          <div
            className="
              relative z-10
              flex min-h-[640px]
              items-center
            "
          >
            <div
              className="
                w-full
                max-w-2xl
                px-6 py-12
                sm:px-10 sm:py-16
                lg:px-14
                xl:px-16
              "
            >
              {/* Brand */}
              <div className="max-w-xl">
                <h1
                  className="
                    text-6xl font-semibold
                    leading-[1.02]
                    tracking-[-0.045em]
                    text-slate-950
                    sm:text-5xl
                    lg:text-6xl
                    xl:text-[4.35rem]
                  "
                >
                  {fr.brand.name}
                </h1>

                <p
                  className="
                    mt-5
                    max-w-lg
                    text-lg font-medium
                    leading-snug
                    tracking-[-0.025em]
                    text-slate-500
                    sm:text-xl
                  "
                >
                  {fr.brand.tagline}
                </p>

                <p
                  className="
                    mt-5
                    max-w-lg
                    text-sm leading-6
                    text-slate-500
                    sm:text-base
                  "
                >
                  {fr.hero.lines.join(" · ")}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  as={Link}
                  to="/rendez-vous"
                  size="lg"
                  className="
                    group
                    h-12
                    rounded-full
                    bg-blue-600
                    px-5
                    w-full
                    text-white
                    shadow-xs
                    transition-all
                    duration-200
                    hover:bg-blue-700
                    active:scale-[0.98]
                  "
                >
                  <Calendar size={16} strokeWidth={2} />
                  {fr.hero.cta}

                  <ArrowUpRight
                    size={15}
                    strokeWidth={2}
                    className="
                      ml-0.5
                      transition-transform
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Button>

                {whatsappHref ? (
                  <Button
                    as="a"
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    variant="outline"
                    size="lg"
                    className="
                      h-12
                      rounded-full
                      border-white/80
                      bg-white/55
                      px-5
                      w-full
                      text-slate-700
                      backdrop-blur-xl
                      transition-all
                      hover:border-blue-200
                      hover:bg-white/75
                      hover:text-blue-700
                    "
                  >
                    <MessageCircle size={16} strokeWidth={2} />
                    {fr.hero.ctaSecondary}
                  </Button>
                ) : null}
              </div>

              {/* COMPACT META */}
              <div
                className="
                  mt-9
                  flex flex-wrap
                  items-center
                  gap-x-4 gap-y-2
                  text-sm
                "
              >
                {settings.phone ? (
                  <a
                    href={`tel:${settings.phone}`}
                    className="
                      text-slate-900
                      transition-colors
                      hover:text-blue-600
                    "
                  >
                    {settings.phone}
                  </a>
                ) : null}

                {settings.phone && settings.address ? (
                  <span className="text-slate-300">/</span>
                ) : null}

                {settings.address ? (
                  <span
                    className="
                      max-w-[260px]
                      truncate
                      text-slate-900
                    "
                  >
                    {settings.address}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* FLOATING STATUS — SINGLE GLASS CONTROL */}
          <div
            className="
              absolute
              right-4 top-4
              z-20
              hidden sm:flex
              items-center gap-2.5
              rounded-full
              border border-white/80
              bg-white/60
              px-3.5 py-2.5
              backdrop-blur-2xl
              shadow-xs
            "
          >
            <span
              className={[
                "h-2 w-2 rounded-full",
                status.isOpen ? "bg-emerald-500" : "bg-slate-300",
              ].join(" ")}
            />

            <span
              className={
                status.isOpen
                  ? "text-xs font-semibold text-emerald-700"
                  : "text-xs font-medium text-slate-600"
              }
            >
              {status.label}
            </span>
          </div>

          {/* MOBILE STATUS */}
          <div
            className="
              absolute
              bottom-4 left-4
              z-20
              flex sm:hidden
              items-center
              rounded-full
              border border-white/80
              bg-white/65
              px-3 py-2
              backdrop-blur-xl
              shadow-xs
            "
          >
            <span
              className={[
                "mr-2 h-1.5 w-1.5 rounded-full",
                status.isOpen ? "bg-emerald-500" : "bg-slate-300",
              ].join(" ")}
            />

            <span
              className={
                status.isOpen
                  ? "text-xs font-semibold text-emerald-700"
                  : "text-xs font-medium text-slate-600"
              }
            >
              {status.label}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
