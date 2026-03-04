import { historyEntries, getHistoryBySlug as getBySlug } from '~/data/history'

export function useHistory () {
  return {
    historyEntries,
    getHistoryBySlug: getBySlug,
  }
}
