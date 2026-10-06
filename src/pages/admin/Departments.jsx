import { getLocalizedField } from '../../i18n/localizedField'
import { CrudManager } from '../../components/admin/CrudManager'
import { departmentsAdmin } from '../../services/admin'

export default function AdminDepartments() {
  return (
    <CrudManager
      title="Départements"
      crud={departmentsAdmin}
      getTitle={(d) => getLocalizedField(d, 'name', 'fr')}
      getSubtitle={(d) => d.slug}
      fields={[
        { name: 'name', localized: true, label: { fr: 'Nom', ar: 'الاسم' }, type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'description', localized: true, label: { fr: 'Description', ar: 'الوصف' }, type: 'textarea' },
      ]}
    />
  )
}
