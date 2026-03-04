import { characters, getCharacterBySlug as getBySlug } from '~/data/characters'

export function useCharacters () {
  return {
    characters,
    getCharacterBySlug: getBySlug,
  }
}
