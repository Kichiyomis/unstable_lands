<template>
  <aside v-if="related.length" class="wiki-related">
    <h2>Связанные записи</h2>
    <NuxtLink v-for="item in related" :key="item.path" :to="item.path">
      <span class="wiki-meta">{{ item.typeLabel }}</span>
      {{ item.title }}
    </NuxtLink>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{ path: string }>()
const { related } = useBacklinks(() => props.path)
</script>
