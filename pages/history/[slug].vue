<template>
  <article v-if="entry" class="wiki-page">
    <WikiImageBlock
      v-if="entry.image"
      :src="entry.image"
      :caption="entry.imageCaption"
    />
    <WikiEntryIntro
      :title="entry.name"
      :meta="entry.years"
      :lead="entry.short"
      :description="entry.description"
    />
  </article>
  <article v-else class="wiki-page">
    <h1 class="wiki-page-title">Не найдено</h1>
    <p class="wiki-page-lead">Событие или эпоха с таким адресом не найдены.</p>
    <NuxtLink to="/history" class="wiki-back-link">← К хронологии</NuxtLink>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getHistoryBySlug } = useHistory()
const entry = computed(() => getHistoryBySlug(slug.value))
</script>
