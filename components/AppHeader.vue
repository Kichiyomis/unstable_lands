<template>
  <header class="header">
    <div class="header__inner container">
      <NuxtLink to="/" class="header__brand">
        <span class="header__title">Нестабильные Земли</span>
        <span class="header__subtitle">Вики кампании</span>
      </NuxtLink>
      <nav class="nav" aria-label="Основное меню">
        <button
          type="button"
          class="nav__toggle"
          aria-label="Открыть меню"
          :aria-expanded="open"
          @click="open = !open"
        >
          <span class="nav__toggle-bar" />
          <span class="nav__toggle-bar" />
          <span class="nav__toggle-bar" />
        </button>
        <ul class="nav__list" :class="{ 'nav__list--open': open }">
          <li v-for="item in navItems" :key="item.path" class="nav__item">
            <NuxtLink
              :to="item.path"
              class="nav__link"
              active-class="nav__link--active"
              @click="open = false"
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="header__search">
        <input
          v-model="query"
          type="search"
          class="search-input"
          placeholder="Поиск..."
          aria-label="Поиск"
          @keydown.enter="onSearch"
        />
        <button type="button" class="search-btn" aria-label="Искать" @click="onSearch">
          <span aria-hidden="true">⌕</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { navItems } = useNavigation()
const router = useRouter()
const query = ref('')

const open = ref(false)

function onSearch () {
  const q = query.value.trim()
  if (q) {
    router.push({ path: '/search', query: { q } })
    open.value = false
  }
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow);
}

.header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  max-width: var(--container);
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
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
  font-size: 1.35rem;
  color: var(--color-gold);
  letter-spacing: 0.03em;
}

.header__subtitle {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  cursor: pointer;
  font-family: inherit;
}

.nav__toggle-bar {
  width: 22px;
  height: 2px;
  background: currentColor;
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

.nav__item {
  position: relative;
}

.nav__link {
  display: block;
  padding: 0.5rem 0.85rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius);
  transition: color var(--transition), background var(--transition);
}

.nav__link:hover,
.nav__link--active {
  color: var(--color-gold);
  background: var(--color-gold-subtle);
}

.header__search {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.search-input {
  width: 160px;
  padding: 0.5rem 0.85rem;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: border-color var(--transition);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-gold-dim);
}

.search-btn {
  padding: 0.5rem 0.65rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  transition: color var(--transition), border-color var(--transition);
}

.search-btn:hover {
  color: var(--color-gold);
  border-color: var(--color-gold-dim);
}

@media (max-width: 900px) {
  .nav__toggle {
    display: flex;
  }

  .nav__list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-bg-elevated);
    border-bottom: 1px solid var(--color-border);
    padding: 0.5rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-left: -1.25rem;
    margin-right: -1.25rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  .nav__list--open {
    max-height: 80vh;
    overflow-y: auto;
  }

  .nav__link {
    padding: 0.6rem 0;
  }

  .header__search {
    width: 100%;
    order: 3;
  }

  .search-input {
    flex: 1;
    width: 100%;
    max-width: none;
  }
}
</style>
