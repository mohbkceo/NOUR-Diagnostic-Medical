import { CrudManager } from '../../components/admin/CrudManager'
import { faqAdmin } from '../../services/admin'

export default function AdminFaq() {
  return (
    <CrudManager
      title="FAQ"
      crud={faqAdmin}
      getTitle={(f) => f.question}
      getSubtitle={(f) => f.category}
      fields={[
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'answer', label: 'Réponse', type: 'textarea', required: true },
        { name: 'category', label: 'Catégorie (optionnel)', type: 'text' },
      ]}
    />
  )
}
