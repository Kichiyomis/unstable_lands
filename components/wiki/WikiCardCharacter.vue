<template>
  <article class="wiki-card wiki-card--character" v-tilt="{ max: 3 }">
    <header class="wiki-card__header">
      <div v-if="image" class="wiki-card__image">
        <img :src="imageSrc" :alt="name" width="120" height="120" class="wiki-card__img" loading="lazy" />
      </div>
      <div class="wiki-card__meta-wrap">
        <h2 class="wiki-card__title">{{ name }}</h2>
        <p v-if="role" class="wiki-card__meta">{{ role }}</p>
        <p v-if="status" class="wiki-card__status">
          <span class="wiki-card__status-label">Статус:</span> {{ status }}
        </p>
      </div>
    </header>
    <div ref="bodyWrapEl" class="wiki-card__body-wrap">
      <div ref="bodyEl" class="wiki-card__body">
        <div v-if="summary" class="wiki-card__summary">
          {{ summary }}
        </div>
        <slot />
      </div>
      <div ref="fogEl" class="wiki-card__fog" aria-hidden="true" />
    </div>
    <svg class="wiki-card__fog-defs" aria-hidden="true">
      <defs>
        <filter id="wiki-fog-noise" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            ref="turbulenceEl"
            type="fractalNoise"
            baseFrequency="0.012 0.045"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            ref="displacementEl"
            in="SourceGraphic"
            in2="noise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
    </svg>
  </article>
</template>


<script setup lang="ts">
const props = defineProps<{
  name: string
  role?: string
  status?: string
  image?: string
  summary?: string
}>()

const config = useRuntimeConfig()
const baseURL = (config.app?.baseURL ?? '/').replace(/\/$/, '')
const imageSrc = computed(() => {
  if (!props.image) return ''
  if (props.image.startsWith('http://') || props.image.startsWith('https://') || props.image.startsWith('//')) return props.image
  const path = props.image.startsWith('/') ? props.image : `/${props.image}`
  return baseURL + path
})

const bodyWrapEl = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)
const fogEl = ref<HTMLElement | null>(null)
const turbulenceEl = ref<SVGFETurbulenceElement | null>(null)
const displacementEl = ref<SVGFEDisplacementMapElement | null>(null)

if (import.meta.client) {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const isNarrow = window.innerWidth < 768
  const enableFog = !prefersReducedMotion && !isNarrow && document.documentElement.dataset.intensity === 'spectacle'
  let bodyObserver: IntersectionObserver | null = null
  let resizeRaf = 0
  let lineNodes: HTMLElement[] = []
  let gsapLib: any = null
  let noiseTween: any = null
  let displacementTween: any = null

  const clearFog = () => {
    bodyObserver?.disconnect()
    bodyObserver = null
    lineNodes.forEach(node => node.remove())
    lineNodes = []
  }

  const decorateFogLine = (line: HTMLElement) => {
    for (let i = 0; i < 3; i += 1) {
      const blob = document.createElement('span')
      blob.className = `wiki-entry-intro__fog-blob wiki-entry-intro__fog-blob--${i + 1}`
      line.appendChild(blob)
    }
  }

  const animateFogLine = (line: HTMLElement) => {
    if (line.dataset.revealed === '1') return
    line.dataset.revealed = '1'
    const blobs = Array.from(line.querySelectorAll('.wiki-entry-intro__fog-blob')) as HTMLElement[]

    if (!gsapLib) {
      line.remove()
      return
    }

    gsapLib.set(line, {
      xPercent: -18,
      yPercent: 9,
      scaleX: 1.06,
      scaleY: 1.02,
      opacity: 0,
    })

    const tl = gsapLib.timeline({
      onComplete: () => line.remove(),
    })

    tl.to(line, { opacity: 1, duration: 0.24, ease: 'power2.out' })
      .to(line, {
        xPercent: 112,
        yPercent: -12,
        scaleX: 1.1,
        scaleY: 1.05,
        opacity: 0,
        duration: 1.95,
        ease: 'sine.inOut',
      }, 0)

    blobs.forEach((blob, index) => {
      const drift = index === 0 ? -8 : index === 1 ? 4 : 11
      const scaleTarget = index === 1 ? 1.22 : 1.1
      tl.fromTo(
        blob,
        { xPercent: -8, yPercent: 0, scale: 0.96, opacity: 0.74 },
        {
          xPercent: 34 + index * 20,
          yPercent: drift,
          scale: scaleTarget,
          opacity: index === 1 ? 0.2 : 0.3,
          duration: 1.7,
          ease: 'sine.inOut',
        },
        0.05 * index,
      )
    })
  }

  const buildFogLines = () => {
    if (!enableFog) return
    if (!bodyEl.value || !fogEl.value) return
    clearFog()

    const range = document.createRange()
    range.selectNodeContents(bodyEl.value)
    const bodyRect = bodyEl.value.getBoundingClientRect()
    const rects = Array.from(range.getClientRects())
      .filter(rect => rect.width > 6 && rect.height > 8)
      .sort((a, b) => (Math.abs(a.top - b.top) < 1 ? a.left - b.left : a.top - b.top))

    type VisualLine = { top: number; left: number; right: number; height: number }
    const lines: VisualLine[] = []

    for (const rect of rects) {
      const top = rect.top - bodyRect.top
      const left = rect.left - bodyRect.left
      const right = rect.right - bodyRect.left
      const height = rect.height

      const prev = lines[lines.length - 1]
      if (prev && Math.abs(prev.top - top) < 4) {
        prev.left = Math.min(prev.left, left)
        prev.right = Math.max(prev.right, right)
        prev.height = Math.max(prev.height, height)
      } else {
        lines.push({ top, left, right, height })
      }
    }

    if (!lines.length) return

    for (const lineData of lines) {
      const line = document.createElement('span')
      line.className = 'wiki-entry-intro__fog-line'

      const padX = 60
      const padY = Math.max(10, lineData.height * 0.7)
      const width = Math.max(120, lineData.right - lineData.left + padX * 2)
      const height = Math.max(40, lineData.height + padY)

      line.style.left = `${lineData.left - padX}px`
      line.style.top = `${lineData.top - (height - lineData.height) / 2}px`
      line.style.width = `${width}px`
      line.style.height = `${height}px`

      decorateFogLine(line)
      fogEl.value.appendChild(line)
      lineNodes.push(line)
    }

    bodyObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          animateFogLine(entry.target as HTMLElement)
          bodyObserver?.unobserve(entry.target)
        }
      },
      {
        threshold: 0.45,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    lineNodes.forEach(line => bodyObserver?.observe(line))
  }

  onMounted(async () => {
    try {
      const mod = await import('gsap')
      gsapLib = mod.gsap
    } catch {
      gsapLib = null
    }

    if (bodyEl.value && fogEl.value && enableFog) {
      let retryCount = 0
      const maxRetries = 2
      const init = () => {
        buildFogLines()
        if (lineNodes.length === 0 && retryCount < maxRetries) {
          retryCount += 1
          setTimeout(init, retryCount === 1 ? 100 : 280)
        }
      }

      await nextTick()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          init()
          ;(document as any).fonts?.ready?.then(() => init())
        })
      })

      const startFilterTweens = () => {
        if (!gsapLib) return
        if (turbulenceEl.value && !noiseTween?.isActive?.()) {
          noiseTween = gsapLib.to(turbulenceEl.value, {
            attr: { baseFrequency: '0.018 0.068' },
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        }
        if (displacementEl.value && !displacementTween?.isActive?.()) {
          displacementTween = gsapLib.to(displacementEl.value, {
            attr: { scale: 30 },
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        }
      }
      const stopFilterTweens = () => {
        noiseTween?.kill?.()
        noiseTween = null
        displacementTween?.kill?.()
        displacementTween = null
      }

      const visibilityObserver = bodyWrapEl.value
        ? new IntersectionObserver(
            (entries) => {
              if (entries[0]?.isIntersecting) startFilterTweens()
              else stopFilterTweens()
            },
            { threshold: 0.1, rootMargin: '50px' },
          )
        : null
      if (visibilityObserver && bodyWrapEl.value) visibilityObserver.observe(bodyWrapEl.value)

      let resizeTimeout: ReturnType<typeof setTimeout> | null = null
      const handleResize = () => {
        cancelAnimationFrame(resizeRaf)
        if (resizeTimeout) clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          resizeRaf = requestAnimationFrame(() => {
            buildFogLines()
            resizeTimeout = null
          })
        }, 200)
      }

      window.addEventListener('resize', handleResize)

      onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
        if (resizeTimeout) clearTimeout(resizeTimeout)
        cancelAnimationFrame(resizeRaf)
        visibilityObserver?.disconnect?.()
        stopFilterTweens()
        clearFog()
      })
    }
  })
}
</script>

