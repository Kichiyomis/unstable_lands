export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tilt', {
    mounted (el: HTMLElement, binding) {
      if (import.meta.server) return
      if (!window.matchMedia('(pointer: fine)').matches) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const maxTilt = typeof binding.value === 'number'
        ? binding.value
        : typeof binding.value?.max === 'number'
          ? binding.value.max
          : 6

      const handleMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const midX = rect.width / 2
        const midY = rect.height / 2

        const normX = (x - midX) / midX
        const normY = (y - midY) / midY

        const rotateX = Math.max(Math.min(normY * -maxTilt, maxTilt), -maxTilt)
        const rotateY = Math.max(Math.min(normX * maxTilt, maxTilt), -maxTilt)

        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
      }

      const reset = () => {
        el.style.transform = ''
      }

      el.addEventListener('mousemove', handleMove)
      el.addEventListener('mouseleave', reset)

      ;(el as any).__tiltCleanup__ = () => {
        el.removeEventListener('mousemove', handleMove)
        el.removeEventListener('mouseleave', reset)
      }
    },
    unmounted (el: HTMLElement) {
      if ((el as any).__tiltCleanup__) {
        ;(el as any).__tiltCleanup__()
        delete (el as any).__tiltCleanup__
      }
    },
  })
})

