import { Section } from "../ui";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { contentQueries } from "../../services/content";
import { placeholderAbout } from "../../data/placeholders";

export function AboutSection() {
  const { data: about } = useSupabaseData(
    contentQueries.about,
    [],
    placeholderAbout,
  );

  const content = about ?? placeholderAbout;

  return (
    <Section
      id="about"
      tone="white"
      className="relative bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.06),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(96,165,250,0.05),transparent_28%)] overflow-hidden !py-16 sm:!py-20 lg:!py-24"
    >
      {/* Subtle atmosphere */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute inset-0
          bg-[radial-gradient(circle_at_12%_45%,rgba(37,99,235,0.055),transparent_28%),radial-gradient(circle_at_88%_65%,rgba(96,165,250,0.045),transparent_30%)]
        "
      />

      <div
        className="
          relative
          grid
          items-center
          gap-10
          lg:grid-cols-[0.88fr_1.12fr]
          lg:gap-14
          xl:gap-20
        "
      >
        {/* CONTENT */}
        <div className="max-w-xl">
          <div className="mb-5 flex items-center gap-2">
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
              À propos
            </span>
          </div>

          <h2
            className="
              text-3xl
              font-semibold
              leading-[1.05]
              tracking-[-0.04em]
              text-slate-950
              sm:text-4xl
              lg:text-[3.25rem]
            "
          >
            {content.title}
          </h2>

          <p
            className="
              mt-6
              max-w-lg
              text-base
              leading-7
              text-slate-500
              sm:text-lg
            "
          >
            {content.content}
          </p>

          {/* FACTS */}
          {content.facts?.length ? (
            <div
              className="
                mt-9
                inline-flex
                max-w-full
                flex-wrap
                items-stretch
                overflow-hidden
                rounded-[1.4rem]
                border border-white/80
                bg-slate-50/75
                p-1.5
                backdrop-blur-xl
              "
            >
              {content.facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={[
                    "min-w-[120px] px-4 py-3.5 sm:px-5",
                    index !== 0 ? "border-l border-slate-200/70" : "",
                  ].join(" ")}
                >
                  <dt
                    className="
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.08em]
                      text-slate-400
                    "
                  >
                    {fact.label}
                  </dt>

                  <dd
                    className="
                      mt-1
                      text-lg
                      font-semibold
                      tracking-[-0.02em]
                      text-slate-900
                    "
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* IMAGE */}
        <div
          className="
            relative
            min-h-[360px]
            overflow-hidden
            rounded-[2rem]
            border
            border-white/80
            bg-slate-100
            shadow-xs
            sm:min-h-[440px]
            lg:min-h-[520px]
          "
        >
          {content.image_path ? (
            <>
              <img
                src={content.image_path}
                alt={content.title}
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  hover:scale-[1.025]
                "
                loading="lazy"
              />

              {/* Image depth */}
              <div
                aria-hidden
                className="
                  pointer-events-none
                  absolute inset-0
                  bg-gradient-to-t
                  from-slate-950/20
                  via-transparent
                  to-white/5
                "
              />

              {/* Small floating label */}
              <div
                className="
                  absolute
                  bottom-4 left-4
                  rounded-full
                  border border-white/70
                  bg-white/60
                  px-3.5 py-2
                  text-xs
                  font-medium
                  text-slate-700
                  backdrop-blur-2xl
                  shadow-xs
                "
              >
                {content.title}
              </div>
            </>
          ) : (
            <div
              className="
                flex
                h-full
                min-h-[360px]
                items-center
                justify-center
                bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_55%)]
                text-sm
                text-blue-700/50
              "
            >
              <img src="/about.jpg" alt="About-image" />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
