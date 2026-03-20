<template>
  <article class="wiki-page">
    <h1 class="wiki-page-title">Механики</h1>
    <p class="wiki-page-lead">
      Игровые системы и правила сеттинга. Выберите механику для подробного описания.
    </p>
    <div v-if="groupedMechanics.length" class="wiki-filter-bar">
      <button
        type="button"
        class="wiki-filter-chip"
        :class="{ 'wiki-filter-chip--active': activeGroup === 'all' }"
        @click="activeGroup = 'all'"
      >
        Все
      </button>
      <button
        v-for="group in groupedMechanics"
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
      v-for="group in groupedMechanics"
      :key="group.label"
      v-show="activeGroup === 'all' || activeGroup === group.label"
      class="wiki-filter-group"
    >
      <h2 class="wiki-filter-group-title">{{ group.label }}</h2>
      <div class="entry-grid entry-grid--wide">
        <NuxtLink
          v-for="m in group.items"
          :key="m.slug"
          :to="`/mechanics/${m.slug}`"
          class="section-card"
          v-press-anim
          v-expand-link
        >
          <h3 class="section-card__title">{{ m.name }}</h3>
          <p class="section-card__desc">{{ m.short }}</p>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
const { mechanics } = useMechanics()

const activeGroup = ref<'all' | string>('all')

type MechanicWithGroup = (typeof mechanics)[number] & { group?: string }

const groupedMechanics = computed(() => {
  const map = new Map<string, MechanicWithGroup[]>()

  for (const mechanic of mechanics as MechanicWithGroup[]) {
    const raw = (mechanic.group ?? '').trim()
    const label = raw || 'Разное'
    if (!map.has(label)) {
      map.set(label, [])
    }
    map.get(label)!.push(mechanic)
  }

  const preferredOrder = ['Арсенал', 'Механики хобби персонажей', 'Разное']
  const result: { label: string; items: MechanicWithGroup[] }[] = []

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
</script>

<style scoped>
.entry-grid--wide {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
