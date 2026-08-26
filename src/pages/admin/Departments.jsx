import { CrudManager } from '../../components/admin/CrudManager'
import { departmentsAdmin } from '../../services/admin'

export default function AdminDepartments() {
  return (
    <CrudManager
      title="Départements"
      crud={departmentsAdmin}
      getTitle={(d) => d.name}
      getSubtitle={(d) => d.slug}
      fields={[
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  )
}
