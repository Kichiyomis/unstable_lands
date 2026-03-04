import { characters } from '~/data/characters'
import { mechanics } from '~/data/mechanics'
import { historyEntries } from '~/data/history'
import { locations } from '~/data/locations'
import { worldEntries } from '~/data/world'

export interface WikiEntryLink {
  path: string
  title: string
  typeLabel: string
}

function shuffle<T> (arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useRandomWikiEntries (count: number = 5) {
  const all: WikiEntryLink[] = [
    ...worldEntries.map(w => ({ path: `/world/${w.slug}`, title: w.name, typeLabel: 'Мир' })),
    ...characters.map(c => ({ path: `/characters/${c.slug}`, title: c.name, typeLabel: 'Персонаж' })),
    ...mechanics.map(m => ({ path: `/mechanics/${m.slug}`, title: m.name, typeLabel: 'Механика' })),
    ...historyEntries.map(e => ({ path: `/history/${e.slug}`, title: e.name, typeLabel: 'История' })),
    ...locations.map(l => ({ path: `/locations/${l.slug}`, title: l.name, typeLabel: 'Локация' })),
  ]
  const random = shuffle(all).slice(0, count)
  return random
}
