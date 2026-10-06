import { useEffect, useState } from 'react'
import { Button, Spinner } from '../../components/ui'
import { LanguageTabs } from '../../components/admin/LanguageTabs'
import { fr } from '../../content/fr'
import { ar } from '../../content/ar'
import { listSiteContent, saveSiteContent } from '../../services/admin'

const groups = {
  brand: 'Identité', seo: 'Titre et description', nav: 'Navigation', hero: 'Accueil', services: 'Services',
  whyNour: 'Pourquoi NOUR', departments: 'Départements', about: 'À propos',
  team: 'Équipe', patientInfo: 'Informations patients', howItWorks: 'Parcours patient',
  testimonials: 'Témoignages', faq: 'FAQ', reservation: 'Rendez-vous',
  contact: 'Contact', footer: 'Pied de page', common: 'Messages et états',
}

function flatten(value, prefix = '') {
  if (typeof value === 'string') return [[prefix, value]]
  return Object.entries(value).flatMap(([key, item]) => flatten(item, prefix ? `${prefix}.${key}` : key))
}

const entries = flatten(fr)
const translations = { fr: Object.fromEntries(entries), ar: Object.fromEntries(flatten(ar)) }

function labelFor(key) {
  const parts = key.split('.')
  const last = parts.at(-1)
  const parent = parts.at(-2)
  const labels = { name: 'Nom', tagline: 'Signature', title: 'Titre', text: 'Texte',
    intro: 'Introduction', eyebrow: 'Accroche', cta: 'Bouton principal',
    ctaSecondary: 'Bouton secondaire', description: 'Description', rights: 'Droits',
    question: 'Question', answer: 'Réponse', add: 'Ajouter', remove: 'Retirer',
    checking: 'Vérification', hint: 'Aide', links: 'Liens' }
  const readable = (text) => labels[text] ?? text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')
  if (/^\d+$/.test(parent)) {
    const kind = parts.includes('steps') ? 'Étape' : parts.includes('points') ? 'Atout' : 'Ligne'
    return `${kind} ${Number(parent) + 1} — ${readable(last)}`
  }
  if (/^\d+$/.test(last)) return `Ligne ${Number(last) + 1}`
  return readable(last)
}

export default function AdminSiteContent() {
  const [rows, setRows] = useState({})
  const [language, setLanguage] = useState('fr')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    listSiteContent().then((data) => setRows(Object.fromEntries(data.map((row) => [row.key, row]))))
      .catch((error) => setMessage(error.message))
  }, [])

  async function saveGroup(group) {
    setSaving(true)
    setMessage('')
    try {
      const values = entries.filter(([key]) => key.startsWith(`${group}.`)).map(([key]) => ({
        key, value_fr: rows[key]?.value_fr ?? null, value_ar: rows[key]?.value_ar ?? null,
      }))
      await saveSiteContent(values)
      setMessage('Contenu enregistré.')
    } catch (error) { setMessage(error.message) }
    finally { setSaving(false) }
  }

  return <div className="space-y-6">
    <h1 className="text-xl font-semibold text-ink">Contenu du site</h1>
    <p className="text-sm text-ink-soft">Modifiez les textes affichés sur le site. Un champ vide utilise le texte de référence dans cette langue.</p>
    <LanguageTabs value={language} onChange={setLanguage} />
    {message ? <p role="status" className="rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-700">{message}</p> : null}
    {Object.entries(groups).map(([group, title]) => <section key={group} className="rounded-lg border border-line bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2" lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {entries.filter(([key]) => key.startsWith(`${group}.`)).map(([key]) => {
          const fallback = translations[language][key] ?? translations.fr[key]
          const isLong = fallback.length > 80
          const common = { value: rows[key]?.[`value_${language}`] ?? '', placeholder: fallback,
            onChange: (event) => setRows((previous) => ({ ...previous, [key]: { ...previous[key], key, [`value_${language}`]: event.target.value } })),
            lang: language, dir: language === 'ar' ? 'rtl' : 'ltr', className: 'w-full rounded-md border border-line px-3 py-2 text-sm' }
          return <label key={key} className="block text-sm font-medium text-ink">
            <span className="mb-1.5 block">{labelFor(key)}</span>
            {isLong ? <textarea {...common} rows={3} /> : <input {...common} type="text" />}
            <span className="mt-1 block text-xs font-normal text-ink-soft">{fallback}</span>
          </label>
        })}
      </div>
      <Button type="button" className="mt-5" disabled={saving} onClick={() => saveGroup(group)}>{saving ? <Spinner size={16} /> : null} Enregistrer {title}</Button>
    </section>)}
  </div>
}
