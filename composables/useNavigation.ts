export interface NavItem {
  title: string
  path: string
  children?: { title: string; path: string }[]
}

export function useNavigation () {
  const navItems: NavItem[] = [
    { title: 'Мир', path: '/world' },
    { title: 'Персонажи', path: '/characters' },
    { title: 'Локации', path: '/locations' },
    { title: 'История', path: '/history' },
    { title: 'Механики', path: '/mechanics' },
  ]

  return { navItems }
}
