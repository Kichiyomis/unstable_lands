import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

function registerPlugins () {
  if (registered || !import.meta.client) return
  gsap.registerPlugin(Flip, ScrollTrigger)
  registered = true
}

export function useGsap (scope?: MaybeRefOrGetter<HTMLElement | null | undefined>) {
  const { canAnimate, intensity } = useIntensity()
  let ctx: gsap.Context | null = null
  let mm: gsap.MatchMedia | null = null

  onMounted(() => {
    registerPlugins()
  })

  onBeforeUnmount(() => {
    ctx?.revert()
    mm?.revert()
    ctx = null
    mm = null
  })

  function run (fn: (tools: {
    gsap: typeof gsap
    Flip: typeof Flip
    ScrollTrigger: typeof ScrollTrigger
  }) => void) {
    if (!import.meta.client) return
    registerPlugins()
    if (!canAnimate.value) return
    const el = scope ? toValue(scope) : undefined
    ctx?.revert()
    ctx = gsap.context(() => {
      fn({ gsap, Flip, ScrollTrigger })
    }, el ?? undefined)
  }

  function match (config: Record<string, () => void>) {
    if (!import.meta.client || !canAnimate.value) return
    registerPlugins()
    mm?.revert()
    mm = gsap.matchMedia()
    for (const [query, fn] of Object.entries(config)) {
      mm.add(query, () => {
        fn()
      })
    }
  }

  function onHiddenPause (tl: gsap.core.Timeline | gsap.core.Tween) {
    if (!import.meta.client) return
    const handler = () => {
      if (document.hidden) tl.pause()
      else tl.resume()
    }
    document.addEventListener('visibilitychange', handler)
    onBeforeUnmount(() => document.removeEventListener('visibilitychange', handler))
  }

  function scramble (el: HTMLElement, finalText: string, duration = 0.55) {
    if (!import.meta.client || !canAnimate.value) {
      el.textContent = finalText
      return
    }
    registerPlugins()
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/:'
    const state = { t: 0 }
    const tween = gsap.to(state, {
      t: 1,
      duration,
      ease: 'none',
      onUpdate () {
        if (state.t > 0.72) {
          el.textContent = finalText
          return
        }
        el.textContent = finalText
          .split('')
          .map((ch) => (ch === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)]))
          .join('')
      },
      onComplete () {
        el.textContent = finalText
      },
    })
    onHiddenPause(tween)
  }

  return {
    gsap,
    Flip,
    ScrollTrigger,
    canAnimate,
    intensity,
    run,
    match,
    onHiddenPause,
    scramble,
    registerPlugins,
  }
}
