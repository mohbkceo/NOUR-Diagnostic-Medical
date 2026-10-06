import { useLocale } from '../../i18n/LocaleProvider'
import { Section, SectionHeading } from '../ui'

export function HowItWorks() {
  const { copy } = useLocale()
  return (
    <Section tone="white">
      <SectionHeading title={copy.howItWorks.title} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {copy.howItWorks.steps.map((step) => (
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
