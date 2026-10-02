import { useEffect, useRef } from 'react'
import { site } from '../../data/site'
import { useGsap } from '../../animations/utils/useGsap'
import { heroEntrance, heroScroll } from '../../animations/hero/heroTimeline'
import { gsap } from '../../animations/gsap'
import { store, subscribe } from '../../utils/store'

/**
 * 00 — Opening scene.
 * The statement is a typographic object: BUILD is solid, DIGITAL is an outline
 * that "compiles" (fills) as you scroll, and EXPERIENCES. carries the only blue: the full stop.
 */
export default function Hero() {
  const root = useRef(null)
  const coords = useRef(null)
  const scrollPct = useRef(null)

  useGsap(
    ({ motion, desktop }, ctx) => {
      if (!motion) return
      const q = gsap.utils.selector(root)
      // entrance waits for the intro to hand over
      gsap.set(q('[data-hero-row]'), { yPercent: 110 })
      gsap.set(q('[data-hero-meta]'), { autoAlpha: 0 })
      let played = false
      const play = () => {
        if (played || !store.state.introDone) return
        played = true
        // bind to this context so it is cleaned up with the hero
        ctx.add(() => heroEntrance(q))
      }
      play()
      const unsub = subscribe(play)
      heroScroll(root.current, q, { desktop })
      return unsub
    },
    root,
  )

  // Live readouts: pointer position + page progress. Written straight to the DOM.
  useEffect(() => {
    let lastX = null
    let lastS = null
    const tick = () => {
      const x = ((store.pointer.x + 1) / 2).toFixed(3)
      const y = ((1 - store.pointer.y) / 2).toFixed(3)
      const key = x + y
      if (key !== lastX && coords.current) {
        coords.current.textContent = `X ${x}  Y ${y}`
        lastX = key
      }
      const s = String(Math.round(store.scroll * 100)).padStart(3, '0')
      if (s !== lastS && scrollPct.current) {
        scrollPct.current.textContent = s
        lastS = s
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <section
      id="top"
      ref={root}
      data-section="hero"
      data-cursor="canvas"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="relative h-svh min-h-[560px] outline-none"
    >
      <div aria-hidden="true" className="grid-overlay absolute inset-0 opacity-50" />

      <div className="gutter relative flex h-full flex-col justify-between pt-[calc(var(--nav-h)+12px)] pb-6 md:pb-8">
        {/* top readout row */}
        <div data-hero-fade className="meta flex justify-between text-dim" aria-hidden="true">
          <span data-hero-meta>N° 00 — Index</span>
          <span data-hero-meta ref={coords} className="hidden tabular-nums lg:inline">
            X 0.500 Y 0.500
          </span>
          <span data-hero-meta className="hidden md:inline">
            {site.location ? site.location : 'Available for work'}
          </span>
        </div>

        <h1 id="hero-title" className="relative">
          <span className="sr-only">Build digital experiences.</span>

          <span aria-hidden="true" className="display block select-none" data-hero-type>
            {/* BUILD */}
            <span className="relative block">
              <span className="line-mask block">
                <span data-hero-row data-hero-build className="hero-word hero-word--a block">
                  Build
                </span>
              </span>
              <span data-hero-meta className="hero-note meta">
                001 / Intent
              </span>
            </span>

            {/* DIGITAL: outline + fill layer */}
            <span className="relative block pl-[8vw] md:pl-[16.66%]">
              <span className="line-mask block">
                <span data-hero-row className="hero-word hero-word--b relative block">
                  <span className="type-outline">Digital</span>
                  <span data-hero-fill className="absolute inset-0 block" style={{ clipPath: 'inset(0 0% 0 0)' }}>
                    Digital
                  </span>
                </span>
              </span>
              <span data-hero-meta className="hero-note meta">
                002 / Render — <span data-hero-compile>100</span>%
              </span>
            </span>

            {/* EXPERIENCES. */}
            <span className="relative block">
              <span className="line-mask block">
                <span data-hero-row data-hero-exp className="hero-word hero-word--c block origin-bottom-left">
                  Experiences<span className="text-accent">.</span>
                </span>
              </span>
            </span>
          </span>
        </h1>

        {/* bottom row */}
        <div data-hero-fade className="grid grid-cols-2 items-end gap-6 md:grid-cols-12">
          <p data-hero-meta className="meta col-span-1 text-mute md:col-span-3">
            <span className="text-fg">{site.name}</span>
            <br />
            {site.role}
          </p>
          <p
            data-hero-meta
            className="col-span-2 row-start-1 max-w-[34ch] text-[15px] leading-snug text-mute md:col-span-4 md:col-start-6 md:row-start-auto"
          >
            Interfaces where engineering precision meets visual experience — built to be used, not just seen.
          </p>
          <div data-hero-meta className="meta col-span-1 flex items-center justify-end gap-3 text-dim md:col-span-3 md:col-start-10">
            <span>Scroll</span>
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="scroll-tick absolute inset-x-0 top-0 h-1/2 bg-fg" />
            </span>
            <span aria-hidden="true" className="tabular-nums" ref={scrollPct}>
              000
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
