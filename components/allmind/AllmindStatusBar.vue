<template>
  <div class="status" role="status">
    <span class="status__sys">ALLMIND // MEMORY INDEX</span>
    <span ref="linkEl" class="status__link">{{ linkLabel }}</span>
    <span class="status__mem">{{ memPath }}</span>
    <button
      v-if="route.path !== '/'"
      type="button"
      class="status__pin"
      :aria-pressed="pinned"
      :aria-label="pinned ? 'Открепить' : 'Закрепить запись'"
      @click="pinCurrent"
    >
      <AllmindIcon name="pin" :size="14" :weight="pinned ? 'fill' : 'regular'" />
    </button>
  </div>
</template>

<script setup lang="ts">
const { memPath, currentSection } = useWikiRegistry()
const { intensity } = useIntensity()
const { isPinned, togglePin, hydrate } = useMemory()
const { breadcrumbs } = useBreadcrumbs()
const { scramble, canAnimate } = useGsap()
const route = useRoute()
const linkEl = ref<HTMLElement | null>(null)

const pinned = computed(() => isPinned(route.fullPath))

onMounted(() => {
  hydrate()
  if (linkEl.value && canAnimate.value) scramble(linkEl.value, linkLabel.value, 0.45)
})

function pinCurrent () {
  const title = breadcrumbs.value.at(-1)?.title || currentSection.value?.title || memPath.value
  togglePin({
    path: route.fullPath,
    title,
    typeLabel: currentSection.value?.typeLabel ?? 'Индекс',
  })
}

const linkLabel = computed(() => {
  if (intensity.value === 'archive') return 'LINK STABLE'
  if (intensity.value === 'spectacle') return 'UPLINK LIVE'
  return 'LINK STABLE'
})
</script>

<style scoped>
.status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  min-height: var(--status-height);
  padding: 0.2rem 1.25rem;
  padding-top: max(0.2rem, env(safe-area-inset-top, 0px));
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-muted);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-argalius);
}

.status__sys { color: var(--color-gold); }
.status__link { color: var(--color-argalius); opacity: 0.8; }
.status__mem {
  margin-left: auto;
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
}
.status__pin {
  background: transparent;
  border: 0;
  color: var(--color-text-muted);
  min-width: 32px;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.status__pin[aria-pressed='true'] {
  color: var(--color-gold);
}
</style>
