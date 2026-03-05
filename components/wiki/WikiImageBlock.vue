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
.wiki-image-block {
  margin: var(--space-4) 0;
  width: max-content;
}

.wiki-image-block__img-wrap {
  position: relative;
  width: auto;
  height: 480px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-muted);
  background: var(--color-surface);
  /* «дыхание» свечения вокруг рамки — управляется JS-переменной --glow-breath */
  box-shadow: 0 0 calc(18px * var(--glow-breath, 1)) rgba(25, 40, 72, 0.35);
  transition:
    transform 0.25s ease-out,
    box-shadow 0.4s ease-in-out;
}

.wiki-image-block__img {
  width: auto;
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
