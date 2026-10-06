export function LanguageTabs({ value, onChange }) {
  return <div className="mb-4 inline-flex rounded-md border border-line p-1" role="tablist" aria-label="Langue du contenu">
    <button type="button" role="tab" aria-selected={value === 'fr'} onClick={() => onChange('fr')}
      className={`rounded px-3 py-2 text-sm ${value === 'fr' ? 'bg-primary text-white' : 'text-ink-soft'}`}>Français</button>
    <button type="button" role="tab" aria-selected={value === 'ar'} onClick={() => onChange('ar')}
      className={`rounded px-3 py-2 text-sm ${value === 'ar' ? 'bg-primary text-white' : 'text-ink-soft'}`}>العربية</button>
  </div>
}
