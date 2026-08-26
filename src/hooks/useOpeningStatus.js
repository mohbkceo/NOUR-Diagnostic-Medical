import { useSupabaseData } from './useSupabaseData'
import { contentQueries } from '../services/content'
import { placeholderOpeningHours } from '../data/placeholders'
import { computeOpenStatus } from '../utils/openingHours'

export function useOpeningStatus() {
  const { data: hours } = useSupabaseData(contentQueries.openingHours, [], placeholderOpeningHours)
  const { data: exceptions } = useSupabaseData(contentQueries.openingHoursExceptions, [], [])

  return {
    hours: hours ?? placeholderOpeningHours,
    status: computeOpenStatus(hours ?? placeholderOpeningHours, exceptions ?? []),
  }
}
