export default defineNuxtPlugin(() => {
  if (process.server) return

  let frameId: number | null = null
  let start = 0

  const stop = () => {
    if (frameId != null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
    start = 0
    document.documentElement.style.setProperty('--glow-breath', '1')
  }

  const tick = (now: number) => {
    if (document.hidden) {
      frameId = window.requestAnimationFrame(tick)
      return
    }
    if (!shouldRun()) {
      stop()
      return
    }
    if (!start) start = now
    const t = (now - start) / 1000
    const value = 0.7 + 0.3 * Math.sin(t / 2)
    document.documentElement.style.setProperty('--glow-breath', value.toFixed(3))
    frameId = window.requestAnimationFrame(tick)
  }

  function shouldRun () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    const mode = document.documentElement.dataset.intensity
    return mode === 'operator' || mode === 'spectacle'
  }

  function sync () {
    if (shouldRun()) {
      if (frameId == null) frameId = window.requestAnimationFrame(tick)
    } else {
      stop()
    }
  }

  sync()
  const observer = new MutationObserver(sync)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-intensity'] })
  document.addEventListener('visibilitychange', sync)

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      stop()
    })
  }
})
