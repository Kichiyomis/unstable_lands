<template>
  <Teleport to="body">
    <div v-if="open" class="sheet">
      <button type="button" class="sheet__backdrop" aria-label="Закрыть" @click="open = false" />
      <div class="sheet__panel" role="dialog" aria-label="Разделы и настройки">
        <div class="sheet__handle" />
        <h2>Архив</h2>
        <nav class="sheet__nav">
          <NuxtLink
            v-for="section in sections"
            :key="section.id"
            :to="section.path"
            class="sheet__link"
            @click="open = false"
          >
            <AllmindIcon :name="section.icon" :size="20" />
            <span>
              <strong>{{ section.title }}</strong>
              <small>{{ section.short }}</small>
            </span>
          </NuxtLink>
        </nav>

        <h2>Интенсивность</h2>
        <div class="sheet__chips">
          <button
            v-for="mode in modes"
            :key="mode.id"
            type="button"
            class="wiki-filter-chip"
            :class="{ 'wiki-filter-chip--active': intensity === mode.id }"
            @click="setIntensity(mode.id)"
          >
            {{ mode.label }}
          </button>
        </div>

        <h2>Размер текста</h2>
        <div class="sheet__chips">
          <button
            v-for="scale in scales"
            :key="scale"
            type="button"
            class="wiki-filter-chip"
            :class="{ 'wiki-filter-chip--active': textScale === scale }"
            @click="setTextScale(scale)"
          >
            {{ scale }}%
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { IntensityMode, TextScale } from '~/composables/useIntensity'

const open = useState('allmind-more-open', () => false)
const { sections } = useWikiRegistry()
const { intensity, textScale, setIntensity, setTextScale } = useIntensity()

const modes: { id: IntensityMode; label: string }[] = [
  { id: 'archive', label: 'Архив' },
  { id: 'operator', label: 'Оператор' },
  { id: 'spectacle', label: 'Спектакль' },
]
const scales: TextScale[] = ['100', '115', '130']
</script>

<style scoped>
.sheet {
  position: fixed;
  inset: 0;
  z-index: 180;
  display: flex;
  align-items: flex-end;
}

.sheet__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(5, 6, 10, 0.7);
}

.sheet__panel {
  position: relative;
  width: 100%;
  max-height: 82vh;
  overflow: auto;
  background: var(--color-bg-elevated);
  border-top: 1px solid var(--color-argalius);
  padding: 0.75rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom, 0px));
}

.sheet__handle {
  width: 48px;
  height: 4px;
  background: var(--color-border);
  margin: 0 auto 1rem;
}

.sheet__panel h2 {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-argalius);
  margin: 1rem 0 0.5rem;
  border: 0;
  padding: 0;
}

.sheet__nav {
  display: grid;
  gap: 0.35rem;
}

.sheet__link {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  min-height: 48px;
  color: var(--color-light);
  padding: 0.35rem 0;
}

.sheet__link small {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.sheet__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (min-width: 901px) {
  .sheet {
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .sheet__panel {
    width: min(420px, 100%);
    max-height: 80vh;
    border: 1px solid var(--color-argalius);
  }
}
</style>
