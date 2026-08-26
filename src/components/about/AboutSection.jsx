import { Section } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderAbout } from '../../data/placeholders'

export function AboutSection() {
  const { data: about } = useSupabaseData(contentQueries.about, [], placeholderAbout)
  const content = about ?? placeholderAbout

  return (
    <Section id="about" tone="muted">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{content.title}</h2>
          <p className="mt-4 text-ink-soft">{content.content}</p>

          {content.facts?.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {content.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-ink-soft">{fact.label}</dt>
                  <dd className="text-xl font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-primary-50">
          {content.image_path ? (
            <img src={content.image_path} alt={content.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-primary-700/60">
              Image — Admin &gt; À propos
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
