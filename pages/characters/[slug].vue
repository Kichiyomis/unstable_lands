<template>
  <article v-if="character" class="wiki-page">
    <WikiImageBlock
      v-if="character.image || character.thumbnail"
      :src="character.image ?? character.thumbnail!"
      :caption="character.imageCaption"
    />
    <WikiCardCharacter
      :name="character.name"
      :role="character.role"
      :status="character.status"
      :image=" character.thumbnail ??character.image"
      :summary="character.summary"
    >
      <div v-if="character.description" class="wiki-block">
        <h3 class="wiki-block__title">Описание</h3>
        <div class="wiki-prose wiki-prose--html" v-html="character.description" />
      </div>
      <div v-if="character.appearance" class="wiki-block">
        <h3 class="wiki-block__title">Внешность и характер</h3>
        <div class="wiki-prose wiki-prose--html" v-html="character.appearance" />
      </div>
      <div v-if="character.biography" class="wiki-block">
        <h3 class="wiki-block__title">Биография</h3>
        <div class="wiki-prose wiki-prose--html" v-html="character.biography" />
      </div>
      <div v-if="character.motivation" class="wiki-block">
        <h3 class="wiki-block__title">Мотивация и цели</h3>
        <div class="wiki-prose wiki-prose--html" v-html="character.motivation" />
      </div>
      <div v-if="character.relationships" class="wiki-block">
        <h3 class="wiki-block__title">Отношения</h3>
        <div class="wiki-prose wiki-prose--html" v-html="character.relationships" />
      </div>
      <div v-if="character.quotes?.length" class="wiki-block">
        <h3 class="wiki-block__title">Цитаты</h3>
        <ul class="wiki-quotes">
          <li v-for="(q, i) in character.quotes" :key="i">{{ q }}</li>
        </ul>
      </div>
    </WikiCardCharacter>
  </article>
  <article v-else class="wiki-page">
    <h1 class="wiki-page-title">Не найдено</h1>
    <p class="wiki-page-lead">Персонаж с таким адресом не найден.</p>
    <NuxtLink to="/characters" class="wiki-back-link">← К списку персонажей</NuxtLink>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getCharacterBySlug } = useCharacters()
const character = computed(() => getCharacterBySlug(slug.value))
</script>

<style scoped>
.wiki-quotes {
  margin: 0.5em 0 0;
  padding-left: 1.25rem;
  font-style: italic;
  color: var(--color-text-muted);
}
</style>
