<template>
  <article class="wiki-page">
    <p class="mem-id">MEM://history</p>
    <h1 class="wiki-page-title">История и хронология</h1>
    <p class="wiki-page-lead">
      Эпохи и ключевые события от Выхода Света до наших дней. Выберите период для подробного описания.
    </p>
    <div v-if="groupedHistory.length" class="wiki-filter-bar">
      <button
        type="button"
        class="wiki-filter-chip"
        :class="{ 'wiki-filter-chip--active': activeGroup === 'all' }"
        @click="activeGroup = 'all'"
      >
        Все
      </button>
      <button
        v-for="group in groupedHistory"
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
      v-for="group in groupedHistory"
      :key="group.label"
      v-show="activeGroup === 'all' || activeGroup === group.label"
      class="wiki-filter-group"
    >
      <h2 class="wiki-filter-group-title">{{ group.label }}</h2>
      <div class="entry-grid entry-grid--wide">
        <NuxtLink
          v-for="e in group.items"
          :key="e.slug"
          :to="`/history/${e.slug}`"
          class="section-card"
          v-press-anim
          v-expand-link
        >
          <h3 class="section-card__title">{{ e.name }}</h3>
          <p v-if="e.years" class="section-card__meta">{{ e.years }}</p>
          <p class="section-card__desc">{{ e.short }}</p>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
const { historyEntries } = useHistory()

const activeGroup = ref<'all' | string>('all')

type HistoryWithGroup = (typeof historyEntries)[number] & { group?: string }

const groupedHistory = computed(() => {
  const map = new Map<string, HistoryWithGroup[]>()

  for (const entry of historyEntries as HistoryWithGroup[]) {
    const raw = (entry.group ?? '').trim()
    const label = raw || 'Хронология'
    if (!map.has(label)) {
      map.set(label, [])
    }
    map.get(label)!.push(entry)
  }

  const preferredOrder = ['Хронология']
  const result: { label: string; items: HistoryWithGroup[] }[] = []

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
