<template>
  <div class="home">
    <section class="hero">
      <div class="accent-line" style="margin-left: auto; margin-right: auto;" />
      <h1 class="hero__title">Нестабильные Земли</h1>
      <p class="hero__tagline">
        
      </p>
      <p class="hero__desc">
        Информационный портал по авторской D&D кампании: мир, персонажи, локации, история и механики.
      </p>
    </section>

    <section class="sections">
      <h2 class="wiki-section-heading">Разделы вики</h2>
      <div class="section-cards section-cards--row">
        <NuxtLink to="/world" class="section-card">
          <h3 class="section-card__title">Мир</h3>
          <p class="section-card__desc">Краткие описания мира</p>
        </NuxtLink>
        <NuxtLink to="/characters" class="section-card">
          <h3 class="section-card__title">Персонажи</h3>
          <p class="section-card__desc">Ключевые персонажи кампании</p>
        </NuxtLink>
        <NuxtLink to="/locations" class="section-card">
          <h3 class="section-card__title">Локации</h3>
          <p class="section-card__desc">Фрихольд и Кромка Теней</p>
        </NuxtLink>
        <NuxtLink to="/history" class="section-card">
          <h3 class="section-card__title">История</h3>
          <p class="section-card__desc">Хронология и эпохи: от Выхода Света до наших дней.</p>
        </NuxtLink>
        <NuxtLink to="/mechanics" class="section-card">
          <h3 class="section-card__title">Механики</h3>
          <p class="section-card__desc">Хобби (Пока что)</p>
        </NuxtLink>
      </div>
    </section>

    <section class="random-section">
      <h2 class="wiki-section-heading">Случайные страницы</h2>
      <div class="random-cards">
        <NuxtLink
          v-for="entry in randomEntries"
          :key="entry.path"
          :to="entry.path"
          class="random-card wiki-card"
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
}

.random-card .wiki-card__meta {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
