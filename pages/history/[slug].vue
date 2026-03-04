<template>
  <article v-if="entry" class="wiki-page">
    <WikiImageBlock
      v-if="entry.image"
      :src="entry.image"
      :caption="entry.imageCaption"
    />
    <h1 class="wiki-page-title">{{ entry.name }}</h1>
    <p v-if="entry.years" class="wiki-meta">{{ entry.years }}</p>
    <p class="wiki-page-lead">{{ entry.short }}</p>
    <div class="wiki-prose wiki-prose--html" v-html="entry.description" />
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
