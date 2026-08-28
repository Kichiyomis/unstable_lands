<template>
  <Teleport to="body">
    <div v-if="visible" class="boot" role="dialog" aria-label="Загрузка индекса ALLMIND">
      <p class="boot__id">MEM://boot</p>
      <p class="boot__title">ALLMIND</p>
      <p ref="lineEl" class="boot__line">{{ line }}</p>
      <button type="button" class="wiki-filter-chip wiki-filter-chip--active" @click="skip">
        Пропустить
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { isSpectacle, hydrate } = useIntensity()
const { scramble, canAnimate } = useGsap()
const visible = ref(false)
const line = ref('Инициализация индекса памяти…')
const lineEl = ref<HTMLElement | null>(null)
const KEY = 'allmind-boot-seen'
let t: number | null = null
let done: number | null = null

onMounted(() => {
  hydrate()
  if (!isSpectacle.value) return
  if (sessionStorage.getItem(KEY)) return
  visible.value = true
  nextTick(() => {
    if (lineEl.value && canAnimate.value) scramble(lineEl.value, line.value, 0.7)
  })
  t = window.setTimeout(() => {
    line.value = 'Связь с Арсеналом установлена.'
    if (lineEl.value && canAnimate.value) scramble(lineEl.value, line.value, 0.45)
  }, 400)
  done = window.setTimeout(skip, 1200)
})

onBeforeUnmount(() => {
  if (t != null) window.clearTimeout(t)
  if (done != null) window.clearTimeout(done)
})

function skip () {
  visible.value = false
  if (t != null) window.clearTimeout(t)
  if (done != null) window.clearTimeout(done)
  if (import.meta.client) sessionStorage.setItem(KEY, '1')
}
</script>

<style scoped>
.boot {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--color-bg);
  color: var(--color-argalius);
  font-family: var(--font-mono);
  text-align: center;
  padding: 1.5rem;
}

.boot__id {
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.boot__title {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-gold);
  margin: 0;
}

.boot__line {
  color: var(--color-text-muted);
  margin: 0 0 1rem;
}
</style>
