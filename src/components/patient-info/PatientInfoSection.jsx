import { Section, SectionHeading, Accordion, EmptyState } from '../ui'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { contentQueries } from '../../services/content'
import { placeholderPatientInfo } from '../../data/placeholders'
import { fr } from '../../content/fr'

export function PatientInfoSection() {
  const { data: items } = useSupabaseData(contentQueries.patientInfo, [], placeholderPatientInfo)

  if (!items?.length) {
    return (
      <Section tone="muted">
        <SectionHeading title={fr.patientInfo.title} intro={fr.patientInfo.intro} />
        <EmptyState title="Aucune information pour le moment." />
      </Section>
    )
  }

  const accordionItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
  }))

  return (
    <Section tone="muted">
      <SectionHeading title={fr.patientInfo.title} intro={fr.patientInfo.intro} />
      <Accordion items={accordionItems} className="max-w-2xl" />
    </Section>
  )
}
