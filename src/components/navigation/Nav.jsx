import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { sections, site } from '../../data/site'
import { useStore } from '../../hooks/useStore'
import { scrollToTarget } from '../../animations/scroll/lenis'
import SoundToggle from '../ui/SoundToggle'

const EASE = [0.16, 1, 0.3, 1]

/**
 * System bar. Hides on intentional downward scroll (> 8px past the hero),
 * returns on upward scroll, and always returns when anything inside gets focus.
 */
export default function Nav() {
  const active = useStore('section')
  const introDone = useStore('introDone')
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  // Over content the bar gets a dark backing so its labels never collide with the page.
  // At the very top it stays transparent, leaving the hero composition open.
  const [solid, setSolid] = useState(() => window.scrollY > 24)
  const lastY = useRef(0)
  const menuBtn = useRef(null)

  useEffect(() => {
    let acc = 0
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 24)
      const d = y - lastY.current
      lastY.current = y
      // accumulate in one direction so tiny jitters don't toggle the bar
      acc = Math.sign(d) === Math.sign(acc) ? acc + d : d
      if (y < 80) setHidden(false)
      else if (acc > 24) setHidden(true)
      else if (acc < -12) setHidden(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(`#${id}`)
    // move focus for keyboard / screen reader users
    const el = document.getElementById(id)
    el?.focus({ preventScroll: true })
  }

  const show = !hidden || open

  return (
    <m.header
      initial={false}
      animate={{ y: show && introDone ? 0 : '-110%' }}
      transition={{ duration: 0.6, ease: EASE }}
      onFocusCapture={() => setHidden(false)}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
        solid || open ? 'border-line bg-bg' : 'border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="gutter flex h-[var(--nav-h)] items-center justify-between gap-6">
        <a
          href="#top"
          onClick={(e) => go(e, 'top')}
          className="group flex items-center gap-3"
          data-cursor="link"
          aria-label={`${site.name} — back to top`}
        >
          <Mark />
          <span className="meta hidden text-mute transition-colors group-hover:text-fg sm:inline">
            {site.name} <span className="text-dim">/ {site.role}</span>
          </span>
        </a>

        {/* desktop index */}
        <ol className="hidden items-center gap-8 md:flex">
          {sections.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => go(e, s.id)}
                  aria-current={isActive ? 'location' : undefined}
                  data-cursor="link"
                  className={`meta relative flex items-center gap-2 py-2 transition-colors duration-300 ${
                    isActive ? 'text-fg' : 'text-mute hover:text-fg'
                  }`}
                >
                  <span className="relative grid h-[6px] w-[6px] place-items-center">
                    {isActive && (
                      <m.span
                        layoutId="nav-led"
                        className="absolute inset-0 bg-accent"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                    <span className={`h-px w-[6px] ${isActive ? 'opacity-0' : 'bg-dim'}`} />
                  </span>
                  <span className="text-dim">{s.index}</span>
                  {s.label}
                </a>
              </li>
            )
          })}
        </ol>

        <div className="flex items-center gap-6">
          <SoundToggle />
          <button
            ref={menuBtn}
            type="button"
            className="meta py-2 text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Index'}
          </button>
        </div>
      </nav>

      {/* mobile index — full-screen sheet */}
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="gutter fixed inset-x-0 top-[var(--nav-h)] bottom-0 flex flex-col justify-between bg-bg pb-8 md:hidden"
          >
            <ol className="mt-8 border-t border-line">
              {sections.map((s, i) => (
                <m.li
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}
                  className="border-b border-line"
                >
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => go(e, s.id)}
                    aria-current={active === s.id ? 'location' : undefined}
                    className="flex items-baseline justify-between py-5"
                  >
                    <span className="text-[clamp(2rem,10vw,3.5rem)] font-medium leading-none tracking-[-0.04em] uppercase">
                      {s.label}
                    </span>
                    <span className={`meta ${active === s.id ? 'text-accent' : 'text-dim'}`}>{s.index}</span>
                  </a>
                </m.li>
              ))}
            </ol>
            <p className="meta text-dim">
              {site.name} — {site.role}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  )
}

/** Monogram: two nodes and an edge, the site's smallest unit. */
function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
      <path d="M5 17 17 5" stroke="currentColor" strokeWidth="1" className="text-mute" />
      <rect x="3" y="15" width="4" height="4" fill="#ededE8" />
      <rect x="15" y="3" width="4" height="4" className="fill-accent" />
    </svg>
  )
}
