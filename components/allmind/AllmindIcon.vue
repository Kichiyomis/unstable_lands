<script setup lang="ts">
import {
  PhHouse,
  PhMagnifyingGlass,
  PhGlobeHemisphereWest,
  PhUsers,
  PhMapTrifold,
  PhClock,
  PhGearSix,
  PhPackage,
  PhDotsThree,
  PhX,
  PhBookmarkSimple,
  PhSlidersHorizontal,
  PhShield,
  PhRocketLaunch,
  PhBrain,
  PhSword,
  PhMaskHappy,
  PhFlask,
  PhPuzzlePiece,
  PhDiamond,
  PhArrowLeft,
} from '@phosphor-icons/vue'

const icons = {
  house: PhHouse,
  search: PhMagnifyingGlass,
  globe: PhGlobeHemisphereWest,
  users: PhUsers,
  map: PhMapTrifold,
  clock: PhClock,
  gear: PhGearSix,
  package: PhPackage,
  more: PhDotsThree,
  close: PhX,
  pin: PhBookmarkSimple,
  sliders: PhSlidersHorizontal,
  shield: PhShield,
  rocket: PhRocketLaunch,
  brain: PhBrain,
  sword: PhSword,
  mask: PhMaskHappy,
  flask: PhFlask,
  puzzle: PhPuzzlePiece,
  diamond: PhDiamond,
  back: PhArrowLeft,
} as const

export type AllmindIconName = keyof typeof icons

const props = withDefaults(defineProps<{
  name: AllmindIconName
  size?: number | string
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
}>(), {
  size: 20,
  weight: 'regular',
})

const component = computed(() => icons[props.name] ?? PhGearSix)
</script>

<template>
  <component
    :is="component"
    :size="size"
    :weight="weight"
    aria-hidden="true"
  />
</template>
