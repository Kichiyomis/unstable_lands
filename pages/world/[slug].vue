<template>
  <article v-if="entry" class="wiki-page">
    <p class="mem-id">MEM://world/{{ entry.slug }}</p>
    <WikiImageBlock
      v-if="entry.image"
      :src="entry.image"
      :caption="entry.imageCaption"
    />
    <div class="dossier-layout">
      <WikiEntryIntro
        :title="entry.name"
        :lead="entry.short"
        :description="entry.description"
      />
      <WikiRelated :path="`/world/${entry.slug}`" />
    </div>
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
