<template>
  <nav v-if="items.length" class="wiki-toc" aria-label="Содержание досье">
    <a v-for="item in items" :key="item.id" :href="`#${item.id}`">{{ item.title }}</a>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ root?: string }>()
const items = ref<{ id: string; title: string }[]>([])

onMounted(() => {
  nextTick(() => {
    const root = props.root
      ? document.querySelector(props.root)
      : document.querySelector('.wiki-page')
    if (!root) return
    const headings = root.querySelectorAll('h3.wiki-block__title, .wiki-prose--html h3')
    items.value = Array.from(headings).map((el, i) => {
      const title = el.textContent?.trim() || `Секция ${i + 1}`
      if (!el.id) el.id = `sec-${i + 1}`
      return { id: el.id, title }
    })
  })
})
</script>
