<template>
  <article class="wiki-page">
    <h1 class="wiki-page-title">История и хронология</h1>
    <p class="wiki-page-lead">
      Эпохи и ключевые события от Выхода Света до наших дней. Выберите период для подробного описания.
    </p>
    <div class="entry-grid entry-grid--wide">
      <NuxtLink
        v-for="e in historyEntries"
        :key="e.slug"
        :to="`/history/${e.slug}`"
        class="section-card"
        v-press-anim
        v-expand-link
      >
        <h3 class="section-card__title">{{ e.name }}</h3>
        <p v-if="e.years" class="section-card__meta">{{ e.years }}</p>
        <p class="section-card__desc">{{ e.short }}</p>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const { historyEntries } = useHistory()
</script>

<style scoped>
.entry-grid--wide {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
