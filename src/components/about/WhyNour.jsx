import { Section, SectionHeading } from "../ui";
import { fr } from "../../content/fr";

export function WhyNour() {
  return (
    <Section
      tone="muted"
      className="
        relative
        overflow-hidden
        !py-16
        sm:!py-20
      "
    >
      {/* Subtle blue atmosphere */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.06),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(96,165,250,0.05),transparent_28%)]
        "
      />

      <div className="relative">
        {/* HEADER */}
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.12em]
                text-blue-600
              "
            >
              Pourquoi nous
            </span>
          </div>

          <SectionHeading title={fr.whyNour.title} className="mb-0" />
        </div>

        {/* FEATURES */}
        <div
          className="
            mt-10
            grid
            overflow-hidden
            rounded-[1.75rem]
            border border-white/80
            bg-white/55
            backdrop-blur-xl
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {fr.whyNour.points.map((point, index) => (
            <article
              key={point.title}
              className="
                group
                relative
                min-h-[170px]
                p-6
                transition-colors
                duration-200
                hover:bg-white/55
                sm:p-7
                lg:min-h-[190px]
              "
            >
              {/* Internal separator */}
              {index > 0 ? (
                <div
                  aria-hidden
                  className="
                    absolute
                    left-0
                    top-6
                    hidden
                    h-[calc(100%-3rem)]
                    w-px
                    bg-slate-200/80
                    sm:block
                  "
                />
              ) : null}

              {/* Index */}
              <span
                className="
                  text-xs
                  font-semibold
                  tabular-nums
                  text-blue-600/70
                "
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3
                className="
                  mt-6
                  text-base
                  font-semibold
                  tracking-[-0.02em]
                  text-slate-900
                "
              >
                {point.title}
              </h3>

              <p
                className="
                  mt-2
                  max-w-xs
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {point.text}
              </p>

              {/* Mobile separator */}
              {index < fr.whyNour.points.length - 1 ? (
                <div
                  aria-hidden
                  className="
                    absolute
                    bottom-0
                    left-6
                    right-6
                    h-px
                    bg-slate-200/80
                    sm:hidden
                  "
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
