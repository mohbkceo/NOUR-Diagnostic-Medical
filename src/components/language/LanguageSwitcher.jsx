import { useLocale } from '../../i18n/LocaleProvider'

export function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale } = useLocale()
  return (
    <div className={`inline-flex shrink-0 items-center rounded-xl border border-slate-200/70 bg-white/65 p-0.5 text-xs font-semibold ${className}`} role="group" aria-label="Language / اللغة">
      <button type="button" lang="fr" dir="ltr" aria-label="Français" aria-pressed={locale === 'fr'} onClick={() => setLocale('fr')}
        className={`min-h-9 rounded-lg px-2 ${locale === 'fr' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50'}`}>FR</button>
      <button type="button" lang="ar" dir="rtl" aria-label="العربية" aria-pressed={locale === 'ar'} onClick={() => setLocale('ar')}
        className={`min-h-9 rounded-lg px-2 ${locale === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50'}`}>ع</button>
    </div>
  )
}
