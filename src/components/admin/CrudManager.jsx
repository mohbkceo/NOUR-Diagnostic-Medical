import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button, EmptyState, Spinner } from '../ui'
import { GlassSheet } from '../glass'
import { AdminImageUpload } from './AdminImageUpload'
import { LanguageTabs } from './LanguageTabs'

function EditorField({ field, value, onChange, imageFolder, locale }) {
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const label = typeof field.label === 'object' ? field.label[locale] : field.label
  const common = { id: field.name, value: value ?? '', onChange: (event) => onChange(event.target.value),
    lang: locale, dir: direction, required: Boolean(field.required && locale !== 'ar') }
  return <div>
    <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
    {field.type === 'textarea' ? <textarea {...common} rows={3} className="w-full rounded-md border border-line px-3 py-2 text-sm" />
      : field.type === 'select' ? <select {...common} className="w-full rounded-md border border-line px-3 py-2 text-sm">
        <option value="">Sélectionner…</option>
        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      : field.type === 'checkbox' ? <input id={field.name} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
      : field.type === 'image' ? <AdminImageUpload value={value} onChange={onChange} folder={imageFolder} />
      : <input {...common} type={field.type === 'number' ? 'number' : 'text'} className="w-full rounded-md border border-line px-3 py-2 text-sm" />}
  </div>
}

export function CrudManager({ title, crud, fields, getTitle, getSubtitle, imageFolder = 'misc' }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [language, setLanguage] = useState('fr')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const localized = fields.filter((field) => field.localized)
  const shared = fields.filter((field) => !field.localized)

  async function refresh() {
    setLoading(true)
    try { setItems(await crud.list()); setError(null) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openNew() {
    const defaults = { active: true, order_index: items.length + 1 }
    fields.forEach((field) => { if (field.type === 'checkbox') defaults[field.name] = false })
    setLanguage('fr')
    setEditing(defaults)
  }

  async function handleSave(event) {
    event.preventDefault()
    const missingFrench = localized.find((field) => field.required && !(editing[`${field.name}_fr`] ?? editing[field.name] ?? '').trim())
    if (missingFrench) {
      setLanguage('fr')
      setError(`Le champ « ${typeof missingFrench.label === 'object' ? missingFrench.label.fr : missingFrench.label} » est requis en français.`)
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (editing.id) await crud.update(editing.id, editing)
      else await crud.create(editing)
      setEditing(null)
      await refresh()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cet élément ?')) return
    try { await crud.remove(id); await refresh() }
    catch (err) { setError(err.message) }
  }

  function renderField(field, locale = 'fr') {
    const name = field.localized ? `${field.name}_${locale}` : field.name
    const value = editing[name] ?? (field.localized && locale === 'fr' ? editing[field.name] : undefined)
    return <EditorField key={name} field={{ ...field, name }} value={value}
      onChange={(next) => setEditing({ ...editing, [name]: next })} imageFolder={imageFolder} locale={locale} />
  }

  return <div>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      <Button size="sm" onClick={openNew}><Plus size={16} /> Ajouter</Button>
    </div>
    {error ? <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
    {loading ? <Spinner /> : !items.length ? <EmptyState title="Aucun élément pour le moment." />
      : <div className="divide-y divide-line rounded-md border border-line bg-white">{items.map((item) =>
        <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0"><p className="truncate font-medium text-ink">{getTitle(item)}</p>
            {getSubtitle ? <p className="truncate text-sm text-ink-soft">{getSubtitle(item)}</p> : null}</div>
          <div className="flex shrink-0 items-center gap-2">
            {!item.active ? <span className="rounded-pill bg-ink/5 px-2 py-0.5 text-xs text-ink-soft">Inactif</span> : null}
            <button type="button" aria-label="Modifier" onClick={() => { setLanguage('fr'); setEditing(item) }} className="rounded-full p-2 text-ink-soft hover:bg-ink/5"><Pencil size={16} /></button>
            <button type="button" aria-label="Supprimer" onClick={() => handleDelete(item.id)} className="rounded-full p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        </div>)}</div>}
    <GlassSheet open={Boolean(editing)} onClose={() => setEditing(null)} side="right" title={editing?.id ? 'Modifier' : 'Ajouter'}>
      {editing ? <form onSubmit={handleSave} className="space-y-5">
        {localized.length ? <section>
          <h3 className="mb-2 text-sm font-semibold text-ink">Contenu par langue</h3>
          <LanguageTabs value={language} onChange={setLanguage} />
          <div className="space-y-4" lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>{localized.map((field) => renderField(field, language))}</div>
        </section> : null}
        <section className="space-y-4 border-t border-line pt-4">
          {localized.length ? <h3 className="text-sm font-semibold text-ink">Paramètres communs</h3> : null}
          {shared.map((field) => renderField(field))}
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-medium text-ink">Ordre<input type="number" className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" value={editing.order_index ?? 0} onChange={(event) => setEditing({ ...editing, order_index: Number(event.target.value) })} /></label>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink"><input type="checkbox" checked={Boolean(editing.active)} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} />Actif</label>
          </div>
        </section>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={saving}>{saving ? <Spinner size={16} /> : null} Enregistrer</Button>
      </form> : null}
    </GlassSheet>
  </div>
}
