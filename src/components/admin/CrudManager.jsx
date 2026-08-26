import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button, EmptyState, Spinner } from '../ui'
import { GlassSheet } from '../glass'
import { AdminImageUpload } from './AdminImageUpload'

/**
 * Generic list + create/edit sheet for the simpler admin-managed tables
 * (departments, team, testimonials, faq, patient info, services). Keeps
 * every content table on one consistent editing pattern instead of
 * duplicating list/form boilerplate per page.
 */
export function CrudManager({ title, crud, fields, getTitle, getSubtitle, imageFolder = 'misc' }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {...} = edit
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true)
    try {
      setItems(await crud.list())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openNew() {
    const defaults = { active: true, order_index: items.length + 1 }
    fields.forEach((f) => {
      if (f.type === 'checkbox') defaults[f.name] = defaults[f.name] ?? false
    })
    setEditing(defaults)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editing.id) {
        await crud.update(editing.id, editing)
      } else {
        await crud.create(editing)
      }
      setEditing(null)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cet élément ?')) return
    try {
      await crud.remove(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        <Button size="sm" onClick={openNew}>
          <Plus size={16} /> Ajouter
        </Button>
      </div>

      {error ? <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <Spinner />
      ) : !items.length ? (
        <EmptyState title="Aucun élément pour le moment." />
      ) : (
        <div className="divide-y divide-line rounded-md border border-line bg-white">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{getTitle(item)}</p>
                {getSubtitle ? <p className="truncate text-sm text-ink-soft">{getSubtitle(item)}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!item.active ? (
                  <span className="rounded-pill bg-ink/5 px-2 py-0.5 text-xs text-ink-soft">Inactif</span>
                ) : null}
                <button
                  aria-label="Modifier"
                  onClick={() => setEditing(item)}
                  className="rounded-full p-2 text-ink-soft hover:bg-ink/5"
                >
                  <Pencil size={16} />
                </button>
                <button
                  aria-label="Supprimer"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <GlassSheet
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        side="right"
        title={editing?.id ? 'Modifier' : 'Ajouter'}
      >
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-medium text-ink">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    rows={3}
                    value={editing[field.name] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                  />
                ) : field.type === 'select' ? (
                  <select
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    value={editing[field.name] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                  >
                    <option value="">Sélectionner…</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={Boolean(editing[field.name])}
                    onChange={(e) => setEditing({ ...editing, [field.name]: e.target.checked })}
                  />
                ) : field.type === 'image' ? (
                  <AdminImageUpload
                    value={editing[field.name]}
                    onChange={(url) => setEditing({ ...editing, [field.name]: url })}
                    folder={imageFolder}
                  />
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    value={editing[field.name] ?? ''}
                    required={field.required}
                    onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                  />
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Ordre</label>
                <input
                  type="number"
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                  value={editing.order_index ?? 0}
                  onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
                />
              </div>
              <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={Boolean(editing.active)}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                />
                Actif
              </label>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Spinner size={16} /> : null}
              Enregistrer
            </Button>
          </form>
        ) : null}
      </GlassSheet>
    </div>
  )
}
