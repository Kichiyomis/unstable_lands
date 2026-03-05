export default defineNuxtPlugin(() => {
  if (process.server) {
    return
  }

  let frameId: number | null = null

  const loop = (start: number) => {
    const step = (now: number) => {
      const t = (now - start) / 1000
      const value = 0.7 + 0.3 * Math.sin(t / 2) // очень медленное «дыхание»
      document.documentElement.style.setProperty('--glow-breath', value.toFixed(3))
      frameId = window.requestAnimationFrame(step)
    }

    frameId = window.requestAnimationFrame(step)
  }

  if (document.readyState === 'loading') {
    window.addEventListener(
      'DOMContentLoaded',
      () => {
        loop(performance.now())
      },
      { once: true },
    )
  } else {
    loop(performance.now())
  }

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      if (frameId != null) {
        cancelAnimationFrame(frameId)
      }
    })
  }
})

