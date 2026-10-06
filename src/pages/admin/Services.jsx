import { getLocalizedField } from '../../i18n/localizedField'
import { useEffect, useState } from 'react'
import { CrudManager } from '../../components/admin/CrudManager'
import { servicesAdmin, departmentsAdmin } from '../../services/admin'
import { Spinner } from '../../components/ui'

const categoryOptions = [
  { value: 'imagerie', label: 'Imagerie médicale' },
  { value: 'laboratoire', label: "Laboratoire d'analyses médicales" },
  { value: 'examens', label: 'Examens spécialisés' },
]

export default function AdminServices() {
  const [departments, setDepartments] = useState(null)

  useEffect(() => {
    departmentsAdmin.list().then(setDepartments)
  }, [])

  if (!departments) return <Spinner />

  return (
    <CrudManager
      title="Services"
      crud={servicesAdmin}
      imageFolder="services"
      getTitle={(s) => getLocalizedField(s, 'name', 'fr')}
      getSubtitle={(s) => getLocalizedField(s, 'short_description', 'fr')}
      fields={[
        { name: 'name', localized: true, label: { fr: 'Nom', ar: 'الاسم' }, type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'category', label: 'Catégorie', type: 'select', options: categoryOptions },
        {
          name: 'department_id',
          label: 'Département',
          type: 'select',
          options: departments.map((d) => ({ value: d.id, label: getLocalizedField(d, 'name', 'fr') })),
        },
        { name: 'short_description', localized: true, label: { fr: 'Description courte', ar: 'وصف مختصر' }, type: 'textarea' },
        { name: 'preparation_info', localized: true, label: { fr: 'Préparation (optionnel)', ar: 'التحضير (اختياري)' }, type: 'textarea' },
        { name: 'requires_appointment', label: 'Rendez-vous requis', type: 'checkbox' },
        { name: 'image_path', label: 'Image (optionnel)', type: 'image' },
      ]}
    />
  )
}
