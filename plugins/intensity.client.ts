export default defineNuxtPlugin(() => {
  const { hydrate } = useIntensity()
  if (import.meta.client) hydrate()
})
