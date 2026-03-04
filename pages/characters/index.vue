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
          <NuxtImg
            :src="(char.thumbnail ?? char.image)!"
            :alt="char.name"
            width="200"
            height="200"
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
</script>
