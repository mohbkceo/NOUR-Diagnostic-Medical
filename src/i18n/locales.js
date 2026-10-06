export const supportedLocales = ['fr', 'ar']

export function formatWeekday(weekday, locale = 'fr') {
  // 2023-01-01 was a Sunday. Keep database weekday 0-6 unchanged.
  const date = new Date(Date.UTC(2023, 0, 1 + weekday))
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', { weekday: 'long', timeZone: 'UTC' }).format(date)
}
