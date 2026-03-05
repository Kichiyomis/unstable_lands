<template>
  <article class="wiki-page">
    <h1 class="wiki-page-title">Локации</h1>
    <p class="wiki-page-lead">
      Ключевые места сеттинга: описание, обитатели, события и связанные квесты. Выберите локацию для подробного описания.
    </p>
    <div class="entry-grid entry-grid--wide">
      <NuxtLink
        v-for="loc in locations"
        :key="loc.slug"
        :to="`/locations/${loc.slug}`"
        class="section-card"
        v-press-anim
        v-expand-link
      >
        <h3 class="section-card__title">{{ loc.name }}</h3>
        <p v-if="loc.type" class="section-card__meta">{{ loc.type }}</p>
        <p class="section-card__desc">{{ loc.short }}</p>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const { locations } = useLocations()
</script>

<style scoped>
.entry-grid--wide {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
