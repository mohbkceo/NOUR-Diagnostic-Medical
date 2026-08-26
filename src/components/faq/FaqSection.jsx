import { Section, SectionHeading, Accordion, EmptyState } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderFaqs } from '../../data/placeholders'
import { fr } from '../../content/fr'

export function FaqSection() {
  const { data: faqs } = useSupabaseData(contentQueries.faqs, [], placeholderFaqs)

  return (
    <Section id="faq" tone="white">
      <SectionHeading title={fr.faq.title} />
      {!faqs?.length ? (
        <EmptyState title={fr.common.emptyFaq} />
      ) : (
        <Accordion
          className="max-w-2xl"
          items={faqs.map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
        />
      )}
    </Section>
  )
}
