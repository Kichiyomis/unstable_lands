<template>
  <article class="wiki-page">
    <h1 class="wiki-page-title">Поиск</h1>
    <p v-if="!query" class="wiki-page-lead">
      Введите запрос в поле поиска в шапке и нажмите Enter.
    </p>
    <template v-else>
      <p class="wiki-page-lead">Результаты по запросу «<strong>{{ query }}</strong>»</p>
      <ul v-if="results.length" class="search-results">
        <li v-for="(r, i) in results" :key="i" class="search-result">
          <NuxtLink :to="r.path" class="search-result__link">
            <span class="search-result__type">{{ r.typeLabel }}</span>
            <span class="search-result__title">{{ r.title }}</span>
          </NuxtLink>
          <p v-if="r.snippet" class="search-result__snippet">{{ r.snippet }}</p>
        </li>
      </ul>
      <p v-else class="wiki-page-lead">Ничего не найдено. Попробуйте другой запрос.</p>
    </template>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const query = computed(() => (route.query.q as string) ?? '')
const { search } = useSearch()
const results = computed(() => search(query.value))
</script>

<style scoped>
.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-result {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-muted);
}

.search-result:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.search-result__link {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2);
}

.search-result__type {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-argalius-bright);
}

.search-result__title {
  font-family: var(--font-heading);
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-light);
}

.search-result__link:hover .search-result__title {
  color: var(--color-gold);
}

.search-result__snippet {
  margin: var(--space-2) 0 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
</style>
