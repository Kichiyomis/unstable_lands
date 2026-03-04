<template>
  <figure v-if="src" class="wiki-image-block">
    <div class="wiki-image-block__img-wrap">
      <!-- Для путей из public/ используем обычный img, чтобы картинки гарантированно подтягивались -->
      <img
        v-if="isStaticPath"
        :src="imageSrc"
        :alt="caption || ''"
        class="wiki-image-block__img"
        loading="lazy"
      >
      <NuxtImg
        v-else
        :src="src"
        :alt="caption || ''"
        class="wiki-image-block__img"
        width="800"
        height="450"
      />
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

const isStaticPath = computed(() => typeof props.src === 'string' && (props.src.startsWith('/') || props.src.startsWith('./')))

const imageSrc = computed(() => {
  if (!props.src) return ''
  const path = props.src.startsWith('/') ? props.src : `/${props.src}`
  return baseURL + path
})
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
}

.wiki-image-block__img {
  width: auto;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.wiki-image-block__caption {
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-family: var(--font-ui);
  line-height: 1.4;
}
</style>
