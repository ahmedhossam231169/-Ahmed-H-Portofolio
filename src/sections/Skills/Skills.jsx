import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { skills, categories } from '../../data/skills'
import { radialLayout, neighbours } from './layout'
import Constellation from './Constellation'
import SkillTree from './SkillTree'
import SectionLabel from '../../components/typography/SectionLabel'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useGsap } from '../../animations/utils/useGsap'
import { gsap } from '../../animations/gsap'
import { lineReveal } from '../../animations/typography/reveal'

const EASE = [0.16, 1, 0.3, 1]
const DEV = import.meta.env.DEV

/**
 * 04 — Stack as a system. The constellation reuses the hero's node and edge language,
 * so the skills read as the same architecture seen up close.
 */
export default function Skills() {
  const root = useRef(null)
  const wide = useMediaQuery('(min-width: 768px)')
  const layout = useMemo(() => radialLayout(skills), [])
  const [selected, setSelected] = useState('core')
  const select = useCallback((id) => setSelected(id), [])

  useGsap(
    ({ motion }) => {
      if (!motion) return
      lineReveal(root.current.querySelector('[data-skills-title]'))
      const c = root.current.querySelector('[data-constellation]')
      if (!c) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 75%', once: true } })
      tl.from(c.querySelectorAll('[data-orbit]'), { autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'none' })
        .fromTo(
          c.querySelectorAll('[data-edge]'),
          { strokeDashoffset: 1, strokeDasharray: '1 1' },
          {
            strokeDashoffset: 0,
            duration: 1.1,
            stagger: 0.03,
            ease: 'power2.inOut',
            clearProps: 'strokeDasharray,strokeDashoffset',
          },
          0.1,
        )
        .from(
          c.querySelectorAll('[data-node]'),
          { autoAlpha: 0, scale: 0.6, duration: 0.8, stagger: { each: 0.04, from: 'center' } },
          0.2,
        )
    },
    root,
    [wide],
  )

  const renderDetail = useCallback(
    (id, { compact } = {}) => {
      const s = layout.byId[id]
      if (!s) return null
      const links = [...neighbours(id, layout.edges)].map((n) => layout.byId[n]).filter(Boolean)
      return (
        <div className="flex flex-col gap-4">
          {!compact && (
            <div>
              <p className="meta text-accent">{categories[s.category]?.label}</p>
              <p className="mt-2 text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-medium tracking-[-0.04em] uppercase">
                {s.name}
              </p>
            </div>
          )}
          {s.context ? (
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-mute">{s.context}</p>
          ) : (
            DEV && <p className="meta text-dim">[ context pending — src/data/skills.js ]</p>
          )}
          {links.length > 0 && (
            <div>
              <p className="meta mb-2 text-dim">Connected to</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {links.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => select(l.id)}
                      data-cursor="link"
                      className="meta py-1 text-mute transition-colors hover:text-fg"
                    >
                      {l.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    },
    [layout, select],
  )

  return (
    <section
      id="skills"
      ref={root}
      data-section="skills"
      tabIndex={-1}
      aria-labelledby="skills-title"
      className="gutter relative py-[16vh] outline-none"
    >
      <SectionLabel index="04" title="Skills" meta={`${skills.length - 1} nodes`} />

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2
            id="skills-title"
            data-skills-title
            className="text-[clamp(2.25rem,4.2vw,4rem)] leading-[0.95] font-medium tracking-[-0.045em] uppercase"
          >
            One stack,
            <br />
            <span className="font-light text-mute">wired together.</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-mute">
            Not a list, a dependency graph. Select a node to trace what it connects to.
          </p>

          {/* detail readout (desktop/tablet) */}
          {wide && (
            <div className="mt-12 min-h-[220px] border-t border-line pt-6" aria-live="polite">
              <AnimatePresence mode="wait">
                <m.div
                  key={selected}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {renderDetail(selected)}
                </m.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          {wide ? (
            <Constellation layout={layout} skills={skills} selected={selected} onSelect={select} />
          ) : (
            <SkillTree layout={layout} selected={selected} onSelect={select} renderDetail={renderDetail} />
          )}
        </div>
      </div>
    </section>
  )
}
