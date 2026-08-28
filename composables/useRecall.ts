import type { SearchResult, SearchResultType } from '~/composables/useSearch'

export function useRecall () {
  const open = useState('allmind-recall-open', () => false)
  const query = useState('allmind-recall-query', () => '')
  const { search } = useSearch()

  const results = computed(() => {
    const q = query.value.trim()
    if (q.length < 2) return [] as SearchResult[]
    return search(q)
  })

  const grouped = computed(() => {
    const map = new Map<SearchResultType, SearchResult[]>()
    for (const item of results.value) {
      const list = map.get(item.type) ?? []
      list.push(item)
      map.set(item.type, list)
    }
    return Array.from(map.entries()).map(([type, items]) => ({
      type,
      label: items[0]?.typeLabel ?? type,
      items,
    }))
  })

  function show (initial = '') {
    query.value = initial
    open.value = true
  }

  function hide () {
    open.value = false
  }

  function toggle () {
    open.value = !open.value
  }

  return { open, query, results, grouped, show, hide, toggle }
}
