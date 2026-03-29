<template>
  <div class="home">
    <section class="hero">
      <div ref="accentLineEl" class="accent-line" style="margin-left: auto; margin-right: auto;" />
      <h1 class="hero__title">Нестабильные Земли</h1>
      <p class="hero__tagline">
        
      </p>
      <p class="hero__desc">
        Информационный портал по авторской D&D кампании: мир, персонажи, локации, история и механики.
      </p>
    </section>

    <section class="sections">
      <h2 class="wiki-section-heading">Разделы вики</h2>
      <div ref="sectionsEl" class="section-cards section-cards--row">
        <NuxtLink to="/world" class="section-card" v-tilt v-press-anim v-expand-link>
          <h3 class="section-card__title">Мир</h3>
          <p class="section-card__desc">Краткие описания мира</p>
        </NuxtLink>
        <NuxtLink to="/characters" class="section-card" v-tilt v-press-anim v-expand-link>
          <h3 class="section-card__title">Персонажи</h3>
          <p class="section-card__desc">Ключевые персонажи кампании</p>
        </NuxtLink>
        <NuxtLink to="/locations" class="section-card" v-tilt v-press-anim v-expand-link>
          <h3 class="section-card__title">Локации</h3>
          <p class="section-card__desc">Фрихольд и Кромка Теней</p>
        </NuxtLink>
        <NuxtLink to="/history" class="section-card" v-tilt v-press-anim v-expand-link>
          <h3 class="section-card__title">История</h3>
          <p class="section-card__desc">Хронология и эпохи: от Выхода Света до наших дней.</p>
        </NuxtLink>
        <NuxtLink to="/mechanics" class="section-card" v-tilt v-press-anim v-expand-link>
          <h3 class="section-card__title">Механики</h3>
          <p class="section-card__desc">Хобби (Пока что)</p>
        </NuxtLink>
        <NuxtLink to="/goods" class="section-card" v-tilt v-press-anim v-expand-link>
          <h3 class="section-card__title">Товары</h3>
          <p class="section-card__desc">Одноразовые предметы и расходники</p>
        </NuxtLink>
      </div>
    </section>

    <section class="random-section">
      <h2 class="wiki-section-heading">Случайные страницы</h2>
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
const randomEntries = useRandomWikiEntries(5)
const activeRandomIndex = ref<number | null>(null)
const sectionsEl = ref<HTMLElement | null>(null)
const randomCardsEl = ref<HTMLElement | null>(null)
const accentLineEl = ref<HTMLElement | null>(null)

const entries = computed(() => {
  // поддержка как ref, так и прямого массива на всякий случай
  const value = (randomEntries as any).value ?? randomEntries
  return Array.isArray(value) ? value : []
})

let randomTimer: number | null = null

onMounted(async () => {
  const tick = () => {
    const list = entries.value
    if (!list.length) return
    activeRandomIndex.value = Math.floor(Math.random() * list.length)
  }

  tick()
  randomTimer = window.setInterval(tick, 4500)

  if (import.meta.client) {
    try {
      const mod = await import('gsap')
      const gsap = mod.gsap

      if (sectionsEl.value) {
        const cards = sectionsEl.value.querySelectorAll<HTMLElement>('.section-card')
        if (cards.length) {
          gsap.from(cards, {
            opacity: 0,
            y: 16,
            duration: 0.42,
            ease: 'power2.out',
            stagger: 0.05,
          })
        }
      }

      if (randomCardsEl.value) {
        const cards = randomCardsEl.value.querySelectorAll<HTMLElement>('.random-card')
        if (cards.length) {
          gsap.from(cards, {
            opacity: 0,
            y: 18,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.06,
            delay: 0.08,
          })
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
    } catch {
      // gsap необязателен для работы страницы
    }
  }
})

onBeforeUnmount(() => {
  if (randomTimer != null) {
    window.clearInterval(randomTimer)
  }
})
</script>

<style scoped>
.home {
  padding-bottom: var(--space-6);
}

.hero {
  text-align: center;
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--color-border-muted);
  margin-bottom: var(--space-5);
}

.hero__title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--color-gold);
  margin: 0 0 0.5rem;
  letter-spacing: 0.02em;
}

.hero__tagline {
  font-size: 1.1rem;
  color: var(--color-argalius-bright);
  margin: 0 0 0.75rem;
  font-style: italic;
}

.hero__desc {
  max-width: 560px;
  margin: 0 auto;
  color: var(--color-text-muted);
  font-size: 0.98rem;
}

.sections {
  margin-bottom: var(--space-6);
}

/* В одну строку на широких экранах */
.section-cards--row {
  grid-template-columns: repeat(5, 1fr);
}

@media (max-width: 1100px) {
  .section-cards--row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .section-cards--row {
    grid-template-columns: 1fr;
  }
}

.section-cards--row .section-card {
  padding: var(--space-3) var(--space-4);
}

/* Случайные — те же карточки */
.random-section {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-muted);
}

.random-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-3);
}

@media (max-width: 900px) {
  .random-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 420px) {
  .random-cards {
    grid-template-columns: 1fr;
  }
}

.random-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4);
  transition:
    transform 0.18s ease-out,
    box-shadow 0.18s ease-out,
    border-color var(--transition),
    background var(--transition);
}

.random-card .wiki-card__meta {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.random-card--pulse {
  animation: random-card-pulse 0.9s ease-out;
}

@keyframes random-card-pulse {
  0% {
    transform: translateY(0) scale(1);
    box-shadow: var(--shadow-soft);
  }
  35% {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 0 18px rgba(201, 162, 39, 0.25);
  }
  100% {
    transform: translateY(0) scale(1);
    box-shadow: var(--shadow-soft);
  }
}
</style>
