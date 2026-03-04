<template>
  <article class="wiki-card wiki-card--faction">
    <h2 class="wiki-card__title">{{ name }}</h2>
    <p v-if="goals" class="wiki-card__meta-line"><strong>Цели:</strong> {{ goals }}</p>
    <p v-if="leaders" class="wiki-card__meta-line"><strong>Лидеры:</strong> {{ leaders }}</p>
    <p v-if="base" class="wiki-card__meta-line"><strong>База:</strong> {{ base }}</p>
    <div v-if="description" class="wiki-card__body">
      {{ description }}
    </div>
    <slot />
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  goals?: string
  leaders?: string
  base?: string
  description?: string
}>()
</script>

<style scoped>
.wiki-card--faction {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.wiki-card__title {
  margin: 0 0 0.75rem;
  font-size: 1.35rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border-muted);
}

.wiki-card__meta-line {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.wiki-card__meta-line strong {
  color: var(--color-text);
  margin-right: 0.35rem;
}

.wiki-card__body {
  margin-top: 1rem;
  line-height: 1.6;
}
</style>
