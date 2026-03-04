import type { BreadcrumbItem } from '~/components/AppBreadcrumbs.vue'
import { getCharacterBySlug } from '~/data/characters'
import { getMechanicBySlug } from '~/data/mechanics'
import { getHistoryBySlug } from '~/data/history'
import { getLocationBySlug } from '~/data/locations'
import { getWorldBySlug } from '~/data/world'

const pathTitles: Record<string, string> = {
  world: 'Мир',
  characters: 'Персонажи',
  locations: 'Локации',
  history: 'История',
  mechanics: 'Механики',
  search: 'Поиск',
}

function slugToTitle (segment: string, pathSoFar: string): string {
  if (pathSoFar === '/world') return getWorldBySlug(segment)?.name ?? segment
  if (pathSoFar === '/characters') return getCharacterBySlug(segment)?.name ?? segment
  if (pathSoFar === '/mechanics') return getMechanicBySlug(segment)?.name ?? segment
  if (pathSoFar === '/history') return getHistoryBySlug(segment)?.name ?? segment
  if (pathSoFar === '/locations') return getLocationBySlug(segment)?.name ?? segment
  return decodeURIComponent(segment)
}

export function useBreadcrumbs () {
  const route = useRoute()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const meta = route.meta.breadcrumbs as BreadcrumbItem[] | undefined
    if (Array.isArray(meta) && meta.length) return meta
    if (!route.path || route.path === '/') return []
    const segments = route.path.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []
    let path = ''
    let parentPath = ''
    for (const segment of segments) {
      parentPath = path
      path += `/${segment}`
      const title = pathTitles[segment] ?? slugToTitle(segment, parentPath)
      items.push({ title, path })
    }
    return items
  })

  return { breadcrumbs }
}
