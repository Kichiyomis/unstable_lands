import type { DirectiveBinding } from 'vue'
import { defineNuxtPlugin } from '#app'
import { gsap } from 'gsap'

type PressAnimOptions = {
  highlightColor?: string
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('press-anim', {
    mounted (el: HTMLElement, binding: DirectiveBinding<PressAnimOptions | undefined>) {
      if (import.meta.server) return

      const opts = binding.value ?? {}
      const computed = window.getComputedStyle(el)
      const baseShadow = computed.boxShadow === 'none' ? '0 0 0 rgba(0,0,0,0)' : computed.boxShadow
      const baseBg = computed.backgroundColor
      const baseBorderColor = computed.borderColor
      const activeShadow =
        opts.highlightColor ??
        '0 0 26px rgba(201, 162, 39, 0.42)'

      const state: any = {
        baseShadow,
        baseBg,
        baseBorderColor,
        isHovered: false,
      }

      ;(el as any).__pressAnimState__ = state

      const hoverIn = () => {
        state.isHovered = true
        gsap.to(el, {
          duration: 0.18,
          y: -3,
          scale: 1.01,
          boxShadow: activeShadow,
          borderColor: 'var(--color-gold-dim)',
          backgroundColor: baseBg === 'rgba(0, 0, 0, 0)' ? 'var(--color-surface)' : baseBg,
          ease: 'power2.out',
        })
      }

      const hoverOut = () => {
        state.isHovered = false
        gsap.to(el, {
          duration: 0.24,
          y: 0,
          scale: 1,
          boxShadow: state.baseShadow,
          borderColor: state.baseBorderColor,
          backgroundColor: state.baseBg,
          ease: 'power2.out',
        })
      }

      const pressIn = () => {
        gsap.to(el, {
          duration: 0.1,
          y: -1,
          scale: 0.99,
          ease: 'power2.out',
        })
      }

      const pressOut = () => {
        if (state.isHovered) {
          hoverIn()
        } else {
          hoverOut()
        }
      }

      const handlePointerEnter = () => {
        hoverIn()
      }
      const handlePointerLeave = () => {
        hoverOut()
      }
      const handlePointerDown = () => {
        pressIn()
      }
      const handlePointerUp = () => {
        pressOut()
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          pressIn()
        }
      }
      const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          pressOut()
        }
      }

      el.addEventListener('pointerenter', handlePointerEnter)
      el.addEventListener('pointerleave', handlePointerLeave)
      el.addEventListener('pointerdown', handlePointerDown)
      el.addEventListener('pointerup', handlePointerUp)
      el.addEventListener('keydown', handleKeyDown)
      el.addEventListener('keyup', handleKeyUp)

      ;(el as any).__pressAnimCleanup__ = () => {
        el.removeEventListener('pointerenter', handlePointerEnter)
        el.removeEventListener('pointerleave', handlePointerLeave)
        el.removeEventListener('pointerdown', handlePointerDown)
        el.removeEventListener('pointerup', handlePointerUp)
        el.removeEventListener('keydown', handleKeyDown)
        el.removeEventListener('keyup', handleKeyUp)
      }
    },
    unmounted (el: HTMLElement) {
      if ((el as any).__pressAnimCleanup__) {
        ;(el as any).__pressAnimCleanup__()
        delete (el as any).__pressAnimCleanup__
        delete (el as any).__pressAnimState__
      }
    },
  })
})


