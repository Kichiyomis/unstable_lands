<template>
  <figure v-if="src" ref="rootEl" class="wiki-image-block">
    <div
      ref="wrapEl"
      class="wiki-image-block__img-wrap"
      :style="wrapperStyle"
    >
      <!-- Для путей из public/ используем обычный img, чтобы картинки гарантированно подтягивались -->
      <img
        ref="imgEl"
        :src="imageSrc"
        :alt="caption || ''"
        class="wiki-image-block__img"
        loading="lazy"
      >
    </div>
    <figcaption v-if="caption" class="wiki-image-block__caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** Путь к изображению (например /images/characters/gebura.png или /images/locations/freehold.jpg) */
  src?: string
  /** Подпись под изображением */
  caption?: string
}>()

const config = useRuntimeConfig()
const baseURL = (config.app?.baseURL ?? '/').replace(/\/$/, '')

const rootEl = ref<HTMLElement | null>(null)
const parallaxOffset = ref(0)

const imageSrc = computed(() => {
  if (!props.src) return ''
  if (props.src.startsWith('http://') || props.src.startsWith('https://') || props.src.startsWith('//')) return props.src
  const path = props.src.startsWith('/') ? props.src : `/${props.src}`
  return baseURL + path
})

const wrapperStyle = computed(() => ({
  transform: `translateY(${parallaxOffset.value}px)`,
}))

if (process.client) {
  const updateParallax = () => {
    if (!rootEl.value) return
    const rect = rootEl.value.getBoundingClientRect()
    const vh = window.innerHeight || 1

    if (rect.bottom < 0 || rect.top > vh) {
      return
    }

    const center = rect.top + rect.height / 2
    const factor = (center - vh / 2) / vh // -0.5 .. 0.5
    const maxOffset = 18
    parallaxOffset.value = -factor * maxOffset
  }

  onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const archive = document.documentElement.dataset.intensity === 'archive'
    if (reduced || archive) return
    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    window.addEventListener('resize', updateParallax)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateParallax)
    window.removeEventListener('resize', updateParallax)
  })
}
</script>

<style scoped>
.wiki-image-block__img-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(5, 6, 10, 0.05) 40%, rgba(5, 6, 10, 0.72) 100%);
}

.wiki-image-block {
  margin: var(--space-4) 0;
  width: fit-content;
  max-width: 100%;
}

.wiki-image-block__img-wrap {
  position: relative;
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  height: min(480px, 70vw);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  /* «дыхание» свечения вокруг рамки — управляется JS-переменной --glow-breath */
  box-shadow:
    0 0 calc(18px * var(--glow-breath, 1)) rgba(126, 200, 200, 0.28),
    0 18px 40px rgba(0, 0, 0, 0.55);
  transition:
    transform 0.25s ease-out,
    box-shadow 0.4s ease-in-out;
}

.wiki-image-block__img {
  width: auto;
  max-width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  transition: transform 0.25s ease-out;
}

.wiki-image-block__caption {
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-family: var(--font-ui);
  line-height: 1.4;
}
</style>
