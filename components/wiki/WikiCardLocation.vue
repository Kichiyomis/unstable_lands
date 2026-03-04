<template>
  <article class="wiki-card wiki-card--location">
    <h2 class="wiki-card__title">{{ name }}</h2>
    <p v-if="type" class="wiki-card__meta-line"><strong>Тип:</strong> {{ type }}</p>
    <p v-if="placement" class="wiki-card__meta-line"><strong>Расположение:</strong> {{ placement }}</p>
    <p v-if="population" class="wiki-card__meta-line"><strong>Население:</strong> {{ population }}</p>
    <div v-if="description" class="wiki-card__body">
      {{ description }}
    </div>
    <slot />
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  type?: string
  placement?: string
  population?: string
  description?: string
}>()
</script>

<style scoped>
.wiki-card--location {
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
