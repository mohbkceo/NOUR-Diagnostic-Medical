import { getLocalizedField } from '../../i18n/localizedField'
import { useLocale } from '../../i18n/LocaleProvider'
import { Section, SectionHeading, Accordion, EmptyState } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderFaqs } from '../../data/placeholders'

export function FaqSection() {
  const { copy, locale } = useLocale()
  const { data: faqs } = useSupabaseData(contentQueries.faqs, [], placeholderFaqs)

  return (
    <Section id="faq" tone="white">
      <SectionHeading title={copy.faq.title} />
      {!faqs?.length ? (
        <EmptyState title={copy.common.emptyFaq} />
      ) : (
        <Accordion
          className="max-w-2xl"
          items={faqs.map((f) => ({ id: f.id, title: getLocalizedField(f, 'question', locale), content: getLocalizedField(f, 'answer', locale) }))}
        />
      )}
    </Section>
  )
}
