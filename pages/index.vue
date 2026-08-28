<template>
  <div class="home">
    <section class="hero">
      <p class="mem-id">MEM://index</p>
      <div ref="accentLineEl" class="accent-line" style="margin-left: auto; margin-right: auto;" />
      <h1 class="hero__title">Нестабильные Земли</h1>
      <p class="hero__tagline">ALLMIND Memory Index</p>
      <p class="hero__desc">
        Информационный портал по авторской D&amp;D кампании: мир, персонажи, локации, история и механики.
      </p>
      <button type="button" class="hero__recall" @click="show()">
        <AllmindIcon name="search" :size="18" />
        Recall
      </button>
    </section>

    <section class="sections">
      <h2 class="wiki-section-heading">Разделы индекса</h2>
      <div ref="sectionsEl" class="section-cards section-cards--row">
        <NuxtLink
          v-for="section in sections"
          :key="section.id"
          :to="section.path"
          class="section-card"
          v-tilt
          v-press-anim
          v-expand-link
        >
          <span class="section-card__meta">{{ section.mem }}</span>
          <h3 class="section-card__title">{{ section.title }}</h3>
          <p class="section-card__desc">{{ section.short }}</p>
        </NuxtLink>
      </div>
    </section>

    <section v-if="recent.length" class="random-section">
      <h2 class="wiki-section-heading">Недавняя память</h2>
      <div class="random-cards">
        <NuxtLink
          v-for="entry in recent.slice(0, 5)"
          :key="entry.path"
          :to="entry.path"
          class="random-card wiki-card"
          v-press-anim
          v-expand-link
        >
          <span class="wiki-card__meta">{{ entry.typeLabel }}</span>
          <span class="wiki-card__title">{{ entry.title }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="random-section">
      <h2 class="wiki-section-heading">Случайные фрагменты</h2>
      <div ref="randomCardsEl" class="random-cards">
        <NuxtLink
          v-for="(entry, index) in entries"
          :key="entry.path"
          :to="entry.path"
          class="random-card wiki-card"
          :class="{ 'random-card--pulse': index === activeRandomIndex }"
          v-tilt
          v-press-anim
          v-expand-link
        >
          <span class="wiki-card__meta">{{ entry.typeLabel }}</span>
          <span class="wiki-card__title">{{ entry.title }}</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { sections } = useWikiRegistry()
const { show } = useRecall()
const { recent, hydrate } = useMemory()
const { canAnimate } = useIntensity()
const { run } = useGsap()
const randomEntries = useRandomWikiEntries(5)
const activeRandomIndex = ref<number | null>(null)
const sectionsEl = ref<HTMLElement | null>(null)
const randomCardsEl = ref<HTMLElement | null>(null)
const accentLineEl = ref<HTMLElement | null>(null)

const entries = computed(() => {
  const value = (randomEntries as any).value ?? randomEntries
  return Array.isArray(value) ? value : []
})

let randomTimer: number | null = null

onMounted(() => {
  hydrate()
  const tick = () => {
    const list = entries.value
    if (!list.length) return
    activeRandomIndex.value = Math.floor(Math.random() * list.length)
  }
  tick()
  randomTimer = window.setInterval(tick, 4500)

  if (!canAnimate.value) return
  run(({ gsap }) => {
    if (sectionsEl.value) {
      const cards = sectionsEl.value.querySelectorAll<HTMLElement>('.section-card')
      if (cards.length) {
        gsap.from(cards, { opacity: 0, y: 16, duration: 0.42, ease: 'power2.out', stagger: 0.05 })
      }
    }
    if (randomCardsEl.value) {
      const cards = randomCardsEl.value.querySelectorAll<HTMLElement>('.random-card')
      if (cards.length) {
        gsap.from(cards, { opacity: 0, y: 18, duration: 0.45, ease: 'power2.out', stagger: 0.06, delay: 0.08 })
      }
    }
    if (accentLineEl.value) {
      gsap.from(accentLineEl.value, {
        duration: 0.7,
        scaleX: 0,
        opacity: 0,
        ease: 'power3.out',
        transformOrigin: '50% 50%',
      })
    }
  })
})

onBeforeUnmount(() => {
  if (randomTimer != null) window.clearInterval(randomTimer)
})
</script>

<style scoped>
.home { padding-bottom: var(--space-6); }

.hero {
  text-align: center;
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--color-border-muted);
  margin-bottom: var(--space-5);
}

.hero .mem-id { margin-bottom: var(--space-2); }

.hero__title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  color: var(--color-gold);
  margin: 0 0 0.5rem;
  letter-spacing: 0.02em;
}

.hero__tagline {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-argalius-bright);
  margin: 0 0 0.75rem;
}

.hero__desc {
  max-width: 560px;
  margin: 0 auto 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.98rem;
}

.hero__recall {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding: 0.5rem 1rem;
  background: var(--color-gold-subtle);
  border: 1px solid var(--color-gold-dim);
  color: var(--color-gold);
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sections { margin-bottom: var(--space-6); }

.section-cards--row {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1100px) {
  .section-cards--row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 520px) {
  .section-cards--row { grid-template-columns: 1fr; }
}

.random-section {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-muted);
  margin-bottom: var(--space-4);
}

.random-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-3);
}

@media (max-width: 900px) {
  .random-cards { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 420px) {
  .random-cards { grid-template-columns: 1fr; }
}

.random-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4);
}

.random-card .wiki-card__meta {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.random-card--pulse { animation: random-card-pulse 0.9s ease-out; }

@keyframes random-card-pulse {
  0%, 100% { transform: translateY(0); }
  35% { transform: translateY(-3px); box-shadow: 0 0 18px rgba(126, 200, 200, 0.2); }
}
</style>