<style scoped>
.wiki-card--character {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  transition:
    transform 0.18s ease-out,
    box-shadow 0.18s ease-out,
    border-color var(--transition),
    background var(--transition);
}

.wiki-card__header {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.wiki-card__image {
  flex-shrink: 0;
}

.wiki-card__img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
}

.wiki-card__meta-wrap {
  flex: 1;
  min-width: 0;
}

.wiki-card__title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-light);
  margin: 0 0 var(--space-1);
  line-height: 1.3;
}

.wiki-card__meta,
.wiki-card__status {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-argalius-bright);
  margin: var(--space-1) 0 0;
}

.wiki-card__status-label {
  color: var(--color-text-muted);
}

.wiki-card__summary {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
}

.wiki-card__body-wrap {
  position: relative;
  margin-bottom: var(--space-3);
}

.wiki-card__body {
  position: relative;
  z-index: 1;
}

.wiki-card__fog {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
}

.wiki-card__fog-defs {
  position: absolute;
  width: 0;
  height: 0;
}

::global(.wiki-entry-intro__fog-line) {
  position: relative;
  display: block;
  position: absolute;
  opacity: 1;
  filter: url(#wiki-fog-noise) blur(14px) saturate(1.12);
  border-radius: 999px;
  mix-blend-mode: screen;
  background:
    radial-gradient(
      180% 260% at 10% 8%,
      rgba(250, 252, 255, 0.95) 0%,
      rgba(232, 241, 255, 0.8) 22%,
      rgba(180, 199, 228, 0.55) 40%,
      rgba(42, 58, 92, 0.44) 60%,
      rgba(10, 12, 20, 0.96) 82%,
      rgba(10, 12, 20, 1) 100%
    );
}

::global(.wiki-entry-intro__fog-blob) {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle at 35% 45%, rgba(242, 247, 255, 0.9), rgba(173, 196, 230, 0.0) 72%);
  filter: blur(8px);
}

::global(.wiki-entry-intro__fog-blob--1) {
  left: -8%;
  top: 6%;
  width: 48%;
  height: 86%;
}

::global(.wiki-entry-intro__fog-blob--2) {
  left: 28%;
  top: -10%;
  width: 36%;
  height: 120%;
}

::global(.wiki-entry-intro__fog-blob--3) {
  left: 62%;
  top: 8%;
  width: 44%;
  height: 84%;
}
</style>
