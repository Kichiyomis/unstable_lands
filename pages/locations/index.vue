<template>
  <article class="wiki-page">
    <p class="mem-id">MEM://locations</p>
    <h1 class="wiki-page-title">Локации</h1>
    <p class="wiki-page-lead">
      Ключевые места сеттинга: описание, обитатели, события и связанные квесты. Выберите локацию для подробного описания.
    </p>
    <div v-if="groupedLocations.length" class="wiki-filter-bar">
      <button
        type="button"
        class="wiki-filter-chip"
        :class="{ 'wiki-filter-chip--active': activeGroup === 'all' }"
        @click="activeGroup = 'all'"
      >
        Все
      </button>
      <button
        v-for="group in groupedLocations"
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
      v-for="group in groupedLocations"
      :key="group.label"
      v-show="activeGroup === 'all' || activeGroup === group.label"
      class="wiki-filter-group"
    >
      <h2 class="wiki-filter-group-title">{{ group.label }}</h2>
      <div class="entry-grid entry-grid--wide">
        <NuxtLink
          v-for="loc in group.items"
          :key="loc.slug"
          :to="`/locations/${loc.slug}`"
          class="section-card"
          v-press-anim
          v-expand-link
        >
          <h3 class="section-card__title">{{ loc.name }}</h3>
          <p v-if="loc.type" class="section-card__meta">{{ loc.type }}</p>
          <p class="section-card__desc">{{ loc.short }}</p>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
const { locations } = useLocations()

const activeGroup = ref<'all' | string>('all')

type LocationWithType = (typeof locations)[number] & { type?: string }

const groupedLocations = computed(() => {
  const map = new Map<string, LocationWithType[]>()

  for (const loc of locations as LocationWithType[]) {
    const raw = (loc.type ?? '').trim()
    const label = raw || 'Прочие места'
    if (!map.has(label)) {
      map.set(label, [])
    }
    map.get(label)!.push(loc)
  }

  const preferredOrder = ['Город', 'Деревня', 'Посёлок', 'Место', 'Полузаброшенное поселение', 'Прочие места']
  const result: { label: string; items: LocationWithType[] }[] = []

  for (const label of preferredOrder) {
    if (map.has(label)) {
      result.push({ label, items: map.get(label)! })
      map.delete(label)
    }
  }

  const rest = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'ru'))
    .map(([label, items]) => ({ label, items }))

  return [...result, ...rest]
})
</script>

<style scoped>
.entry-grid--wide {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
