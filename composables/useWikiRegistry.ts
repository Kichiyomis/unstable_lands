export type WikiSearchType =
  | 'character'
  | 'mechanic'
  | 'history'
  | 'location'
  | 'world'
  | 'goods'

export interface WikiSection {
  id: string
  title: string
  path: string
  mem: string
  short: string
  icon: 'globe' | 'users' | 'map' | 'clock' | 'gear' | 'package'
  order: number
  searchType: WikiSearchType
  typeLabel: string
}

export const wikiSections: WikiSection[] = [
  { id: 'world', title: 'Мир', path: '/world', mem: 'MEM://world', short: 'Планы, география, обзор сеттинга', icon: 'globe', order: 1, searchType: 'world', typeLabel: 'Мир' },
  { id: 'characters', title: 'Персонажи', path: '/characters', mem: 'MEM://characters', short: 'Сефиры, герои, искажённые', icon: 'users', order: 2, searchType: 'character', typeLabel: 'Персонаж' },
  { id: 'locations', title: 'Локации', path: '/locations', mem: 'MEM://locations', short: 'Фрихольд, Кромка Теней и другие места', icon: 'map', order: 3, searchType: 'location', typeLabel: 'Локация' },
  { id: 'history', title: 'История', path: '/history', mem: 'MEM://history', short: 'Хронология от Выхода Света', icon: 'clock', order: 4, searchType: 'history', typeLabel: 'История' },
  { id: 'mechanics', title: 'Механики', path: '/mechanics', mem: 'MEM://mechanics', short: 'Арсенал, хобби, правила', icon: 'gear', order: 5, searchType: 'mechanic', typeLabel: 'Механика' },
  { id: 'goods', title: 'Товары', path: '/goods', mem: 'MEM://goods', short: 'Расходники и одноразовые предметы', icon: 'package', order: 6, searchType: 'goods', typeLabel: 'Товар' },
]

export function useWikiRegistry () {
  const route = useRoute()

  const sections = wikiSections

  const currentSection = computed(() => {
    const path = route.path
    return sections.find(s => path === s.path || path.startsWith(`${s.path}/`)) ?? null
  })

  const memPath = computed(() => {
    if (route.path === '/' || route.path === '') return 'MEM://index'
    if (route.path.startsWith('/search')) return 'MEM://recall'
    const section = currentSection.value
    if (!section) return `MEM://${route.path.replace(/^\//, '')}`
    const rest = route.path.slice(section.path.length).replace(/^\//, '')
    return rest ? `${section.mem}/${rest}` : section.mem
  })

  return { sections, currentSection, memPath }
}

