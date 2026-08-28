<template>
  <article v-if="location" class="wiki-page">
    <p class="mem-id">MEM://locations/{{ location.slug }}</p>
    <WikiImageBlock
      v-if="location.image"
      :src="location.image"
      :caption="location.imageCaption"
    />
    <div class="dossier-layout">
      <WikiEntryIntro
        :title="location.name"
        :meta="location.type"
        :lead="location.short"
        :description="location.description"
      />
      <WikiRelated :path="`/locations/${location.slug}`" />
    </div>
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
