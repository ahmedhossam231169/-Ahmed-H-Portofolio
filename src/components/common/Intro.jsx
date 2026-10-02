import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText } from '../../animations/gsap'
import { setState } from '../../utils/store'
import { startScroll, stopScroll } from '../../animations/scroll/lenis'
import { site } from '../../data/site'

/**
 * Opening sequence: ~2.4s, skippable (button, Esc, Enter, Space).
 * A small system graph assembles while the identity types in, then the panel
 * wipes upward and the hero takes over. Hero reveal starts during the wipe,
 * so there is no "loaded" pause.
 */

// Small fixed system graph: [x, y] in a 0..100 box.
const NODES = [
  [8, 70], [26, 42], [26, 86], [48, 22], [48, 58], [70, 40], [70, 78], [92, 30],
]
const EDGES = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [4, 5], [3, 5], [4, 6], [5, 7], [6, 5],
]
const ACTIVE = 5

export default function Intro({ onDone }) {
  const root = useRef(null)
  const tl = useRef(null)

  useLayoutEffect(() => {
    stopScroll()
    document.documentElement.style.overflow = 'hidden'

    const finish = () => {
      document.documentElement.style.overflow = ''
      startScroll()
      try {
        sessionStorage.setItem('intro-seen', '1')
      } catch {
        /* storage unavailable */
      }
      onDone()
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const name = SplitText.create(q('[data-intro-name]'), { type: 'words,chars', mask: 'chars' })
      const edges = q('[data-edge]')
      gsap.set(edges, { strokeDasharray: 1, strokeDashoffset: 1 }) // pathLength=1 on each edge

      const t = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finish })
      t.from(q('[data-intro-grid]'), { autoAlpha: 0, duration: 0.6, ease: 'none' }, 0)
        .from(q('[data-node]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.05 }, 0.1)
        .to(edges, { strokeDashoffset: 0, duration: 0.7, stagger: 0.04, ease: 'power2.inOut' }, 0.2)
        .to(q('[data-node-active]'), { fill: '#2f6bff', duration: 0.2, ease: 'none' }, 0.9)
        .from(name.chars, { yPercent: 110, duration: 0.9, stagger: 0.025 }, 0.25)
        .from(q('[data-intro-role]'), { yPercent: 110, duration: 0.8, stagger: 0.12 }, 0.7)
        .from(q('[data-intro-meta]'), { autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'none' }, 0.2)
        .to(q('[data-intro-progress]'), { scaleX: 1, duration: 1.9, ease: 'power1.inOut' }, 0)
        .addLabel('exit', 2.0)
        // Publish from a microtask so nothing the hand-over triggers is filed under this context
        // (and torn down with it when the intro unmounts).
        .call(() => queueMicrotask(() => setState({ introDone: true })), null, 'exit')
        .to(q('[data-intro-content]'), { yPercent: -12, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, 'exit')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, 'exit+=0.15')

      tl.current = t
    }, root)

    const onKey = (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) skip()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      ctx.revert()
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const skip = () => {
    const t = tl.current
    if (!t || t.time() >= t.labels.exit) return
    t.seek('exit')
  }

  return (
    <div
      ref={root}
      role="dialog"
      aria-label="Introduction"
      className="fixed inset-0 z-[90] bg-bg"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div data-intro-grid aria-hidden="true" className="grid-overlay absolute inset-0" />

      <div data-intro-content className="gutter relative flex h-full flex-col justify-between py-6 md:py-8">
        {/* top meta row */}
        <div className="meta flex justify-between text-dim">
          <span data-intro-meta>SYS / INIT</span>
          <span data-intro-meta className="hidden sm:inline">Portfolio — v1.0</span>
          <span data-intro-meta>{new Date().getFullYear()}</span>
        </div>

        {/* composition */}
        <div className="grid items-end gap-10 md:grid-cols-12">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-24 w-full overflow-visible md:col-span-4 md:h-40"
          >
            {EDGES.map(([a, b], i) => (
              <line
                key={i}
                data-edge
                pathLength="1"
                x1={NODES[a][0]}
                y1={NODES[a][1]}
                x2={NODES[b][0]}
                y2={NODES[b][1]}
                stroke="rgb(237 237 232 / .35)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {NODES.map(([x, y], i) => (
              <rect
                key={i}
                data-node
                {...(i === ACTIVE ? { 'data-node-active': true } : {})}
                x={x - 1.1}
                y={y - 2}
                width="2.2"
                height="4"
                fill="#ededE8"
              />
            ))}
          </svg>

          <div className="md:col-span-8 md:col-start-5">
            <p
              data-intro-name
              className="display text-[clamp(2.75rem,7.4vw,7.5rem)] leading-[0.9]"
              aria-label={site.name}
            >
              {site.name}
            </p>
            <div className="meta mt-6 flex flex-col gap-1 text-mute sm:flex-row sm:gap-10">
              <span className="line-mask block">
                <span data-intro-role className="block">
                  <span className="text-dim">01 —</span> {site.role}
                </span>
              </span>
              <span className="line-mask block">
                <span data-intro-role className="block">
                  <span className="text-dim">02 —</span> {site.tagline}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="flex items-end justify-between gap-6">
          <div className="hairline relative flex-1 overflow-hidden">
            <div data-intro-progress className="absolute inset-0 origin-left scale-x-0 bg-fg/60" />
          </div>
          <button
            type="button"
            onClick={skip}
            className="meta text-mute transition-colors hover:text-fg"
            data-cursor="link"
          >
            Skip intro ↵
          </button>
        </div>
      </div>
    </div>
  )
}
