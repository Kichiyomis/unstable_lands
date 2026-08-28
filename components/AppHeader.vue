<template>
  <header class="header">
    <div class="header__inner container">
      <NuxtLink to="/" class="header__brand">
        <span class="header__title">Нестабильные Земли</span>
        <span class="header__subtitle">Memory Index</span>
      </NuxtLink>
      <nav class="nav" aria-label="Основное меню">
        <ul class="nav__list">
          <li v-for="item in sections" :key="item.path" class="nav__item">
            <NuxtLink
              :to="item.path"
              class="nav__link"
              active-class="nav__link--active"
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="header__actions">
        <button type="button" class="search-btn" aria-label="Recall" @click="show()">
          <AllmindIcon name="search" :size="18" />
          <span class="search-btn__label">Recall</span>
          <kbd class="search-btn__kbd">Ctrl K</kbd>
        </button>
        <button type="button" class="search-btn search-btn--ghost" aria-label="Настройки" @click="moreOpen = true">
          <AllmindIcon name="sliders" :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { sections } = useWikiRegistry()
const { show } = useRecall()
const moreOpen = useState('allmind-more-open', () => false)
</script>

<style scoped>
.header {
  background: rgba(10, 13, 20, 0.92);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
}

.header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding-top: 0.65rem;
  padding-bottom: 0.65rem;
}

.header__brand {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-light);
  margin-right: auto;
}

.header__title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  color: var(--color-gold);
  letter-spacing: 0.03em;
}

.header__subtitle {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-argalius);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.nav__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-ui);
}

.nav__link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.nav__link:hover,
.nav__link--active {
  color: var(--color-gold);
  background: var(--color-gold-subtle);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.search-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding: 0.4rem 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.search-btn:hover { color: var(--color-gold); border-color: var(--color-gold-dim); }

.search-btn--ghost { padding: 0.4rem 0.55rem; }

.search-btn__kbd {
  font-size: 0.65rem;
  opacity: 0.6;
  border: 1px solid var(--color-border);
  padding: 0.1rem 0.3rem;
}

@media (max-width: 900px) {
  .nav { display: none; }
  .search-btn__label,
  .search-btn__kbd { display: none; }
  .header__inner {
    flex-wrap: nowrap;
    gap: 0.5rem;
  }
  .header__title { font-size: 0.98rem; }
  .header__brand { min-width: 0; }
}
</style>
