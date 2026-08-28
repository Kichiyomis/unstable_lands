import Fuse from 'fuse.js'
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
  slug?: string
  haystack?: string
}

const CYR_TO_LAT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

function translit (value: string): string {
  return value.toLowerCase().split('').map(ch => CYR_TO_LAT[ch] ?? ch).join('')
}

function stripHtml (html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function excerpt (text: string, query: string, maxLen: number = 120): string {
  const plain = stripHtml(text)
  const q = query.toLowerCase()
  const i = plain.toLowerCase().indexOf(q)
  if (i < 0) return plain.slice(0, maxLen) + (plain.length > maxLen ? '…' : '')
  const start = Math.max(0, i - 40)
  const end = Math.min(plain.length, i + query.length + 80)
  const slice = plain.slice(start, end)
  return (start > 0 ? '…' : '') + slice + (end < plain.length ? '…' : '')
}

function buildIndex (): SearchResult[] {
  const results: SearchResult[] = []

  for (const c of characters) {
    const body = [c.description, c.appearance, c.biography, c.summary].filter(Boolean).join(' ')
    results.push({
      type: 'character',
      typeLabel: 'Персонаж',
      title: c.name,
      slug: c.slug,
      path: `/characters/${c.slug}`,
      snippet: c.summary,
      haystack: [c.name, c.slug, c.role, c.status, c.summary, stripHtml(body).slice(0, 400)].filter(Boolean).join(' '),
    })
  }
  for (const w of worldEntries) {
    results.push({
      type: 'world',
      typeLabel: 'Мир',
      title: w.name,
      slug: w.slug,
      path: `/world/${w.slug}`,
      snippet: w.short,
      haystack: stripHtml([w.name, w.slug, w.short, w.description.slice(0, 400)].join(' ')),
    })
  }
  for (const m of mechanics) {
    results.push({
      type: 'mechanic',
      typeLabel: 'Механика',
      title: m.name,
      slug: m.slug,
      path: `/mechanics/${m.slug}`,
      snippet: m.short,
      haystack: stripHtml([m.name, m.slug, m.short, m.description.slice(0, 400)].join(' ')),
    })
  }
  for (const e of historyEntries) {
    results.push({
      type: 'history',
      typeLabel: 'История',
      title: e.name,
      slug: e.slug,
      path: `/history/${e.slug}`,
      snippet: e.short,
      haystack: stripHtml([e.name, e.slug, e.years, e.short, e.description.slice(0, 400)].filter(Boolean).join(' ')),
    })
  }
  for (const l of locations) {
    results.push({
      type: 'location',
      typeLabel: 'Локация',
      title: l.name,
      slug: l.slug,
      path: `/locations/${l.slug}`,
      snippet: l.short,
      haystack: stripHtml([l.name, l.slug, l.type, l.short, l.description.slice(0, 400)].filter(Boolean).join(' ')),
    })
  }
  for (const g of tradeGoods) {
    results.push({
      type: 'goods',
      typeLabel: 'Товар',
      title: g.name,
      path: `/goods#item-${g.id}`,
      snippet: g.effect.slice(0, 120) + (g.effect.length > 120 ? '…' : ''),
      haystack: [g.name, g.effect, g.activation, g.rarity].join(' '),
    })
  }

  return results
}

let catalog: SearchResult[] = []
let fuse: Fuse<SearchResult> | null = null

export function getSearchCatalog (): SearchResult[] {
  if (!catalog.length) catalog = buildIndex()
  return catalog
}

function getFuse () {
  if (!fuse) {
    fuse = new Fuse(getSearchCatalog(), {
      keys: [
        { name: 'title', weight: 0.45 },
        { name: 'slug', weight: 0.35 },
        { name: 'haystack', weight: 0.2 },
      ],
      threshold: 0.32,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
  }
  return fuse
}

export function useSearch () {
  function search (query: string): SearchResult[] {
    const q = query.trim()
    if (!q) return []
    const queries = Array.from(new Set([q, translit(q)].filter(s => s.length >= 2)))
    const seen = new Set<string>()
    const out: SearchResult[] = []
    const fuseIndex = getFuse()
    for (const term of queries) {
      for (const r of fuseIndex.search(term, { limit: 24 })) {
        if (seen.has(r.item.path)) continue
        seen.add(r.item.path)
        const item = { ...r.item }
        if (item.haystack) item.snippet = excerpt(item.haystack, q)
        out.push(item)
      }
    }
    return out.slice(0, 40)
  }

  return { search }
}
