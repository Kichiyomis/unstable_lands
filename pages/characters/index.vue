<template>
  <article class="wiki-page">
    <p class="mem-id">MEM://characters</p>
    <h1 class="wiki-page-title">Персонажи</h1>
    <p class="wiki-page-lead">
      Персонажи вселенной «Нестабильные Земли».
    </p>
    <div v-if="groupedCharacters.length" class="wiki-filter-bar">
      <button
        type="button"
        class="wiki-filter-chip"
        :class="{ 'wiki-filter-chip--active': activeGroup === 'all' }"
        @click="activeGroup = 'all'"
      >
        Все
      </button>
      <button
        v-for="group in groupedCharacters"
        :key="group.label"
        type="button"
        class="wiki-filter-chip"
        :class="{ 'wiki-filter-chip--active': activeGroup === group.label }"
        @click="activeGroup = group.label"
      >
        {{ group.label }}
      </button>
    </div>

    <section
      v-for="group in groupedCharacters"
      :key="group.label"
      v-show="activeGroup === 'all' || activeGroup === group.label"
      class="wiki-filter-group"
    >
      <h2 class="wiki-filter-group-title">{{ group.label }}</h2>
      <div class="entry-grid">
        <NuxtLink
          v-for="char in group.items"
          :key="char.slug"
          :to="`/characters/${char.slug}`"
          class="entry-card"
          :class="{ 'entry-card--no-image': !(char.image || char.thumbnail) }"
          v-press-anim
          v-expand-link
        >
          <div
            class="entry-card__thumb"
            :class="{ 'entry-card__thumb--empty': !(char.image || char.thumbnail) }"
          >
            <img
              v-if="char.image || char.thumbnail"
              :src="thumbSrc(char)"
              :alt="char.name"
              width="200"
              height="200"
              loading="lazy"
            />
          </div>
          <div class="entry-card__body">
            <h2 class="entry-card__title">{{ char.name }}</h2>
            <p v-if="char.role" class="entry-card__meta">{{ char.role }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
const { characters } = useCharacters()
const config = useRuntimeConfig()
const baseURL = (config.app?.baseURL ?? '/').replace(/\/$/, '')

const activeGroup = ref<'all' | string>('all')

type CharacterWithGroup = (typeof characters)[number] & { group?: string }

const groupedCharacters = computed(() => {
  const map = new Map<string, CharacterWithGroup[]>()

  for (const char of characters as CharacterWithGroup[]) {
    const raw = (char.group ?? '').trim()
    const label = raw || 'Разное'
    if (!map.has(label)) {
      map.set(label, [])
    }
    map.get(label)!.push(char)
  }

  const preferredOrder = ['Сефиры', 'Главные герои', 'Искажённые', 'Разное']
  const result: { label: string; items: CharacterWithGroup[] }[] = []

  // Сначала выводим заранее известный порядок, если такие группы есть
  for (const label of preferredOrder) {
    if (map.has(label)) {
      result.push({ label, items: map.get(label)! })
      map.delete(label)
    }
  }

  // Остальные — по алфавиту
  const rest = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'ru'))
    .map(([label, items]) => ({ label, items }))

  return [...result, ...rest]
})

const { run } = useGsap()

function thumbSrc (char: { image?: string; thumbnail?: string }) {
  const path = (char.thumbnail ?? char.image) ?? ''
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return baseURL + p
}

onMounted(() => {
  run(({ gsap, ScrollTrigger }) => {
    if (window.matchMedia('(max-width: 900px)').matches) return
    const cards = document.querySelectorAll<HTMLElement>('.entry-card')
    if (!cards.length) return
    gsap.from(cards, {
      opacity: 0,
      y: 14,
      duration: 0.36,
      ease: 'power2.out',
      stagger: 0.04,
      scrollTrigger: {
        trigger: '.entry-grid',
        start: 'top 88%',
        once: true,
      },
    })
    void ScrollTrigger
  })
})
</script>
