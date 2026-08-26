import { CrudManager } from '../../components/admin/CrudManager'
import { testimonialsAdmin } from '../../services/admin'

export default function AdminTestimonials() {
  return (
    <CrudManager
      title="Témoignages"
      crud={testimonialsAdmin}
      getTitle={(t) => t.patient_name}
      getSubtitle={(t) => t.quote}
      fields={[
        { name: 'patient_name', label: 'Nom du patient', type: 'text', required: true },
        { name: 'quote', label: 'Témoignage', type: 'textarea', required: true },
        {
          name: 'rating',
          label: 'Note',
          type: 'select',
          options: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n} / 5` })),
        },
      ]}
    />
  )
}
