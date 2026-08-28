export function useNavigation () {
  const { sections } = useWikiRegistry()
  const navItems = sections.map(s => ({ title: s.title, path: s.path }))
  return { navItems }
}
