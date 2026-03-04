<template>
  <article v-if="location" class="wiki-page">
    <WikiImageBlock
      v-if="location.image"
      :src="location.image"
      :caption="location.imageCaption"
    />
    <h1 class="wiki-page-title">{{ location.name }}</h1>
    <p v-if="location.type" class="wiki-meta">{{ location.type }}</p>
    <p class="wiki-page-lead">{{ location.short }}</p>
    <div class="wiki-prose wiki-prose--html" v-html="location.description" />
  </article>
  <article v-else class="wiki-page">
    <h1 class="wiki-page-title">Не найдено</h1>
    <p class="wiki-page-lead">Локация с таким адресом не найдена.</p>
    <NuxtLink to="/locations" class="wiki-back-link">← К списку локаций</NuxtLink>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getLocationBySlug } = useLocations()
const location = computed(() => getLocationBySlug(slug.value))
</script>
