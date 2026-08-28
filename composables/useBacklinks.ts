import { characters } from '~/data/characters'
import { mechanics } from '~/data/mechanics'
import { historyEntries } from '~/data/history'
import { locations } from '~/data/locations'
import { worldEntries } from '~/data/world'

export interface RelatedLink {
  path: string
  title: string
  typeLabel: string
}

interface Node {
  path: string
  title: string
  typeLabel: string
  html: string
}

function stripBase (href: string): string {
  try {
    if (href.startsWith('http')) {
      const url = new URL(href)
      href = url.pathname + url.hash
    }
  } catch {
    /* keep */
  }
  const cleaned = href.split('?')[0]
  return cleaned.replace(/\/unstable_lands/g, '') || '/'
}

function extractHrefs (html: string): string[] {
  const out: string[] = []
  const re = /href=["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const path = stripBase(m[1])
    if (path.startsWith('/')) out.push(path)
  }
  return out
}

function htmlOf (fields: Array<string | undefined>): string {
  return fields.filter(Boolean).join(' ')
}

function nodes (): Node[] {
  const list: Node[] = []
  for (const c of characters) {
    list.push({
      path: `/characters/${c.slug}`,
      title: c.name,
      typeLabel: 'Персонаж',
      html: htmlOf([c.description, c.appearance, c.biography, c.motivation, c.relationships, c.summary]),
    })
  }
  for (const w of worldEntries) {
    list.push({ path: `/world/${w.slug}`, title: w.name, typeLabel: 'Мир', html: htmlOf([w.description, w.short]) })
  }
  for (const m of mechanics) {
    list.push({ path: `/mechanics/${m.slug}`, title: m.name, typeLabel: 'Механика', html: htmlOf([m.description, m.short]) })
  }
  for (const e of historyEntries) {
    list.push({ path: `/history/${e.slug}`, title: e.name, typeLabel: 'История', html: htmlOf([e.description, e.short]) })
  }
  for (const l of locations) {
    list.push({ path: `/locations/${l.slug}`, title: l.name, typeLabel: 'Локация', html: htmlOf([l.description, l.short]) })
  }
  return list
}

let graph: Map<string, RelatedLink[]> | null = null

function buildGraph () {
  if (graph) return graph
  const all = nodes()
  const byPath = new Map(all.map(n => [n.path, n]))
  const links = new Map<string, RelatedLink[]>()

  const add = (from: string, to: string) => {
    const target = byPath.get(to.split('#')[0])
    if (!target || from === target.path) return
    const list = links.get(from) ?? []
    if (list.some(x => x.path === target.path)) return
    list.push({ path: target.path, title: target.title, typeLabel: target.typeLabel })
    links.set(from, list)
  }

  for (const n of all) {
    for (const href of extractHrefs(n.html)) {
      add(n.path, href)
      add(href.split('#')[0], n.path)
    }
  }
  graph = links
  return graph
}

export function useBacklinks (path: MaybeRefOrGetter<string>) {
  const related = computed(() => {
    const p = toValue(path).split('#')[0]
    return (buildGraph().get(p) ?? []).slice(0, 12)
  })
  return { related }
}
