import { useEffect, useState } from 'react'
import { Button, Spinner } from '../../components/ui'
import { AdminImageUpload } from '../../components/admin/AdminImageUpload'
import { LanguageTabs } from '../../components/admin/LanguageTabs'
import {
  getSiteSettings,
  updateSiteSettings,
  getAboutContent,
  updateAboutContent,
  listOpeningHours,
  upsertOpeningHour,
} from '../../services/admin'
import { weekdayLabels } from '../../styles/tokens'

function TextField({ label, value, onChange, placeholder, lang = 'fr' }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        className="w-full rounded-md border border-line px-3 py-2 text-sm"
        value={value ?? ''}
        placeholder={placeholder}
        lang={lang}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [about, setAbout] = useState(null)
  const [hours, setHours] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [contentLanguage, setContentLanguage] = useState('fr')

  useEffect(() => {
    getSiteSettings().then(setSettings)
    getAboutContent().then(setAbout)
    listOpeningHours().then(setHours)
  }, [])

  async function saveSettings() {
    setSaving(true)
    setMessage(null)
    try {
      setSettings(await updateSiteSettings(settings))
      setMessage('Paramètres enregistrés.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function saveAbout() {
    if (!(about.title_fr ?? about.title ?? '').trim()) {
      setMessage('Le titre français est requis.')
      setContentLanguage('fr')
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      setAbout(await updateAboutContent(about))
      setMessage('Section « À propos » enregistrée.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function saveHour(hour) {
    const updated = await upsertOpeningHour(hour)
    setHours((prev) => prev.map((h) => (h.weekday === updated.weekday ? updated : h)))
  }

  if (!settings || !about || !hours) return <Spinner />

  return (
    <div className="space-y-12">
      <h1 className="text-xl font-semibold text-ink">Paramètres</h1>

      {message ? <p className="rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-700">{message}</p> : null}

      <section>
        <h2 className="mb-4 font-medium text-ink">Informations générales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nom du site" value={settings.site_name} onChange={(v) => setSettings({ ...settings, site_name: v })} />
          <TextField label="Téléphone" value={settings.phone} onChange={(v) => setSettings({ ...settings, phone: v })} />
          <TextField label="Email" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
          <TextField label="WhatsApp (avec indicatif)" value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
          <div className="sm:col-span-2">
            <LanguageTabs value={contentLanguage} onChange={setContentLanguage} />
            <TextField label="Adresse" lang={contentLanguage} value={settings[`address_${contentLanguage}`] ?? (contentLanguage === 'fr' ? settings.address : '')} onChange={(v) => setSettings({ ...settings, [`address_${contentLanguage}`]: v })} />
          </div>
          <TextField label="Lien Google Maps" value={settings.address_map_url} onChange={(v) => setSettings({ ...settings, address_map_url: v })} />
          <TextField label="Facebook" value={settings.facebook} onChange={(v) => setSettings({ ...settings, facebook: v })} />
          <TextField label="Instagram" value={settings.instagram} onChange={(v) => setSettings({ ...settings, instagram: v })} />
          <TextField label="TikTok" value={settings.tiktok} onChange={(v) => setSettings({ ...settings, tiktok: v })} />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-ink">Logo</label>
          <AdminImageUpload value={settings.logo_url} onChange={(url) => setSettings({ ...settings, logo_url: url })} folder="brand" />
        </div>
        <Button className="mt-4" onClick={saveSettings} disabled={saving}>
          {saving ? <Spinner size={16} /> : null} Enregistrer
        </Button>
      </section>

      <section>
        <h2 className="mb-4 font-medium text-ink">À propos</h2>
        <div className="space-y-4">
          <LanguageTabs value={contentLanguage} onChange={setContentLanguage} />
          <TextField label="Titre" lang={contentLanguage} value={about[`title_${contentLanguage}`] ?? (contentLanguage === 'fr' ? about.title : '')} onChange={(v) => setAbout({ ...about, [`title_${contentLanguage}`]: v })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Contenu</label>
            <textarea
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
              lang={contentLanguage}
              dir={contentLanguage === 'ar' ? 'rtl' : 'ltr'}
              rows={4}
              value={about[`content_${contentLanguage}`] ?? (contentLanguage === 'fr' ? about.content ?? '' : '')}
              onChange={(e) => setAbout({ ...about, [`content_${contentLanguage}`]: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">Chiffres et repères</p>
            {(about.facts_fr ?? about.facts ?? []).map((_, index) => {
              const facts = about[`facts_${contentLanguage}`] ?? (contentLanguage === 'fr' ? about.facts ?? [] : [])
              const fact = facts[index] ?? {}
              const change = (field, value) => {
                const next = [...facts]
                next[index] = { ...fact, [field]: value }
                setAbout({ ...about, [`facts_${contentLanguage}`]: next })
              }
              return <div key={index} className="grid gap-3 sm:grid-cols-2" lang={contentLanguage} dir={contentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <TextField label={`Libellé ${index + 1}`} lang={contentLanguage} value={fact.label ?? ''} onChange={(value) => change('label', value)} />
                <TextField label={`Valeur ${index + 1}`} lang={contentLanguage} value={fact.value ?? ''} onChange={(value) => change('value', value)} />
                <button type="button" className="text-start text-xs text-red-600" onClick={() => setAbout({ ...about,
                  facts_fr: (about.facts_fr ?? about.facts ?? []).filter((_, itemIndex) => itemIndex !== index),
                  facts_ar: (about.facts_ar ?? []).filter((_, itemIndex) => itemIndex !== index),
                })}>Supprimer ce repère</button>
              </div>
            })}
            <Button type="button" variant="outline" size="sm" onClick={() => {
              const french = [...(about.facts_fr ?? about.facts ?? []), { label: '', value: '' }]
              setAbout({ ...about, facts_fr: french })
            }}>Ajouter un repère</Button>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Image</label>
            <AdminImageUpload value={about.image_path} onChange={(url) => setAbout({ ...about, image_path: url })} folder="about" />
          </div>
        </div>
        <Button className="mt-4" onClick={saveAbout} disabled={saving}>
          {saving ? <Spinner size={16} /> : null} Enregistrer
        </Button>
      </section>

      <section>
        <h2 className="mb-4 font-medium text-ink">Horaires d’ouverture</h2>
        <div className="divide-y divide-line rounded-md border border-line bg-white">
          {hours.map((hour) => (
            <div key={hour.weekday} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="w-28 text-sm font-medium text-ink">{weekdayLabels[hour.weekday]}</span>
              <label className="flex items-center gap-1.5 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={hour.is_closed}
                  onChange={(e) => saveHour({ ...hour, is_closed: e.target.checked })}
                />
                Fermé
              </label>
              {!hour.is_closed ? (
                <>
                  <input
                    type="time"
                    className="rounded-md border border-line px-2 py-1 text-sm"
                    value={hour.open_time ?? ''}
                    onChange={(e) => saveHour({ ...hour, open_time: e.target.value })}
                  />
                  <span className="text-ink-soft">–</span>
                  <input
                    type="time"
                    className="rounded-md border border-line px-2 py-1 text-sm"
                    value={hour.close_time ?? ''}
                    onChange={(e) => saveHour({ ...hour, close_time: e.target.value })}
                  />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
