import { useLayoutEffect, useRef } from 'react'
import { projects } from '../../data/projects'
import ProjectPanel from './ProjectPanel'
import SectionLabel from '../../components/typography/SectionLabel'
import { useGsap } from '../../animations/utils/useGsap'
import { workHorizontal, workVertical } from '../../animations/projects/workTrack'

/**
 * 03 — Work.
 * Desktop: the section pins and the track moves sideways. A signal moves along
 * the bus and lights each project's node as it passes.
 * Mobile / reduced motion: the bus turns vertical and becomes a spine; projects stack.
 */
export default function Projects() {
  const root = useRef(null)
  const counter = useRef(null)

  useGsap(
    ({ desktop, motion }) => {
      if (!motion) return
      if (desktop) return workHorizontal(root.current, counter.current)
      workVertical(root.current, counter.current)
    },
    root,
  )

  // Vertical layout: the spine starts at the first project, wherever the intro copy ends.
  useLayoutEffect(() => {
    const track = root.current.querySelector('[data-work-track]')
    const first = track.querySelector('[data-panel]')
    const set = () => track.style.setProperty('--bus-top', `${first.offsetTop + 8}px`)
    const ro = new ResizeObserver(set)
    ro.observe(track)
    set()
    return () => ro.disconnect()
  }, [])

  const total = projects.length

  return (
    <section
      id="work"
      ref={root}
      data-section="work"
      tabIndex={-1}
      aria-labelledby="work-title"
      className="relative outline-none"
    >
      <div data-work-pin className="work-pin">
        <div className="work-header gutter">
          <SectionLabel
            index="03"
            title="Work"
            meta={
              <span className="tabular-nums" aria-hidden="true">
                <span ref={counter} className="text-fg">
                  00
                </span>{' '}
                / {String(total).padStart(2, '0')}
              </span>
            }
          />
        </div>

        <div data-work-track className="work-track">
          <div aria-hidden="true" className="work-bus">
            <div data-work-fill className="work-bus-fill">
              <span className="work-bus-head" />
            </div>
          </div>

          <header className="work-intro">
            <h2 id="work-title" className="display text-[clamp(3rem,8vw,8.5rem)]">
              Selected
              <br />
              <span className="font-light">work</span>
            </h2>
            <p className="meta mt-8 max-w-[34ch] leading-relaxed text-mute">
              {total} projects, indexed as nodes in one system. Each is given space in proportion to its scope.
            </p>
            <p aria-hidden="true" className="work-hint meta mt-10 text-dim">
              Scroll to traverse <span className="text-accent">→</span>
            </p>
          </header>

          {projects.map((p) => (
            <ProjectPanel key={p.index} project={p} total={total} />
          ))}

          <div className="work-outro">
            <p className="meta text-dim">End of index</p>
            <p className="mt-4 text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight font-light tracking-[-0.03em] text-mute">
              {total} nodes indexed.
              <br />
              <span className="text-fg">Next: the stack behind them.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
