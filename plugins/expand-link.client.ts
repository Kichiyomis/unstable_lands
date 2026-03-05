import { defineNuxtPlugin } from '#app'
import type { DirectiveBinding } from 'vue'
import { gsap } from 'gsap'

type ExpandLinkOptions = {
  duration?: number
}

export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router
  const config = useRuntimeConfig()
  const base = (config.app?.baseURL ?? '/').replace(/\/$/, '') // без завершающего слэша

  nuxtApp.vueApp.directive('expand-link', {
    mounted (el: HTMLElement, binding: DirectiveBinding<ExpandLinkOptions | undefined>) {
      if (import.meta.server) return
      if (!el || el.nodeType !== 1 || typeof el.addEventListener !== 'function') return

      const opts = binding.value ?? {}
      const duration = typeof opts.duration === 'number' ? opts.duration : 0.6

      const handleClick = (event: MouseEvent) => {
        if (event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

        const anchor = el as HTMLAnchorElement
        const href = anchor.getAttribute?.('href')
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

        event.preventDefault()
        event.stopPropagation()

        const rect = el.getBoundingClientRect()
        const overlay = el.cloneNode(true) as HTMLElement
        overlay.removeAttribute('href')
        overlay.setAttribute('data-expand-overlay', '1')
        overlay.style.cssText = `
          position: fixed !important;
          top: ${rect.top}px !important;
          left: ${rect.left}px !important;
          width: ${rect.width}px !important;
          height: ${rect.height}px !important;
          margin: 0 !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
        `.replace(/\s+/g, ' ').trim()

        // Специальный режим для карточек персонажей: фиксируем картинку по центру
        const isCharacterCard = overlay.classList.contains('entry-card')
        if (isCharacterCard) {
          const thumb = overlay.querySelector<HTMLElement>('.entry-card__thumb')
          const body = overlay.querySelector<HTMLElement>('.entry-card__body')

          if (thumb) {
            thumb.style.width = 'min(260px, 40vw)'
            thumb.style.maxWidth = '320px'
            thumb.style.flexShrink = '0'
            thumb.style.borderRadius = '18px'
            thumb.style.overflow = 'hidden'
          }

          if (body) {
            body.style.textAlign = 'center'
            body.style.padding = 'var(--space-3) var(--space-4)'
          }
        }

        // Для прочих карточек добавляем центральное изображение allmind.jpg
        if (!isCharacterCard) {
          const imgWrap = document.createElement('div')
          imgWrap.className = 'expand-overlay-image'
          imgWrap.style.cssText = `
            position: relative;
            width: min(320px, 50vw);
            max-width: 360px;
            aspect-ratio: 4 / 3;
            margin: 0 auto;
            border-radius: 18px;
            overflow: hidden;
            box-shadow:
              0 18px 40px rgba(0, 0, 0, 0.75),
              0 0 32px rgba(201, 162, 39, 0.16);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          `.replace(/\s+/g, ' ').trim()

          const imgUrl = `${base}/images/allmind.jpg`
          imgWrap.style.backgroundImage = `url('${imgUrl}')`

          // Вставляем изображение над контентом карточки
          overlay.insertBefore(imgWrap, overlay.firstChild)
        }

        document.body.appendChild(overlay)

        // Мягкое затемнение фона
        const backdrop = document.createElement('div')
        backdrop.setAttribute('data-expand-backdrop', '1')
        backdrop.style.cssText = `
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(10,12,20,0.8), rgba(0,0,0,0.95));
          opacity: 0;
          pointer-events: none;
          z-index: 2147483646;
        `.replace(/\s+/g, ' ').trim()
        document.body.appendChild(backdrop)

        const targetX = 0
        const targetY = 0
        const targetW = window.innerWidth
        const targetH = window.innerHeight

        requestAnimationFrame(() => {
          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            onComplete: () => {
              overlay.remove()
              backdrop.remove()
            },
          })

          const innerContent = overlay.querySelectorAll('h3, p, span')
          const thumb = overlay.querySelector('.entry-card__thumb img') ?? overlay.querySelector('.entry-card__thumb')

          // Для карточек персонажей фиксируем высоту текстового блока, чтобы избежать "скачка"
          if (isCharacterCard) {
            const body = overlay.querySelector<HTMLElement>('.entry-card__body')
            if (body) {
              const bodyRect = body.getBoundingClientRect()
              body.style.minHeight = `${bodyRect.height}px`
            }
          }

          // Плавно убираем текст и мету (но не саму картинку), пока карточка разворачивается
          if (innerContent.length) {
            const contentToFade = Array.from(innerContent).filter(node => !thumb || !thumb.contains(node as Node))
            if (contentToFade.length) {
              tl.to(contentToFade, {
                opacity: 0,
                duration: duration * 0.35,
                ease: 'power1.out',
              }, 0)
            }
          }

          // Затемнение под карточкой
          tl.to(backdrop, {
            opacity: 1,
            duration: duration * 0.6,
            ease: 'power1.out',
          }, 0)

          // Разворачивание самой карточки
          tl.to(overlay, {
            top: targetY,
            left: targetX,
            width: targetW,
            height: targetH,
            borderRadius: 0,
            duration,
            overwrite: true,
          }, 0)
        })

        const navigateDelay = Math.round(duration * 0.55 * 1000)
        let path = href.startsWith('http') ? new URL(href).pathname : href
        if (base && path.startsWith(base + '/')) path = path.slice(base.length) || '/'
        if (!path.startsWith('/')) path = '/' + path
        window.setTimeout(() => {
          router.push(path)
        }, navigateDelay)
      }

      el.addEventListener('click', handleClick, true)
      ;(el as any).__expandLinkCleanup__ = () => {
        el.removeEventListener('click', handleClick, true)
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

