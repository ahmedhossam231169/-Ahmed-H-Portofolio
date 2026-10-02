/**
 * Radial tree layout for the skills constellation.
 * Each subtree gets an angular wedge proportional to its leaf count, and depth maps
 * to radius. The result is an ellipse sized to the viewBox, which keeps the shape
 * landscape on desktop.
 */
export const VIEW = { w: 1000, h: 620, rx: 400, ry: 265 }

export function buildTree(skills) {
  const byId = Object.fromEntries(skills.map((s) => [s.id, { ...s, children: [] }]))
  let root = null
  skills.forEach((s) => {
    if (s.parent && byId[s.parent]) byId[s.parent].children.push(byId[s.id])
    else if (!s.parent) root = byId[s.id]
  })
  return { root, byId }
}

const leaves = (n) => (n.children.length ? n.children.reduce((a, c) => a + leaves(c), 0) : 1)

export function radialLayout(skills) {
  const { root, byId } = buildTree(skills)
  const positions = {}
  const cx = VIEW.w / 2
  const cy = VIEW.h / 2
  const RX = 400
  const RY = 265
  const radius = [0, 0.4, 0.7, 0.96]

  const place = (node, depth, a0, a1) => {
    const a = (a0 + a1) / 2
    const r = radius[Math.min(depth, radius.length - 1)]
    positions[node.id] = {
      x: cx + Math.cos(a) * RX * r,
      y: cy + Math.sin(a) * RY * r,
      depth,
      angle: a,
    }
    const total = leaves(node)
    let start = a0
    node.children.forEach((c) => {
      const span = ((a1 - a0) * leaves(c)) / total
      place(c, depth + 1, start, start + span)
      start += span
    })
  }
  // rotate so the widest branches sit left/right rather than top/bottom
  place(root, 0, -Math.PI * 0.95, Math.PI * 1.05)

  const edges = []
  skills.forEach((s) => {
    if (s.parent) edges.push({ a: s.parent, b: s.id, kind: 'tree' })
    ;(s.related || []).forEach((r) => byId[r] && edges.push({ a: s.id, b: r, kind: 'related' }))
  })

  return { positions, edges, root, byId }
}

/** Every node directly linked to `id`. */
export function neighbours(id, edges) {
  const set = new Set()
  edges.forEach(({ a, b }) => {
    if (a === id) set.add(b)
    if (b === id) set.add(a)
  })
  return set
}
