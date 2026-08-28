export interface MemoryItem {
  path: string
  title: string
  typeLabel: string
}

const RECENT_KEY = 'allmind-recent'
const PINS_KEY = 'allmind-pins'
const MAX_RECENT = 12

function readList (key: string): MemoryItem[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeList (key: string, list: MemoryItem[]) {
  if (!import.meta.client) return
  localStorage.setItem(key, JSON.stringify(list))
}

export function useMemory () {
  const recent = useState<MemoryItem[]>('allmind-recent', () => [])
  const pins = useState<MemoryItem[]>('allmind-pins', () => [])
  const hydrated = useState('allmind-memory-ready', () => false)

  function hydrate () {
    if (!import.meta.client || hydrated.value) return
    recent.value = readList(RECENT_KEY)
    pins.value = readList(PINS_KEY)
    hydrated.value = true
  }

  function remember (item: MemoryItem) {
    hydrate()
    if (!item.path || item.path === '/') return
    recent.value = [item, ...recent.value.filter(r => r.path !== item.path)].slice(0, MAX_RECENT)
    writeList(RECENT_KEY, recent.value)
  }

  function isPinned (path: string) {
    return pins.value.some(p => p.path === path)
  }

  function togglePin (item: MemoryItem) {
    hydrate()
    if (isPinned(item.path)) {
      pins.value = pins.value.filter(p => p.path !== item.path)
    } else {
      pins.value = [item, ...pins.value]
    }
    writeList(PINS_KEY, pins.value)
  }

  return { recent, pins, remember, isPinned, togglePin, hydrate }
}
