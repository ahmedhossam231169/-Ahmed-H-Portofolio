import { memo, useMemo, useState } from 'react'

/**
 * Project preview frame.
 * - With `project.image`: a lazily decoded image, cropped per composition via object-position
 *   (falls back to the schematic if the file is missing).
 * - Without one: a generated schematic in the site's node/edge language. It is a neutral
 *   stand-in, not a fake screenshot, and is labelled as pending.
 * The inner [data-parallax] layer is oversized so scroll parallax never exposes edges.
 */
const CROPS = { feature: '50% 30%', split: '50% 50%', compact: '35% 50%' }

export default function ProjectVisual({ project, variant, className = '' }) {
  // A missing or broken image falls back to the schematic, so the panel never shows a hole.
  const [failed, setFailed] = useState(false)
  const showImage = project.image && !failed
  return (
    <div className={`frame relative overflow-hidden bg-bg-2 ${className}`}>
      <div data-parallax className="absolute inset-y-0 -inset-x-[8%]">
        {showImage ? (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            style={{ objectPosition: CROPS[variant] }}
          />
        ) : (
          <Schematic seed={Number(project.index)} index={project.index} />
        )}
      </div>
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
          <path d="M20 0H0V20" fill="none" stroke="rgb(237 237 232 / .045)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="560" height="340" fill="#0c0d10" />
      <rect width="560" height="340" fill={`url(#g${seed})`} />
      {blocks.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={b.filled ? 'rgb(237 237 232 / .04)' : 'none'}
          stroke="rgb(237 237 232 / .22)"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgb(237 237 232 / .28)" vectorEffect="non-scaling-stroke" />
      ))}
      {nodes.map(([x, y], i) => (
        <rect
          key={i}
          x={x - 2.5}
          y={y - 2.5}
          width="5"
          height="5"
          fill={i === activeNode ? '#2f6bff' : '#ededE8'}
        />
      ))}
      <text
        x="24"
        y="318"
        fill="none"
        stroke="rgb(237 237 232 / .14)"
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
