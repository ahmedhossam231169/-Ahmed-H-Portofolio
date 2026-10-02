import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../gsap'
import { store } from '../../utils/store'

let lenis = null
let locked = false // a lock requested before Lenis exists is applied when it boots

/** Boots Lenis on GSAP's ticker so smooth scroll and ScrollTrigger share one clock. */
export function initLenis({ smooth = true } = {}) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    store.scroll = max > 0 ? window.scrollY / max : 0
  }

  if (!smooth) {
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true })
  if (locked) lenis.stop()
  lenis.on('scroll', (l) => {
    store.velocity = l.velocity
    update()
    ScrollTrigger.update()
  })
  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts })
  } else {
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}

export function stopScroll() {
  locked = true
  lenis?.stop()
}
export function startScroll() {
  locked = false
  lenis?.start()
}
