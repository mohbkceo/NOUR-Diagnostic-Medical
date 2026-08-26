import { Section, SectionHeading } from '../components/ui'
import { ReservationForm } from '../components/reservation/ReservationForm'
import { fr } from '../content/fr'

export default function Reservation() {
  return (
    <Section tone="white" className="min-h-[70vh]">
      <div className="mx-auto max-w-xl">
        <SectionHeading title={fr.reservation.title} align="left" />
        <ReservationForm />
      </div>
    </Section>
  )
}
