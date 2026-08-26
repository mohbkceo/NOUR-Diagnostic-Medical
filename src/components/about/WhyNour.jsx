import { Section, SectionHeading } from '../ui'
import { fr } from '../../content/fr'

export function WhyNour() {
  return (
    <Section tone="muted">
      <SectionHeading title={fr.whyNour.title} />
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {fr.whyNour.points.map((point) => (
          <div key={point.title} className="border-t border-primary pt-4">
            <h3 className="font-medium text-ink">{point.title}</h3>
            <p className="mt-1.5 text-sm text-ink-soft">{point.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
