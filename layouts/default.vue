<template>
  <div class="layout">
    <div v-if="isSpectacle" class="hologram" aria-hidden="true" :style="hologramStyle" />
    <div class="chrome">
      <AllmindStatusBar />
      <AppHeader />
    </div>
    <main class="main">
      <div class="wiki-content">
        <AppBreadcrumbs v-if="breadcrumbs.length" :items="breadcrumbs" />
        <slot />
      </div>
    </main>
    <footer class="footer">
      <div class="wiki-content footer__inner">
        <p class="footer__text">
          ALLMIND Memory Index · кампания «Нестабильные Земли»
        </p>
        <NuxtLink to="/" class="footer__link">На главную</NuxtLink>
      </div>
    </footer>
    <AllmindDock />
    <AllmindRecall />
    <AllmindMoreSheet />
    <AllmindBoot />
  </div>
</template>

<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs()
const { isSpectacle, hydrate } = useIntensity()
const { remember, hydrate: hydrateMemory } = useMemory()
const { currentSection } = useWikiRegistry()
const route = useRoute()
const config = useRuntimeConfig()
const hologramStyle = computed(() => {
  const base = (config.app?.baseURL ?? '/').replace(/\/$/, '')
  return { backgroundImage: `url('${base}/images/allmind.jpg')` }
})

onMounted(() => {
  hydrate()
  hydrateMemory()
})

watch(
  () => route.fullPath,
  () => {
    const title = (breadcrumbs.value.at(-1)?.title)
      || currentSection.value?.title
      || 'Индекс'
    const isSectionIndex = currentSection.value && route.path === currentSection.value.path
    remember({
      path: route.fullPath,
      title,
      typeLabel: isSectionIndex ? 'Раздел' : (currentSection.value?.typeLabel ?? 'Индекс'),
    })
  },
  { immediate: true },
)
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

.chrome {
  position: sticky;
  top: 0;
  z-index: 120;
}

.hologram {
  position: fixed;
  right: -8%;
  top: 12%;
  width: min(42vw, 420px);
  aspect-ratio: 3 / 4;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0.08;
  filter: saturate(0.6) contrast(1.1);
  pointer-events: none;
  z-index: 0;
  mask-image: linear-gradient(90deg, transparent, #000 30%, #000 80%, transparent);
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
  font-size: 0.85rem;
  font-family: var(--font-mono);
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .footer { display: none; }
  .hologram { display: none; }
}
</style>
