import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Section, SectionHeading, Button } from "../ui";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { useOpeningStatus } from "../../hooks/useOpeningStatus";
import { weekdayLabels } from "../../styles/tokens";
import { fr } from "../../content/fr";

export function ContactSection() {
  const { settings } = useSiteSettings();
  const { hours, status } = useOpeningStatus();

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <Section
      id="contact"
      tone="muted"
      className="
        relative
        overflow-hidden
        !py-16
        sm:!py-20
        lg:!py-24
      "
    >
      {/* Subtle atmosphere */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute inset-0
          bg-[radial-gradient(circle_at_12%_30%,rgba(37,99,235,0.06),transparent_28%),radial-gradient(circle_at_88%_70%,rgba(96,165,250,0.05),transparent_30%)]
        "
      />

      <div className="relative">
        {/* HEADER */}
        <div className="max-w-2xl">
          <SectionHeading title={fr.contact.title} className="mb-0" />
        </div>

        {/* MAIN */}
        <div
          className="
            mt-10
            grid
            gap-5
            lg:grid-cols-[1fr_0.9fr]
            lg:gap-6
          "
        >
          {/* CONTACT */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[1.75rem]
              border border-white/80
              bg-white/60
              p-6
              backdrop-blur-xl
              sm:p-8
            "
          >
            <div className="max-w-lg">
              {/* Address */}
              {settings.address ? (
                <div className="pb-6">
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-slate-400
                    "
                  >
                    {fr.contact.address}
                  </p>

                  <p
                    className="
                      mt-2
                      max-w-md
                      text-base
                      font-medium
                      leading-6
                      text-slate-800
                    "
                  >
                    {settings.address}
                  </p>

                  {settings.address_map_url ? (
                    <a
                      href={settings.address_map_url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        group
                        mt-3
                        inline-flex
                        items-center
                        gap-1
                        text-sm
                        font-medium
                        text-blue-600
                        transition-colors
                        hover:text-blue-700
                      "
                    >
                      {fr.contact.directions}

                      <ArrowUpRight
                        size={14}
                        strokeWidth={2}
                        className="
                          transition-transform
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                        "
                      />
                    </a>
                  ) : null}
                </div>
              ) : null}

              {/* Phone */}
              {settings.phone ? (
                <div className="border-t border-slate-200/70 py-6">
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-slate-400
                    "
                  >
                    {fr.contact.phone}
                  </p>

                  <a
                    href={`tel:${settings.phone}`}
                    className="
                      mt-2
                      inline-block
                      text-lg
                      font-semibold
                      tracking-[-0.02em]
                      text-slate-900
                      transition-colors
                      hover:text-blue-600
                    "
                  >
                    {settings.phone}
                  </a>
                </div>
              ) : null}

              {/* WhatsApp */}
              {whatsappHref ? (
                <div className="border-t border-slate-200/70 pt-6">
                  <Button
                    as="a"
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      h-11
                      rounded-full
                      w-full
                      bg-blue-600
                      px-5
                      text-white
                      shadow-xs
                      hover:bg-blue-700
                    "
                  >
                    <MessageCircle size={16} strokeWidth={2} />
                    WhatsApp
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {/* OPENING HOURS */}
          <div
            className="
              overflow-hidden
              rounded-[1.75rem]
              border border-white/80
              bg-white/55
              backdrop-blur-xl
            "
          >
            {/* Status header */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 px-6 py-5 sm:px-8">
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-slate-400
                "
              >
                {fr.contact.hours}
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    status.isOpen ? "bg-emerald-500" : "bg-slate-300",
                  ].join(" ")}
                />

                <span
                  className={
                    status.isOpen
                      ? "text-xs font-semibold text-emerald-600"
                      : "text-xs font-medium text-slate-500"
                  }
                >
                  {status.label}
                </span>
              </div>
            </div>

            {/* Hours */}
            <dl className="divide-y divide-slate-200/70">
              {hours.map((h) => (
                <div
                  key={h.weekday}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-6
                    px-6
                    py-4
                    sm:px-8
                  "
                >
                  <dt className="text-sm text-slate-500">
                    {weekdayLabels[h.weekday]}
                  </dt>

                  <dd
                    className="
                      text-sm
                      font-medium
                      text-slate-800
                      text-right
                    "
                  >
                    {h.is_closed
                      ? fr.common.closed
                      : `${h.open_time} – ${h.close_time}`}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
