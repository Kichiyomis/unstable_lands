<template>
  <article class="wiki-page">
    <h1 class="wiki-page-title">Мир</h1>
    <p class="wiki-page-lead">
      Общее описание сеттинга «Нестабильные Земли».
    </p>
    <div class="entry-grid entry-grid--wide">
      <NuxtLink
        v-for="e in worldEntries"
        :key="e.slug"
        :to="`/world/${e.slug}`"
        class="section-card"
      >
        <h3 class="section-card__title">{{ e.name }}</h3>
        <p class="section-card__desc">{{ e.short }}</p>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const { worldEntries } = useWorld()
</script>

<style scoped>
.entry-grid--wide {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
