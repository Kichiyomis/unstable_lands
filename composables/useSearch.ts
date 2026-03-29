import { characters } from '~/data/characters'
import { mechanics } from '~/data/mechanics'
import { historyEntries } from '~/data/history'
import { locations } from '~/data/locations'
import { worldEntries } from '~/data/world'
import { tradeGoods } from '~/data/goods'

export type SearchResultType =
  | 'character'
  | 'mechanic'
  | 'history'
  | 'location'
  | 'world'
  | 'goods'

export interface SearchResult {
  type: SearchResultType
  typeLabel: string
  title: string
  path: string
  snippet: string
}

function normalize (s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function stripHtml (html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function excerpt (text: string, query: string, maxLen: number = 120): string {
  const plain = stripHtml(text)
  const n = normalize(plain)
  const q = normalize(query)
  const i = n.indexOf(q)
  if (i < 0) return plain.slice(0, maxLen) + (plain.length > maxLen ? '…' : '')
  const start = Math.max(0, i - 40)
  const end = Math.min(plain.length, i + query.length + 80)
  const slice = plain.slice(start, end)
  return (start > 0 ? '…' : '') + slice + (end < plain.length ? '…' : '')
}

export function useSearch () {
  function search (query: string): SearchResult[] {
    const q = query.trim()
    if (!q) return []
    const nq = normalize(q)
    const results: SearchResult[] = []

    for (const c of characters) {
      const inName = normalize(c.name).includes(nq)
      const inSummary = normalize(c.summary).includes(nq)
      const inDesc = c.description && normalize(stripHtml(c.description)).includes(nq)
      if (inName || inSummary || inDesc) {
        results.push({
          type: 'character',
          typeLabel: 'Персонаж',
          title: c.name,
          path: `/characters/${c.slug}`,
          snippet: inName ? c.summary : excerpt((c.description || c.summary), q),
        })
      }
    }

    for (const w of worldEntries) {
      const inName = normalize(w.name).includes(nq)
      const inShort = normalize(w.short).includes(nq)
      const inDesc = normalize(stripHtml(w.description)).includes(nq)
      if (inName || inShort || inDesc) {
        results.push({
          type: 'world',
          typeLabel: 'Мир',
          title: w.name,
          path: `/world/${w.slug}`,
          snippet: inName ? w.short : excerpt(w.description, q),
        })
      }
    }

    for (const m of mechanics) {
      const inName = normalize(m.name).includes(nq)
      const inShort = normalize(m.short).includes(nq)
      const inDesc = normalize(stripHtml(m.description)).includes(nq)
      if (inName || inShort || inDesc) {
        results.push({
          type: 'mechanic',
          typeLabel: 'Механика',
          title: m.name,
          path: `/mechanics/${m.slug}`,
          snippet: inName ? m.short : excerpt(m.description, q),
        })
      }
    }

    for (const e of historyEntries) {
      const inName = normalize(e.name).includes(nq)
      const inShort = normalize(e.short).includes(nq)
      const inDesc = normalize(stripHtml(e.description)).includes(nq)
      if (inName || inShort || inDesc) {
        results.push({
          type: 'history',
          typeLabel: 'История',
          title: e.name,
          path: `/history/${e.slug}`,
          snippet: inName ? e.short : excerpt(e.description, q),
        })
      }
    }

    for (const l of locations) {
      const inName = normalize(l.name).includes(nq)
      const inShort = normalize(l.short).includes(nq)
      const inDesc = normalize(stripHtml(l.description)).includes(nq)
      if (inName || inShort || inDesc) {
        results.push({
          type: 'location',
          typeLabel: 'Локация',
          title: l.name,
          path: `/locations/${l.slug}`,
          snippet: inName ? l.short : excerpt(l.description, q),
        })
      }
    }

    for (const g of tradeGoods) {
      const inName = normalize(g.name).includes(nq)
      const inEffect = normalize(g.effect).includes(nq)
      const inActivation = normalize(g.activation).includes(nq)
      if (inName || inEffect || inActivation) {
        results.push({
          type: 'goods',
          typeLabel: 'Товар',
          title: g.name,
          path: `/goods#item-${g.id}`,
          snippet: inName ? g.effect.slice(0, 120) + (g.effect.length > 120 ? '…' : '') : excerpt(g.effect, q),
        })
      }
    }

    return results
  }

  return { search }
}
