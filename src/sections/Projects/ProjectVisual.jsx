import { memo, useMemo, useState } from 'react'

/**
 * Project preview frame.
 * - With `project.image`: the frame takes the screenshot's own proportions (read when it
 *   loads, 16:10 until then), so `object-cover` fills it without cropping anything.
 *   Full-page (tall) captures get a 16:10 window anchored to the top of the page instead.
 *   A missing or broken image falls back to the schematic.
 * - Without one: a generated schematic in the site's node/edge language. It is a neutral
 *   stand-in, not a fake screenshot, and is labelled as pending.
 * Colours come from theme tokens, so both work in dark and light mode.
 */
// Below this width/height ratio a screenshot is a full-page capture: show its top like a browser window.
const TALL = 1.2

export default function ProjectVisual({ project, className = '' }) {
  const [failed, setFailed] = useState(false)
  const [ratio, setRatio] = useState(null)
  const [tall, setTall] = useState(false)
  const showImage = project.image && !failed

  const onLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    if (!w || !h) return
    const isTall = w / h < TALL
    setTall(isTall)
    setRatio(isTall ? '16 / 10' : `${w} / ${h}`)
  }

  return (
    <div
      className={`frame relative overflow-hidden bg-bg-2 ${className}`}
      style={ratio ? { '--ar': ratio } : undefined}
    >
      {showImage ? (
        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${tall ? 'object-top' : ''}`}
        />
      ) : (
        <div className="absolute inset-0">
          <Schematic seed={Number(project.index)} index={project.index} />
        </div>
      )}
      <CropMarks />
    </div>
  )
}

function CropMarks() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="crop crop--tl" />
      <span className="crop crop--tr" />
      <span className="crop crop--bl" />
      <span className="crop crop--br" />
    </span>
  )
}

function rng(seed) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// foreground colour at a given strength, from the active theme
const fg = (pct) => `color-mix(in oklab, var(--color-fg) ${pct}%, transparent)`

const Schematic = memo(function Schematic({ seed, index }) {
  const { blocks, paths, nodes } = useMemo(() => {
    const r = rng(seed + 3)
    const G = 20
    const count = 3 + Math.floor(r() * 3)
    const blocks = []
    for (let i = 0; i < count; i++) {
      const w = (3 + Math.floor(r() * 5)) * G
      const h = (2 + Math.floor(r() * 4)) * G
      const x = Math.floor(r() * ((480 - w) / G)) * G + 40
      const y = Math.floor(r() * ((300 - h) / G)) * G
      blocks.push({ x, y, w, h, filled: r() < 0.35 })
    }
    const paths = []
    const nodes = []
    for (let i = 0; i < blocks.length - 1; i++) {
      const a = blocks[i]
      const b = blocks[i + 1]
      const ax = a.x + a.w
      const ay = a.y + a.h / 2
      const bx = b.x
      const by = b.y + b.h / 2
      const mx = Math.round((ax + bx) / 2 / G) * G
      paths.push(`M${ax} ${ay} H${mx} V${by} H${bx}`)
      nodes.push([ax, ay], [bx, by])
    }
    return { blocks, paths, nodes }
  }, [seed])
  const activeNode = seed % Math.max(nodes.length, 1)

  return (
    <svg
      viewBox="0 0 560 340"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label="Preview image pending"
    >
      <defs>
        <pattern id={`g${seed}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" style={{ stroke: fg(4.5) }} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="560" height="340" style={{ fill: 'var(--color-bg-2)' }} />
      <rect width="560" height="340" fill={`url(#g${seed})`} />
      {blocks.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          style={{ fill: b.filled ? fg(4) : 'none', stroke: fg(22) }}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" style={{ stroke: fg(28) }} vectorEffect="non-scaling-stroke" />
      ))}
      {nodes.map(([x, y], i) => (
        <rect
          key={i}
          x={x - 2.5}
          y={y - 2.5}
          width="5"
          height="5"
          style={{ fill: i === activeNode ? 'var(--color-accent)' : 'var(--color-fg)' }}
        />
      ))}
      <text
        x="24"
        y="318"
        fill="none"
        style={{ stroke: fg(14) }}
        fontFamily="Geist, sans-serif"
        fontWeight="500"
        fontSize="150"
        letterSpacing="-8"
      >
        {index}
      </text>
    </svg>
  )
})
