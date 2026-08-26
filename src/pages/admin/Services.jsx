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
      getTitle={(s) => s.name}
      getSubtitle={(s) => s.short_description}
      fields={[
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'category', label: 'Catégorie', type: 'select', options: categoryOptions },
        {
          name: 'department_id',
          label: 'Département',
          type: 'select',
          options: departments.map((d) => ({ value: d.id, label: d.name })),
        },
        { name: 'short_description', label: 'Description courte', type: 'textarea' },
        { name: 'preparation_info', label: 'Préparation (optionnel)', type: 'textarea' },
        { name: 'requires_appointment', label: 'Rendez-vous requis', type: 'checkbox' },
        { name: 'image_path', label: 'Image (optionnel)', type: 'image' },
      ]}
    />
  )
}
