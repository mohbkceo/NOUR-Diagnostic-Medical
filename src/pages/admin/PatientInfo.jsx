import { CrudManager } from '../../components/admin/CrudManager'
import { patientInfoAdmin } from '../../services/admin'

const categories = [
  { value: 'preparation', label: 'Préparation' },
  { value: 'documents', label: 'Documents' },
  { value: 'jeune', label: 'Jeûne' },
  { value: 'consignes', label: 'Consignes' },
]

export default function AdminPatientInfo() {
  return (
    <CrudManager
      title="Informations patients"
      crud={patientInfoAdmin}
      getTitle={(p) => p.title}
      getSubtitle={(p) => categories.find((c) => c.value === p.category)?.label}
      fields={[
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'content', label: 'Contenu', type: 'textarea', required: true },
        { name: 'category', label: 'Catégorie', type: 'select', options: categories },
      ]}
    />
  )
}
