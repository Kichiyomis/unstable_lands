<template>
  <article class="wiki-card wiki-card--character">
    <header class="wiki-card__header">
      <div v-if="image" class="wiki-card__image">
        <NuxtImg :src="image" :alt="name" width="120" height="120" class="wiki-card__img" />
      </div>
      <div class="wiki-card__meta-wrap">
        <h2 class="wiki-card__title">{{ name }}</h2>
        <p v-if="role" class="wiki-card__meta">{{ role }}</p>
        <p v-if="status" class="wiki-card__status">
          <span class="wiki-card__status-label">Статус:</span> {{ status }}
        </p>
      </div>
    </header>
    <div v-if="summary" class="wiki-card__summary">
      {{ summary }}
    </div>
    <slot />
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  role?: string
  status?: string
  image?: string
  summary?: string
}>()
</script>

<style scoped>
.wiki-card--character {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.wiki-card__header {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.wiki-card__image {
  flex-shrink: 0;
}

.wiki-card__img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
}

.wiki-card__meta-wrap {
  flex: 1;
  min-width: 0;
}

.wiki-card__title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-light);
  margin: 0 0 var(--space-1);
  line-height: 1.3;
}

.wiki-card__meta,
.wiki-card__status {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-argalius-bright);
  margin: var(--space-1) 0 0;
}

.wiki-card__status-label {
  color: var(--color-text-muted);
}

.wiki-card__summary {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}
</style>
