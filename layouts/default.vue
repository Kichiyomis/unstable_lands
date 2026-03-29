<template>
  <div class="layout">
    <AppHeader />
    <main class="main">
      <div class="wiki-content">
        <AppBreadcrumbs v-if="breadcrumbs.length" :items="breadcrumbs" />
        <slot />
      </div>
    </main>
    <footer class="footer">
      <div class="wiki-content footer__inner">
        <p class="footer__text">
          Вики кампании «Нестабильные Земли». Мир, персонажи, локации, история, механики и товары.
        </p>
        <NuxtLink to="/" class="footer__link">На главную</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs()
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  position: relative;
  z-index: 1;
}

.footer {
  margin-top: auto;
  padding: 1.5rem 1rem;
  background: var(--color-bg-elevated);
  border-top: 1px solid var(--color-border-muted);
  position: relative;
  z-index: 1;
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.footer__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.footer__link {
  font-size: 0.9rem;
}
</style>
