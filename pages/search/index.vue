<template>
  <article class="wiki-page">
    <p class="mem-id">MEM://recall</p>
    <h1 class="wiki-page-title">Поиск</h1>
    <p v-if="!query" class="wiki-page-lead">
      Откройте Recall (Ctrl+K) или введите запрос в шапке.
    </p>
    <p v-else class="wiki-page-lead">
      Результаты по запросу «<strong>{{ query }}</strong>»
    </p>
    <button type="button" class="hero-recall" @click="show(query)">
      <AllmindIcon name="search" :size="18" />
      Открыть Recall
    </button>
    <ul v-if="query && results.length" class="search-results">
      <li v-for="(r, i) in results" :key="i" class="search-result">
        <NuxtLink :to="r.path" class="search-result__link">
          <span class="search-result__type">{{ r.typeLabel }}</span>
          <span class="search-result__title">{{ r.title }}</span>
        </NuxtLink>
        <p v-if="r.snippet" class="search-result__snippet">{{ r.snippet }}</p>
      </li>
    </ul>
    <p v-else-if="query" class="wiki-page-lead">Ничего не найдено. Попробуйте другое написание.</p>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const query = computed(() => (route.query.q as string) ?? '')
const { search } = useSearch()
const { show } = useRecall()
const results = computed(() => search(query.value))
</script>

<style scoped>
.hero-recall {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  margin-bottom: var(--space-4);
  padding: 0.45rem 0.9rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-argalius);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

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

.search-result__link {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2);
}

.search-result__type {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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
