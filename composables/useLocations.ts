import { locations, getLocationBySlug as getBySlug } from '~/data/locations'

export function useLocations () {
  return {
    locations,
    getLocationBySlug: getBySlug,
  }
}
