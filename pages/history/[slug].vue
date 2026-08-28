<template>
  <article v-if="entry" class="wiki-page">
    <p class="mem-id">MEM://history/{{ entry.slug }}</p>
    <WikiImageBlock
      v-if="entry.image"
      :src="entry.image"
      :caption="entry.imageCaption"
    />
    <div class="dossier-layout">
      <WikiEntryIntro
        :title="entry.name"
        :meta="entry.years"
        :lead="entry.short"
        :description="entry.description"
      />
      <WikiRelated :path="`/history/${entry.slug}`" />
    </div>
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
