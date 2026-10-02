import { gsap, SplitText } from '../gsap'

/**
 * Masked line reveal: lines slide up from behind their own mask on enter.
 * Content is visible by default; this only runs when motion is allowed.
 */
export function lineReveal(el, { trigger = el, start = 'top 85%', delay = 0, stagger = 0.08 } = {}) {
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
  gsap.from(split.lines, {
    yPercent: 105,
    duration: 1.1,
    stagger,
    delay,
    ease: 'expo.out',
    scrollTrigger: { trigger, start, once: true },
  })
  return split
}

/** Fade + lift for small meta items, staggered. */
export function metaReveal(targets, { trigger, start = 'top 85%', delay = 0, containerAnimation } = {}) {
  return gsap.from(targets, {
    autoAlpha: 0,
    y: 12,
    duration: 0.8,
    stagger: 0.06,
    delay,
    ease: 'expo.out',
    scrollTrigger: { trigger, start, once: !containerAnimation, containerAnimation },
  })
}
