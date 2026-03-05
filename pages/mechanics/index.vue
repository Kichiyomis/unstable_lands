<template>
  <article class="wiki-page">
    <h1 class="wiki-page-title">Механики</h1>
    <p class="wiki-page-lead">
      Игровые системы и правила сеттинга. Выберите механику для подробного описания.
    </p>
    <div class="entry-grid entry-grid--wide">
      <NuxtLink
        v-for="m in mechanics"
        :key="m.slug"
        :to="`/mechanics/${m.slug}`"
        class="section-card"
        v-press-anim
        v-expand-link
      >
        <h3 class="section-card__title">{{ m.name }}</h3>
        <p class="section-card__desc">{{ m.short }}</p>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const { mechanics } = useMechanics()
</script>

<style scoped>
.entry-grid--wide {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
