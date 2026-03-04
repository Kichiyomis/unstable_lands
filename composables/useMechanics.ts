import { mechanics, getMechanicBySlug as getBySlug } from '~/data/mechanics'

export function useMechanics () {
  return {
    mechanics,
    getMechanicBySlug: getBySlug,
  }
}
