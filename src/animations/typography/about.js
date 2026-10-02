import { gsap, SplitText } from '../gsap'

/**
 * Desktop: the stage pins. Each beat's statement reads in word by word, then the
 * keyword is masked out upward and the next one rises into its slot.
 */
export function aboutDesktop(stage) {
  const beats = gsap.utils.toArray('[data-beat]', stage)
  const splits = beats.map((b) => SplitText.create(b.querySelector('[data-beat-text]'), { type: 'words' }))

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: `+=${beats.length * 90}%`,
      pin: true,
      scrub: 0.6,
    },
  })

  beats.forEach((beat, i) => {
    const word = beat.querySelector('[data-beat-word]')
    const words = splits[i].words
    const t = i * 2

    if (i > 0) {
      // incoming keyword and statement
      tl.fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, t - 0.5)
      tl.fromTo(beat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, t - 0.5)
    }
    tl.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.06, duration: 0.3 }, t)

    if (i < beats.length - 1) {
      // outgoing
      tl.to(word, { yPercent: -110, duration: 0.5, ease: 'power3.in' }, t + 1.4)
      tl.to(beat.querySelector('[data-beat-text]'), { autoAlpha: 0, y: -24, duration: 0.4 }, t + 1.4)
      tl.set(beat, { autoAlpha: 0 }, t + 1.9)
    }
  })
  tl.to(stage.querySelector('[data-about-progress]'), { scaleX: 1, duration: tl.duration() }, 0)
  // hold on the last beat briefly
  tl.to({}, { duration: 0.4 })

  return tl
}

/** Mobile: beats stay in flow. Words read in as each beat scrolls through. */
export function aboutMobile(stage) {
  gsap.utils.toArray('[data-beat]', stage).forEach((beat) => {
    const split = SplitText.create(beat.querySelector('[data-beat-text]'), { type: 'words' })
    gsap.fromTo(
      split.words,
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: beat, start: 'top 75%', end: 'bottom 55%', scrub: true },
      },
    )
    gsap.from(beat.querySelector('[data-beat-word]'), {
      yPercent: 110,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: beat, start: 'top 85%', once: true },
    })
  })
}
