<template>
  <Teleport to="body">
    <div v-if="open" class="recall" role="dialog" aria-modal="true" aria-label="Recall — поиск памяти">
      <button type="button" class="recall__backdrop" aria-label="Закрыть" @click="hide" />
      <div class="recall__panel">
        <div class="recall__head">
          <span class="mem-id">MEM://recall</span>
          <button type="button" class="recall__close" aria-label="Закрыть" @click="hide">
            <AllmindIcon name="close" :size="20" />
          </button>
        </div>
        <input
          ref="inputEl"
          v-model="query"
          type="search"
          class="recall__input"
          placeholder="Вспомнить имя, место, механику…"
          aria-label="Запрос Recall"
        />
        <p v-if="query.trim().length < 2" class="recall__hint">
          Введите минимум 2 символа. Недавние записи ниже.
        </p>
        <p v-else-if="!results.length" class="recall__hint">
          Ничего не найдено. Попробуйте другое написание.
        </p>
        <div v-if="query.trim().length < 2 && !pins.length && !recent.length" class="recall__hints">
          <button
            v-for="hint in hints"
            :key="hint"
            type="button"
            class="wiki-filter-chip"
            @click="query = hint"
          >
            {{ hint }}
          </button>
        </div>
        <div v-if="query.trim().length < 2 && (pins.length || recent.length)" class="recall__lists">
          <section v-if="pins.length">
            <h2>Закреплено</h2>
            <NuxtLink v-for="item in pins" :key="item.path" :to="item.path" class="recall__row" @click="hide">
              <span class="recall__type">{{ item.typeLabel }}</span>
              <span>{{ item.title }}</span>
            </NuxtLink>
          </section>
          <section v-if="recent.length">
            <h2>Недавние</h2>
            <NuxtLink v-for="item in recent" :key="item.path" :to="item.path" class="recall__row" @click="hide">
              <span class="recall__type">{{ item.typeLabel }}</span>
              <span>{{ item.title }}</span>
            </NuxtLink>
          </section>
        </div>
        <div v-else-if="query.trim().length >= 2" class="recall__lists">
          <section v-for="group in grouped" :key="group.type">
            <h2>{{ group.label }}</h2>
            <NuxtLink
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="recall__row"
              @click="hide"
            >
              <span class="recall__type">{{ item.typeLabel }}</span>
              <span>{{ item.title }}</span>
              <small v-if="item.snippet">{{ item.snippet }}</small>
            </NuxtLink>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { open, query, results, grouped, hide } = useRecall()
const { recent, pins, hydrate } = useMemory()
const inputEl = ref<HTMLInputElement | null>(null)
const hints = ['Гебура', 'Фрихольд', 'Арсенал', 'Выход Света']

watch(open, async (v) => {
  if (v) {
    hydrate()
    await nextTick()
    inputEl.value?.focus()
  }
})

function onKey (e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
  if (e.key === 'Escape' && open.value) hide()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.recall {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 1rem 1rem;
}

.recall__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(5, 6, 10, 0.78);
}

.recall__panel {
  position: relative;
  width: min(640px, 100%);
  max-height: 76vh;
  overflow: auto;
  background: var(--color-bg-card);
  border: 1px solid var(--color-argalius);
  padding: 1rem;
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
}

.recall__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recall__close {
  background: transparent;
  border: 0;
  color: var(--color-text-muted);
  min-width: 44px;
  min-height: 44px;
}

.recall__input {
  width: 100%;
  margin: 0.5rem 0 0.75rem;
  padding: 0.75rem 0.85rem;
  min-height: 48px;
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.recall__hint {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin: 0 0 0.75rem;
}

.recall__hints {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.recall__lists h2 {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-argalius);
  margin: 0.75rem 0 0.35rem;
  border: 0;
  padding: 0;
}

.recall__row {
  display: grid;
  gap: 0.15rem;
  padding: 0.65rem 0.25rem;
  min-height: 44px;
  border-bottom: 1px solid var(--color-border-muted);
  color: var(--color-light);
}

.recall__row small {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.recall__type {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-argalius);
}
</style>
