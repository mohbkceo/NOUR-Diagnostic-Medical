import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, EmptyState, Spinner } from '../../components/ui'
import { listReservations } from '../../services/reservations'

const statusOrder = ['new', 'reviewing', 'confirmed', 'completed', 'cancelled']
const statusLabels = {
  new: 'Nouvelles',
  reviewing: 'En cours',
  confirmed: 'Confirmées',
  completed: 'Terminées',
  cancelled: 'Annulées',
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    listReservations().then(setReservations).catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!reservations) return <Spinner />

  const counts = statusOrder.reduce((acc, status) => {
    acc[status] = reservations.filter((r) => r.status === status).length
    return acc
  }, {})

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-ink">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statusOrder.map((status) => (
          <div key={status} className="rounded-md border border-line bg-white p-4">
            <p className="text-2xl font-semibold text-ink">{counts[status]}</p>
            <p className="text-sm text-ink-soft">{statusLabels[status]}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-10 font-medium text-ink">Rendez-vous récents</h2>
      {!reservations.length ? (
        <EmptyState title="Aucun rendez-vous" />
      ) : (
        <div className="divide-y divide-line rounded-md border border-line bg-white">
          {reservations.slice(0, 8).map((r) => (
            <Link
              key={r.id}
              to="/admin/reservations"
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-surface-muted"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{r.full_name}</p>
                <p className="truncate text-sm text-ink-soft">
                  {r.service?.name ?? '—'} · {r.preferred_date}
                </p>
              </div>
              <Badge tone={r.status}>{statusLabels[r.status]}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
