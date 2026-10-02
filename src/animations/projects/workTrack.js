import { gsap, ScrollTrigger } from '../gsap'
import { getLenis } from '../scroll/lenis'

/**
 * Horizontal traversal. One scrubbed tween drives the track. Everything else
 * (parallax, node activation, metadata) hangs off it through containerAnimation,
 * so there is a single source of truth for position.
 */
export function workHorizontal(section, counterEl) {
  const pin = section.querySelector('[data-work-pin]')
  const track = section.querySelector('[data-work-track]')
  const fill = section.querySelector('[data-work-fill]')
  const panels = gsap.utils.toArray('[data-panel]', section)
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

  const move = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.9,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        fill.style.transform = `scaleX(${self.progress})`
      },
    },
  })

  const setCount = (i) => {
    if (counterEl) counterEl.textContent = String(i).padStart(2, '0')
  }

  panels.forEach((panel, i) => {
    const node = panel.querySelector('[data-panel-node]')
    const visual = panel.querySelector('[data-parallax]')
    const title = panel.querySelector('[data-panel-title]')
    const meta = panel.querySelectorAll('[data-panel-meta]')
    // Panels differ in timing as well as size: larger projects move with more depth.
    const depth = panel.classList.contains('panel--feature') ? 1.4 : panel.classList.contains('panel--split') ? 1 : 0.7

    // node lights when the signal reaches it, and stays lit once passed
    ScrollTrigger.create({
      trigger: panel,
      containerAnimation: move,
      start: 'left 60%',
      onEnter: () => {
        node.classList.add('is-active')
        setCount(i + 1)
      },
      onLeaveBack: () => {
        node.classList.remove('is-active')
        setCount(i)
      },
    })

    // the panel in the middle of the viewport is 'current': its preview comes up to full colour
    ScrollTrigger.create({
      trigger: panel,
      containerAnimation: move,
      start: 'left 55%',
      end: 'right 45%',
      toggleClass: 'is-current',
    })

    // image drifts inside its frame (parallax depth)
    gsap.fromTo(
      visual,
      { xPercent: -6 * depth },
      {
        xPercent: 6 * depth,
        ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
      },
    )

    // title travels slightly against the track: a typographic parallax
    gsap.fromTo(
      title,
      { x: 80 * depth },
      {
        x: -40 * depth,
        ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
      },
    )

    // metadata resolves progressively as the panel arrives
    gsap.from(meta, {
      autoAlpha: 0,
      y: 14,
      stagger: 0.08,
      duration: 0.7,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: panel,
        containerAnimation: move,
        start: 'left 65%',
        toggleActions: 'play none none reverse',
      },
    })
  })

  // Keyboard: when focus lands inside an off-screen panel, scroll the page so it comes into view.
  const onFocus = (e) => {
    const panel = e.target.closest('[data-panel]')
    const st = move.scrollTrigger
    if (!panel || !st) return
    const d = distance()
    const p = d ? gsap.utils.clamp(0, 1, (panel.offsetLeft - window.innerWidth * 0.08) / d) : 0
    const y = st.start + p * (st.end - st.start)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 0.8 })
    else window.scrollTo(0, y)
  }
  section.addEventListener('focusin', onFocus)

  return () => section.removeEventListener('focusin', onFocus)
}

/** Vertical spine for touch devices and narrow viewports. */
export function workVertical(section, counterEl) {
  const setCount = (i) => counterEl && (counterEl.textContent = String(i).padStart(2, '0'))
  const track = section.querySelector('[data-work-track]')
  const fill = section.querySelector('[data-work-fill]')

  gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: true },
    },
  )

  gsap.utils.toArray('[data-panel]', section).forEach((panel, i) => {
    const node = panel.querySelector('[data-panel-node]')
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 60%',
      onEnter: () => {
        node.classList.add('is-active')
        setCount(i + 1)
      },
      onLeaveBack: () => {
        node.classList.remove('is-active')
        setCount(i)
      },
    })
    ScrollTrigger.create({ trigger: panel, start: 'top 55%', end: 'bottom 45%', toggleClass: 'is-current' })
    gsap.from(panel.querySelector('[data-panel-visual]'), {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.3,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: panel, start: 'top 80%', once: true },
    })
    gsap.from(panel.querySelectorAll('[data-panel-title], [data-panel-meta]'), {
      autoAlpha: 0,
      y: 16,
      stagger: 0.07,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: panel, start: 'top 70%', once: true },
    })
  })
}
