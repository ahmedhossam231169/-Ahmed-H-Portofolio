import { memo, useMemo } from 'react'
import { VIEW, neighbours } from './layout'
import { categories } from '../../data/skills'

// Theme foreground at a given strength. SVG attributes can't read CSS variables; styles can.
const fgMix = (pct) => `color-mix(in oklab, var(--color-fg) ${pct}%, transparent)`
import { play } from '../../utils/sound'

/**
 * Desktop/tablet constellation. Edges are SVG; nodes are real <button>s laid over
 * the SVG at matching percentages, so they are focusable, labelled and keyboard operable.
 */
function Constellation({ layout, skills, selected, onSelect }) {
  const { positions, edges } = layout
  const linked = useMemo(() => neighbours(selected, edges), [selected, edges])

  return (
    <div className="relative mx-auto aspect-[1000/620] w-full max-w-[1200px]" data-constellation>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {/* depth rings: faint orbit guides */}
        {[0.4, 0.7, 0.96].map((r) => (
          <ellipse
            key={r}
            cx={VIEW.w / 2}
            cy={VIEW.h / 2}
            rx={VIEW.rx * r}
            ry={VIEW.ry * r}
            fill="none"
            style={{ stroke: fgMix(6) }}
            strokeDasharray="2 6"
            data-orbit
          />
        ))}
        {edges.map((e, i) => {
          const A = positions[e.a]
          const B = positions[e.b]
          if (!A || !B) return null
          const on = e.a === selected || e.b === selected
          return (
            <g key={i}>
              <line
                data-edge
                pathLength="1"
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                strokeOpacity={on ? 0.85 : e.kind === 'related' ? 0.5 : 1}
                strokeDasharray={e.kind === 'related' && !on ? '0.01 0.015' : undefined}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={{
                  stroke: on ? 'var(--color-accent)' : fgMix(16),
                  transition: 'stroke .4s, stroke-opacity .4s',
                }}
              />
              {on && (
                <line
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  style={{ stroke: 'var(--color-fg)' }}
                  strokeWidth="1.5"
                  className="edge-flow"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
          )
        })}
      </svg>

      {skills.map((s, i) => {
        const p = positions[s.id]
        const isSel = s.id === selected
        const isLinked = linked.has(s.id)
        const right = p.x >= VIEW.w / 2 - 1
        // nodes at the horizontal extremes take their label underneath, so it never leaves the frame
        const below = p.depth >= 2 && Math.abs(Math.cos(p.angle)) > 0.8
        const core = p.depth === 0
        return (
          <button
            key={s.id}
            type="button"
            data-node
            data-depth={p.depth}
            data-cursor="link"
            aria-pressed={isSel}
            aria-label={`${s.name}, ${categories[s.category]?.label}`}
            onClick={() => {
              onSelect(s.id)
              play('select')
            }}
            onPointerEnter={() => onSelect(s.id)}
            onFocus={() => onSelect(s.id)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 p-3"
            style={{ left: `${(p.x / VIEW.w) * 100}%`, top: `${(p.y / VIEW.h) * 100}%` }}
          >
            <span
              className={`skill-dot block transition-all duration-300 ${core ? 'h-3 w-3' : 'h-[7px] w-[7px]'} ${
                isSel ? 'bg-accent' : isLinked ? 'bg-fg' : 'bg-mute group-hover:bg-fg'
              }`}
              style={{ animationDelay: `${(i % 5) * 0.6}s` }}
            />
            <span
              className={`pointer-events-none absolute whitespace-nowrap transition-colors duration-300 ${
                below
                  ? 'top-[calc(100%-6px)] left-1/2 -translate-x-1/2'
                  : `top-1/2 -translate-y-1/2 ${right ? 'left-[calc(100%-2px)]' : 'right-[calc(100%-2px)]'}`
              } ${core ? 'meta' : 'text-[13px] tracking-[-0.01em]'} ${
                isSel ? 'text-fg' : isLinked ? 'text-fg/80' : 'text-mute'
              }`}
            >
              {s.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default memo(Constellation)
