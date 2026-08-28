<template>
  <section
    ref="rootEl"
    class="wiki-entry-intro"
    :class="{ 'wiki-entry-intro--visible': isVisible }"
  >
    <WikiToc />
    <h1 class="wiki-page-title wiki-entry-intro__line wiki-entry-intro__title">
      {{ title }}
    </h1>
    <p v-if="meta" class="wiki-meta wiki-entry-intro__line wiki-entry-intro__meta">
      {{ meta }}
    </p>
    <p v-if="lead" class="wiki-page-lead wiki-entry-intro__line wiki-entry-intro__lead">
      {{ lead }}
    </p>
    <div v-if="description" ref="bodyWrapEl" class="wiki-entry-intro__body-wrap">
      <div
        ref="bodyEl"
        class="wiki-prose wiki-prose--html wiki-entry-intro__body"
        v-html="description"
      />
      <div ref="fogEl" class="wiki-entry-intro__fog" aria-hidden="true" />
    </div>
    <svg class="wiki-entry-intro__defs" aria-hidden="true">
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
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  meta?: string
  lead?: string
  description?: string
}>()

const rootEl = ref<HTMLElement | null>(null)
const bodyWrapEl = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)
const fogEl = ref<HTMLElement | null>(null)
const turbulenceEl = ref<SVGFETurbulenceElement | null>(null)
const displacementEl = ref<SVGFEDisplacementMapElement | null>(null)
const isVisible = ref(false)

if (import.meta.client) {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const isNarrow = window.innerWidth < 768
  const enableFog = !prefersReducedMotion && !isNarrow && document.documentElement.dataset.intensity === 'spectacle'
  let bodyObserver: IntersectionObserver | null = null
  let resizeRaf = 0
  let lineNodes: HTMLElement[] = []
  let introFogLine: HTMLElement | null = null
  let gsapLib: any = null
  let noiseTween: any = null
  let displacementTween: any = null

  const clearFog = () => {
    bodyObserver?.disconnect()
    bodyObserver = null
    if (introFogLine) {
      introFogLine.remove()
      introFogLine = null
    }
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
      // Без GSAP просто мгновенно убираем линию, чтобы не мешать чтению
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

  const buildIntroFog = () => {
    if (!rootEl.value || !bodyWrapEl.value || !fogEl.value || introFogLine) return

    const rootRect = rootEl.value.getBoundingClientRect()
    const bodyRect = bodyWrapEl.value.getBoundingClientRect()

    const top = 0
    const bottom = bodyRect.top - rootRect.top
    if (bottom <= 0) return

    const padX = 80
    const extraY = 24
    const height = bottom + extraY
    const width = rootRect.width + padX * 2
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

    if (rootEl.value && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            isVisible.value = true
            observer.disconnect()
          }
        },
        { threshold: 0.2 },
      )
      observer.observe(rootEl.value)
    } else {
      isVisible.value = true
    }

    if (bodyEl.value && fogEl.value && enableFog) {
      const init = () => {
        buildIntroFog()
        buildFogLines()
      }

      // Ждём кадр и загрузку шрифтов, чтобы получить корректные реальные строки.
      requestAnimationFrame(() => {
        init()
        ;(document as any).fonts?.ready?.then(() => {
          init()
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
.wiki-entry-intro {
  position: relative;
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
}

.wiki-entry-intro--visible .wiki-entry-intro__meta {
  animation-delay: 0.04s;
}

.wiki-entry-intro--visible .wiki-entry-intro__lead {
  animation-delay: 0.08s;
}

.wiki-entry-intro--visible .wiki-entry-intro__body {
  animation-delay: 0.12s;
}

.wiki-entry-intro__title {
  position: relative;
}

.wiki-entry-intro__meta {
  opacity: 0.9;
}

.wiki-entry-intro__lead {
  position: relative;
}

:global(.wiki-entry-intro__body) {
  margin-top: var(--space-3);
  position: relative;
  z-index: 1;
}

.wiki-entry-intro__body-wrap {
  position: relative;
}

.wiki-entry-intro__defs {
  position: absolute;
  width: 0;
  height: 0;
}

.wiki-entry-intro__fog {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
}

:global(.wiki-entry-intro__fog-line) {
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

:global(.wiki-entry-intro__fog-blob) {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle at 35% 45%, rgba(242, 247, 255, 0.9), rgba(173, 196, 230, 0.0) 72%);
  filter: blur(8px);
}

:global(.wiki-entry-intro__fog-blob--1) {
  left: -8%;
  top: 6%;
  width: 48%;
  height: 86%;
}

:global(.wiki-entry-intro__fog-blob--2) {
  left: 28%;
  top: -10%;
  width: 36%;
  height: 120%;
}

:global(.wiki-entry-intro__fog-blob--3) {
  left: 62%;
  top: 8%;
  width: 44%;
  height: 84%;
}
</style>

