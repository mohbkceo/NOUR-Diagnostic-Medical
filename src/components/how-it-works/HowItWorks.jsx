import { Section, SectionHeading } from '../ui'
import { fr } from '../../content/fr'

export function HowItWorks() {
  return (
    <Section tone="white">
      <SectionHeading title={fr.howItWorks.title} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {fr.howItWorks.steps.map((step) => (
          <div key={step.number}>
            <span className="text-sm font-semibold text-primary">{step.number}</span>
            <h3 className="mt-2 font-medium text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm text-ink-soft">{step.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
