import { gsap } from '../gsap'
import { store } from '../../utils/store'

/** Rows rise out of their masks; the metadata settles in after them. */
export function heroEntrance(q) {
  return gsap
    .timeline({ delay: 0.15 })
    .to(q('[data-hero-row]'), { yPercent: 0, duration: 1.5, stagger: 0.09, ease: 'expo.out' })
    .to(q('[data-hero-meta]'), { autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: 'none' }, 0.6)
}

/**
 * Scroll choreography.
 * DIGITAL starts as an outline and "renders" (fills left → right) as you scroll,
 * with a live percentage. On desktop the hero pins while this happens, the rows
 * drift apart, and the statement recedes as the about section takes over.
 * On mobile there is no pin. The same idea runs as a scrub while the hero leaves.
 */
export function heroScroll(section, q, { desktop }) {
  const compile = q('[data-hero-compile]')[0]
  const fill = q('[data-hero-fill]')[0]
  const state = { p: 0 }
  const render = () => {
    compile.textContent = String(Math.round(state.p)).padStart(3, '0')
    fill.style.clipPath = `inset(0 ${100 - state.p}% 0 0)`
  }
  render()

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: desktop ? '+=110%' : 'bottom 20%',
      pin: desktop,
      scrub: desktop ? 0.8 : 0.4,
      onUpdate: (self) => {
        store.hero = self.progress
      },
    },
  })

  tl.to(state, { p: 100, duration: 0.6, onUpdate: render }, 0)
    .to(q('[data-hero-build]'), { xPercent: desktop ? -5 : -3, duration: 1 }, 0)
    .to(q('[data-hero-exp]'), { scale: desktop ? 0.92 : 0.97, duration: 1 }, 0)

  if (desktop) {
    tl.to(q('[data-hero-type]'), { autoAlpha: 0.1, yPercent: -5, duration: 0.3 }, 0.7).to(
      q('[data-hero-fade]'),
      { autoAlpha: 0, duration: 0.2 },
      0.1,
    )
  }

  return tl
}
