import { useSupabaseData } from './useSupabaseData'
import { contentQueries } from '../services/content'
import { placeholderSiteSettings } from '../data/placeholders'

export function useSiteSettings() {
  const { data, loading } = useSupabaseData(contentQueries.siteSettings, [], placeholderSiteSettings)
  return { settings: data ?? placeholderSiteSettings, loading }
}
