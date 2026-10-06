import { useLocale } from '../i18n/LocaleProvider'
import { Section, SectionHeading } from '../components/ui'
import { ReservationForm } from '../components/reservation/ReservationForm'

export default function Reservation() {
  const { copy } = useLocale()
  return (
    <Section tone="white" className="min-h-[70vh]">
      <div className="mx-auto max-w-xl">
        <SectionHeading title={copy.reservation.title} align="left" />
        <ReservationForm />
      </div>
    </Section>
  )
}
