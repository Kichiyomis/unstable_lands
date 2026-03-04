export interface WorldEntry {
  slug: string
  name: string
  short: string
  /** HTML-описание */
  description: string
  image?: string
  imageCaption?: string
}

export const worldEntries: WorldEntry[] = [
  {
    slug: 'overview',
    name: 'Обзор мира',
    short: 'Краткое описание сеттинга «Нестабильные Земли».',
    description: '<p>Тут пока пусто т.т</p>',
  },
  {
    slug: 'planes',
    name: 'Три плана',
    short: 'Главный план, Ад и Альтер — связь и влияние.',
    description: '<p><strong>Главный план</strong> — основной мир</p><p><strong>Ад</strong> — 3 этажа после Зачистки Ада, Фестиваль Ада.</p><p><strong>Альтер</strong> — космический план.</p>',
  },
]

export function getWorldBySlug (slug: string): WorldEntry | undefined {
  return worldEntries.find(e => e.slug === slug)
}
