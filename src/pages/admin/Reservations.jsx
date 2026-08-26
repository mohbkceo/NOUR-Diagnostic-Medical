import { useEffect, useState } from 'react'
import { Phone, MessageCircle, FileText, Search } from 'lucide-react'
import { Badge, Button, EmptyState, Input, Select, Spinner } from '../../components/ui'
import { GlassSheet } from '../../components/glass'
import { listReservations, updateReservation, getReservationDocumentUrl } from '../../services/reservations'

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'new', label: 'Nouvelle' },
  { value: 'reviewing', label: 'En cours' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'completed', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
]

export default function AdminReservations() {
  const [reservations, setReservations] = useState(null)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [documentUrl, setDocumentUrl] = useState(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)

  async function refresh() {
    try {
      setReservations(await listReservations({ status, search: search || undefined }))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    if (selected) {
      setNotes(selected.admin_notes ?? '')
      setDocumentUrl(null)
      if (selected.document_path) {
        getReservationDocumentUrl(selected.document_path).then(setDocumentUrl).catch(() => {})
      }
    }
  }, [selected])

  async function applyStatus(newStatus) {
    const updated = await updateReservation(selected.id, { status: newStatus })
    setSelected(updated)
    refresh()
  }

  async function saveNotes() {
    const updated = await updateReservation(selected.id, { admin_notes: notes })
    setSelected(updated)
    refresh()
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!reservations) return <Spinner />

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-ink">Rendez-vous</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <Input
            className="pl-9"
            placeholder="Rechercher un nom ou un téléphone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && refresh()}
          />
        </div>
        <Select className="max-w-[220px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {!reservations.length ? (
        <EmptyState title="Aucun rendez-vous" />
      ) : (
        <div className="overflow-x-auto rounded-md border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="cursor-pointer hover:bg-surface-muted"
                  onClick={() => setSelected(r)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{r.full_name}</p>
                    <p className="text-ink-soft">{r.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{r.service?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {r.preferred_date} · {r.preferred_time}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={r.status}>{statusOptions.find((o) => o.value === r.status)?.label}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GlassSheet open={Boolean(selected)} onClose={() => setSelected(null)} side="right" title="Détail du rendez-vous">
        {selected ? (
          <div className="space-y-5 text-sm">
            <div>
              <p className="text-ink-soft">Patient</p>
              <p className="font-medium text-ink">{selected.full_name}</p>
            </div>
            <div className="flex gap-4">
              <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-primary">
                <Phone size={14} /> {selected.phone}
              </a>
              <a
                href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-primary"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
            <div>
              <p className="text-ink-soft">Service</p>
              <p className="font-medium text-ink">{selected.service?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-ink-soft">Date &amp; heure souhaitées</p>
              <p className="font-medium text-ink">
                {selected.preferred_date} à {selected.preferred_time}
              </p>
            </div>
            {selected.message ? (
              <div>
                <p className="text-ink-soft">Message</p>
                <p className="text-ink">{selected.message}</p>
              </div>
            ) : null}
            {selected.document_path ? (
              <div>
                <p className="mb-1 text-ink-soft">Document joint</p>
                {documentUrl ? (
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-fit items-center gap-1.5 rounded-md border border-line px-3 py-2 text-primary"
                  >
                    <FileText size={14} /> Voir le document
                  </a>
                ) : (
                  <Spinner size={14} />
                )}
              </div>
            ) : null}

            <div>
              <p className="mb-2 text-ink-soft">Statut</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions
                  .filter((o) => o.value !== 'all')
                  .map((o) => (
                    <Button
                      key={o.value}
                      size="sm"
                      variant={selected.status === o.value ? 'primary' : 'outline'}
                      onClick={() => applyStatus(o.value)}
                    >
                      {o.label}
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-ink-soft">Notes internes</p>
              <textarea
                className="w-full rounded-md border border-line px-3 py-2"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button size="sm" variant="outline" className="mt-2" onClick={saveNotes}>
                Enregistrer la note
              </Button>
            </div>

            <p className="text-xs text-ink-soft">
              Créé le {new Date(selected.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
        ) : null}
      </GlassSheet>
    </div>
  )
}
