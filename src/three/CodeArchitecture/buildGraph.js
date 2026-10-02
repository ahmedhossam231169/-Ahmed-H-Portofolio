/**
 * Builds a layered "software architecture" graph.
 * Four tiers (UI → components → services → data) sit on parallel planes in depth.
 * Nodes snap to a coarse grid so the structure reads as engineered, not random.
 */

// Deterministic PRNG, so the system looks the same on every visit.
function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildGraph({ count = 160, seed = 7, width = 30, height = 16 } = {}) {
  const rand = mulberry32(seed)
  const layers = [-7, -3.5, 0, 3.5] // z planes
  const cell = 1.6
  const nodes = [] // { x, y, z, layer, hub, active }
  const taken = new Set()

  let guard = 0
  while (nodes.length < count && guard++ < count * 20) {
    const layer = Math.floor(rand() * layers.length)
    // Deeper layers are wider so the perspective frustum stays filled.
    const spread = 1 + (layers.length - 1 - layer) * 0.18
    const gx = Math.round(((rand() - 0.5) * width * spread) / cell)
    const gy = Math.round(((rand() - 0.5) * height * spread) / cell)
    const key = `${layer}:${gx}:${gy}`
    if (taken.has(key)) continue
    taken.add(key)
    nodes.push({
      x: gx * cell + (rand() - 0.5) * 0.25,
      y: gy * cell + (rand() - 0.5) * 0.25,
      z: layers[layer] + (rand() - 0.5) * 0.4,
      layer,
      hub: rand() < 0.08,
      active: rand() < 0.07,
    })
  }

  // Edges: k nearest neighbours in the same layer, plus sparse links to the next tier.
  const edgeSet = new Set()
  const edges = []
  const addEdge = (a, b) => {
    if (a === b) return
    const k = a < b ? `${a}-${b}` : `${b}-${a}`
    if (edgeSet.has(k)) return
    edgeSet.add(k)
    edges.push([a, b])
  }
  const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2

  nodes.forEach((n, i) => {
    const same = []
    const next = []
    nodes.forEach((m, j) => {
      if (i === j) return
      if (m.layer === n.layer) same.push([dist2(n, m), j])
      else if (m.layer === n.layer + 1) next.push([dist2(n, m), j])
    })
    same.sort((a, b) => a[0] - b[0])
    const k = n.hub ? 4 : 2
    for (let s = 0; s < Math.min(k, same.length); s++) {
      if (same[s][0] < 30) addEdge(i, same[s][1])
    }
    if (next.length && (n.hub || rand() < 0.28)) {
      next.sort((a, b) => a[0] - b[0])
      addEdge(i, next[0][1])
    }
  })

  // Adjacency for packet routing
  const adjacency = nodes.map(() => [])
  edges.forEach(([a, b]) => {
    adjacency[a].push(b)
    adjacency[b].push(a)
  })

  return { nodes, edges, adjacency, rand }
}
