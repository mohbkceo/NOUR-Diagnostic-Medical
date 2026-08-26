import { weekdayLabels } from '../styles/tokens'

// hours: array of { weekday: 0-6 (0=Sunday), open_time: 'HH:MM', close_time: 'HH:MM', is_closed: bool }
// exceptions: array of { date: 'YYYY-MM-DD', is_closed: bool, open_time, close_time }
export function computeOpenStatus(hours = [], exceptions = [], now = new Date()) {
  const todayISO = now.toISOString().slice(0, 10)
  const exception = exceptions.find((e) => e.date === todayISO)

  const todayRule = hours.find((h) => h.weekday === now.getDay())
  const rule = exception ?? todayRule

  if (!rule || rule.is_closed) {
    return { isOpen: false, label: 'Fermé', todayLabel: weekdayLabels[now.getDay()] }
  }

  const [openH, openM] = (rule.open_time ?? '00:00').split(':').map(Number)
  const [closeH, closeM] = (rule.close_time ?? '00:00').split(':').map(Number)
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  const isOpen = minutesNow >= openMinutes && minutesNow < closeMinutes

  return {
    isOpen,
    label: isOpen ? 'Ouvert' : 'Fermé',
    todayLabel: weekdayLabels[now.getDay()],
    openTime: rule.open_time,
    closeTime: rule.close_time,
  }
}
