<template>
  <article class="wiki-page">
    <h1 class="wiki-page-title">Персонажи</h1>
    <p class="wiki-page-lead">
      Персонажи вселенной «Нестабильные Земли».
    </p>
    <div class="entry-grid">
      <NuxtLink
        v-for="char in characters"
        :key="char.slug"
        :to="`/characters/${char.slug}`"
        class="entry-card"
        :class="{ 'entry-card--no-image': !(char.image || char.thumbnail) }"
      >
        <div v-if="char.image || char.thumbnail" class="entry-card__thumb">
          <img
            :src="thumbSrc(char)"
            :alt="char.name"
            width="200"
            height="200"
            loading="lazy"
          />
        </div>
        <div class="entry-card__body">
          <h2 class="entry-card__title">{{ char.name }}</h2>
          <p v-if="char.role" class="entry-card__meta">{{ char.role }}</p>
        </div>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const { characters } = useCharacters()
const config = useRuntimeConfig()
const baseURL = (config.app?.baseURL ?? '/').replace(/\/$/, '')

function thumbSrc (char: { image?: string; thumbnail?: string }) {
  const path = (char.thumbnail ?? char.image) ?? ''
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return baseURL + p
}
</script>
