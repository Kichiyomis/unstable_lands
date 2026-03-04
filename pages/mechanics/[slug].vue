<template>
  <article v-if="mechanic" class="wiki-page">
    <WikiImageBlock
      v-if="mechanic.image"
      :src="mechanic.image"
      :caption="mechanic.imageCaption"
    />
    <h1 class="wiki-page-title">{{ mechanic.name }}</h1>
    <p class="wiki-page-lead">{{ mechanic.short }}</p>
    <div class="wiki-prose wiki-prose--html" v-html="mechanic.description" />
  </article>
  <article v-else class="wiki-page">
    <h1 class="wiki-page-title">Не найдено</h1>
    <p class="wiki-page-lead">Механика с таким адресом не найдена.</p>
    <NuxtLink to="/mechanics" class="wiki-back-link">← К списку механик</NuxtLink>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getMechanicBySlug } = useMechanics()
const mechanic = computed(() => getMechanicBySlug(slug.value))
</script>
