import { getLocalizedField } from '../../i18n/localizedField'
import { CrudManager } from '../../components/admin/CrudManager'
import { teamAdmin } from '../../services/admin'

export default function AdminTeam() {
  return (
    <CrudManager
      title="Équipe médicale"
      crud={teamAdmin}
      imageFolder="team"
      getTitle={(m) => m.name}
      getSubtitle={(m) => getLocalizedField(m, 'specialty', 'fr')}
      fields={[
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'specialty', localized: true, label: { fr: 'Spécialité', ar: 'التخصص' }, type: 'text', required: true },
        { name: 'title', localized: true, label: { fr: 'Titre / rôle', ar: 'المسمى الوظيفي' }, type: 'text' },
        { name: 'bio', localized: true, label: { fr: 'Biographie (optionnel)', ar: 'السيرة الذاتية (اختياري)' }, type: 'textarea' },
        { name: 'photo_path', label: 'Photo', type: 'image' },
      ]}
    />
  )
}
