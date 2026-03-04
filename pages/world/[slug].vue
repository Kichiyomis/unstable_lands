<template>
  <article v-if="entry" class="wiki-page">
    <WikiImageBlock
      v-if="entry.image"
      :src="entry.image"
      :caption="entry.imageCaption"
    />
    <h1 class="wiki-page-title">{{ entry.name }}</h1>
    <p class="wiki-page-lead">{{ entry.short }}</p>
    <div class="wiki-prose wiki-prose--html" v-html="entry.description" />
  </article>
  <article v-else class="wiki-page">
    <h1 class="wiki-page-title">Не найдено</h1>
    <p class="wiki-page-lead">Раздел с таким адресом не найден.</p>
    <NuxtLink to="/world" class="wiki-back-link">← К разделу «Мир»</NuxtLink>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getWorldBySlug } = useWorld()
const entry = computed(() => getWorldBySlug(slug.value))
</script>
