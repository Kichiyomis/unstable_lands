<template>
  <nav v-if="items.length" class="breadcrumbs" aria-label="Хлебные крошки">
    <ol class="breadcrumbs__list">
      <li class="breadcrumbs__item">
        <NuxtLink to="/" class="breadcrumbs__link">Главная</NuxtLink>
      </li>
      <li
        v-for="(item, i) in items"
        :key="item.path"
        class="breadcrumbs__item"
      >
        <span class="breadcrumbs__sep" aria-hidden="true">/</span>
        <NuxtLink
          v-if="i < items.length - 1"
          :to="item.path"
          class="breadcrumbs__link"
        >
          {{ item.title }}
        </NuxtLink>
        <span v-else class="breadcrumbs__current" aria-current="page">
          {{ item.title }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  title: string
  path: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style scoped>
.breadcrumbs {
  padding: 0.5rem 0 1rem;
  font-size: 0.9rem;
}

.breadcrumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumbs__sep {
  color: var(--color-text-muted);
  margin: 0 0.15rem;
}

.breadcrumbs__link {
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.breadcrumbs__link:hover {
  color: var(--color-gold);
}

.breadcrumbs__current {
  color: var(--color-light);
}
</style>
