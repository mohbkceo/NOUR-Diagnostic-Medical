import { CrudManager } from '../../components/admin/CrudManager'
import { teamAdmin } from '../../services/admin'

export default function AdminTeam() {
  return (
    <CrudManager
      title="Équipe médicale"
      crud={teamAdmin}
      imageFolder="team"
      getTitle={(m) => m.name}
      getSubtitle={(m) => m.specialty}
      fields={[
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'specialty', label: 'Spécialité', type: 'text', required: true },
        { name: 'title', label: 'Titre / rôle', type: 'text' },
        { name: 'bio', label: 'Biographie (optionnel)', type: 'textarea' },
        { name: 'photo_path', label: 'Photo', type: 'image' },
      ]}
    />
  )
}
