<template>
  <nav class="dock" aria-label="Навигация ALLMIND">
    <NuxtLink to="/" class="dock__btn" active-class="dock__btn--active">
      <AllmindIcon name="house" :size="22" />
      <span>Главная</span>
    </NuxtLink>
    <button type="button" class="dock__btn" :class="{ 'dock__btn--active': recallOpen }" @click="showRecall">
      <AllmindIcon name="search" :size="22" />
      <span>Recall</span>
    </button>
    <NuxtLink
      v-if="currentSection"
      :to="currentSection.path"
      class="dock__btn"
      active-class="dock__btn--active"
    >
      <AllmindIcon :name="currentSection.icon" :size="22" />
      <span>{{ currentSection.title }}</span>
    </NuxtLink>
    <button v-else type="button" class="dock__btn" @click="toggleMore">
      <AllmindIcon name="globe" :size="22" />
      <span>Архив</span>
    </button>
    <button type="button" class="dock__btn" :class="{ 'dock__btn--active': moreOpen }" @click="toggleMore">
      <AllmindIcon name="more" :size="22" />
      <span>Ещё</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const { currentSection } = useWikiRegistry()
const { open: recallOpen, show } = useRecall()
const moreOpen = useState('allmind-more-open', () => false)

function showRecall () {
  moreOpen.value = false
  show()
}

function toggleMore () {
  moreOpen.value = !moreOpen.value
}
</script>

<style scoped>
.dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 110;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  min-height: var(--dock-height);
  padding: 0.35rem 0.5rem calc(0.35rem + env(safe-area-inset-bottom, 0px));
  background: rgba(10, 13, 20, 0.94);
  border-top: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.dock__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  min-height: 44px;
  background: transparent;
  border: 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
}

.dock__btn--active,
.dock__btn.router-link-active {
  color: var(--color-gold);
}

@media (min-width: 901px) {
  .dock { display: none; }
}
</style>
