import { defineNuxtPlugin } from '#app'
import type { DirectiveBinding } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

let pluginsReady = false

function ensurePlugins () {
  if (pluginsReady) return
  gsap.registerPlugin(Flip)
  pluginsReady = true
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('expand-link', {
    mounted (el: HTMLElement, _binding: DirectiveBinding) {
      if (import.meta.server) return

      const handlePointerDown = () => {
        document.querySelectorAll('.wiki-vt-active').forEach(node => node.classList.remove('wiki-vt-active'))
        el.classList.add('wiki-vt-active')

        const archive = document.documentElement.dataset.intensity === 'archive'
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (archive || reduced) return

        ensurePlugins()
        const coarse = window.matchMedia('(pointer: coarse)').matches
        const duration = coarse ? 0.18 : 0.28

        if (typeof document.startViewTransition === 'function') return

        const state = Flip.getState(el)
        gsap.set(el, { opacity: 0.78, scale: 0.985 })
        Flip.from(state, {
          duration,
          ease: 'power2.out',
          absolute: false,
          scale: true,
          onComplete () {
            gsap.set(el, { clearProps: 'opacity,transform' })
          },
        })
      }

      el.addEventListener('pointerdown', handlePointerDown)
      ;(el as any).__expandLinkCleanup__ = () => {
        el.removeEventListener('pointerdown', handlePointerDown)
      }
    },
    unmounted (el: HTMLElement) {
      if ((el as any).__expandLinkCleanup__) {
        ;(el as any).__expandLinkCleanup__()
        delete (el as any).__expandLinkCleanup__
      }
    },
  })
})
