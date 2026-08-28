export type IntensityMode = 'archive' | 'operator' | 'spectacle'
export type TextScale = '100' | '115' | '130'

const INTENSITY_KEY = 'allmind-intensity'
const SCALE_KEY = 'allmind-text-scale'

function prefersReducedMotion (): boolean {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isPhone (): boolean {
  if (!import.meta.client) return false
  return window.matchMedia('(max-width: 900px)').matches || window.matchMedia('(pointer: coarse)').matches
}

function defaultIntensity (): IntensityMode {
  if (prefersReducedMotion()) return 'archive'
  if (isPhone()) return 'archive'
  return 'spectacle'
}

export function useIntensity () {
  const intensity = useState<IntensityMode>('allmind-intensity', () => 'operator')
  const textScale = useState<TextScale>('allmind-text-scale', () => '100')
  const ready = useState('allmind-intensity-ready', () => false)

  const canAnimate = computed(() => intensity.value !== 'archive' && !prefersReducedMotion())
  const isSpectacle = computed(() => intensity.value === 'spectacle' && canAnimate.value)

  function applyToDom () {
    if (!import.meta.client) return
    const html = document.documentElement
    html.dataset.intensity = intensity.value
    html.dataset.textScale = textScale.value
  }

  function setIntensity (mode: IntensityMode) {
    intensity.value = prefersReducedMotion() ? 'archive' : mode
    if (import.meta.client) localStorage.setItem(INTENSITY_KEY, intensity.value)
    applyToDom()
  }

  function setTextScale (scale: TextScale) {
    textScale.value = scale
    if (import.meta.client) localStorage.setItem(SCALE_KEY, scale)
    applyToDom()
  }

  function hydrate () {
    if (!import.meta.client || ready.value) return
    const stored = localStorage.getItem(INTENSITY_KEY) as IntensityMode | null
    const storedScale = localStorage.getItem(SCALE_KEY) as TextScale | null
    if (storedScale === '100' || storedScale === '115' || storedScale === '130') {
      textScale.value = storedScale
    }
    if (prefersReducedMotion()) {
      intensity.value = 'archive'
    } else if (stored === 'archive' || stored === 'operator' || stored === 'spectacle') {
      intensity.value = stored
    } else {
      intensity.value = defaultIntensity()
    }
    applyToDom()
    ready.value = true

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => {
      if (mq.matches) setIntensity('archive')
    }
    mq.addEventListener?.('change', onMotion)
  }

  return {
    intensity,
    textScale,
    canAnimate,
    isSpectacle,
    setIntensity,
    setTextScale,
    hydrate,
    applyToDom,
  }
}
