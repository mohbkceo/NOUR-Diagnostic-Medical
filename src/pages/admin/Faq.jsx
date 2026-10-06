import { getLocalizedField } from '../../i18n/localizedField'
import { CrudManager } from '../../components/admin/CrudManager'
import { faqAdmin } from '../../services/admin'

export default function AdminFaq() {
  return (
    <CrudManager
      title="FAQ"
      crud={faqAdmin}
      getTitle={(f) => getLocalizedField(f, 'question', 'fr')}
      getSubtitle={(f) => f.category}
      fields={[
        { name: 'question', localized: true, label: { fr: 'Question', ar: 'السؤال' }, type: 'text', required: true },
        { name: 'answer', localized: true, label: { fr: 'Réponse', ar: 'الإجابة' }, type: 'textarea', required: true },
        { name: 'category', label: 'Catégorie (optionnel)', type: 'text' },
      ]}
    />
  )
}
