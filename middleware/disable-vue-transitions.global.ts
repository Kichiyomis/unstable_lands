export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || typeof document === 'undefined' || !document.startViewTransition) {
    return
  }
  to.meta.pageTransition = false
  to.meta.layoutTransition = false
})
