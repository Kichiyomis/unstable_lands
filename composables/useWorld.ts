import { worldEntries, getWorldBySlug as getBySlug } from '~/data/world'

export function useWorld () {
  return {
    worldEntries,
    getWorldBySlug: getBySlug,
  }
}
