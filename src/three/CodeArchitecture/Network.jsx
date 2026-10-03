import { useMemo, useRef, useLayoutEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildGraph } from './buildGraph'
import { store } from '../../utils/store'

// Scene colours per theme. Light mode inverts the network: dark nodes and lines on paper.
export const PALETTES = {
  dark: {
    bg: '#07080a',
    fg: new THREE.Color('#ededE8'),
    mute: new THREE.Color('#6f7278'),
    accent: new THREE.Color('#2f6bff'),
  },
  light: {
    bg: '#f2f1ec',
    fg: new THREE.Color('#0c0d0f'),
    mute: new THREE.Color('#9a9da3'),
    accent: new THREE.Color('#2453f2'),
  },
}

/**
 * Per-section scene state. The network is the backdrop for the whole site and
 * changes its composition as the narrative moves: dense and close in the hero,
 * pulled back behind the text-heavy sections, converging at contact.
 */
const PRESETS = {
  hero: { opacity: 0.85, scale: 1, rotY: 0, camZ: 15, y: 0 },
  about: { opacity: 0.45, scale: 1.15, rotY: 0.35, camZ: 17, y: 0 },
  journey: { opacity: 0.3, scale: 1.2, rotY: 0.15, camZ: 18, y: 0.5 },
  work: { opacity: 0.22, scale: 1.3, rotY: -0.2, camZ: 19, y: -1.5 },
  skills: { opacity: 0.16, scale: 0.95, rotY: 0.6, camZ: 21, y: 0 },
  contact: { opacity: 0.6, scale: 0.75, rotY: 1.1, camZ: 17, y: 0.5 },
}

const tmp = new THREE.Object3D()
const lerp = (a, b, t) => a + (b - a) * t

export default function Network({ quality = 'high', reduced = false, theme = 'dark' }) {
  const high = quality === 'high'
  const P = PALETTES[theme] || PALETTES.dark
  const { nodes, edges, adjacency, rand } = useMemo(
    () => buildGraph({ count: high ? 160 : 70, width: high ? 32 : 16, height: high ? 17 : 24 }),
    [high],
  )
  const packetCount = reduced ? 0 : high ? 24 : 8

  const group = useRef()
  const mesh = useRef()
  const lineMat = useRef()
  const nodeMat = useRef()
  const packetMat = useRef()
  const { camera, invalidate } = useThree()

  // live, lerped scene values
  const live = useRef({ opacity: 0, scale: 1, rotY: 0, camZ: 22, y: 0, px: 0, py: 0 })

  // Static node instances
  useLayoutEffect(() => {
    const m = mesh.current
    nodes.forEach((n, i) => {
      tmp.position.set(n.x, n.y, n.z)
      tmp.rotation.set(0, 0, Math.PI / 4)
      tmp.scale.setScalar(n.hub ? 1.6 : n.active ? 1.3 : 1)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      m.setColorAt(i, n.active ? P.accent : n.hub ? P.fg : P.mute)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [nodes, P])

  // Edge geometry: one draw call
  const lineGeo = useMemo(() => {
    const pos = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => {
      const A = nodes[a]
      const B = nodes[b]
      pos.set([A.x, A.y, A.z, B.x, B.y, B.z], i * 6)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [nodes, edges])

  // Packets travelling node → node along edges
  const packets = useMemo(() => {
    const starts = nodes.map((_, i) => i).filter((i) => adjacency[i].length)
    return Array.from({ length: packetCount }, () => {
      const from = starts[Math.floor(rand() * starts.length)]
      const nbrs = adjacency[from]
      return { from, to: nbrs[Math.floor(rand() * nbrs.length)], t: rand(), speed: 0.25 + rand() * 0.45 }
    })
  }, [nodes, adjacency, packetCount, rand])

  const packetGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Math.max(packetCount, 1) * 3), 3))
    return g
  }, [packetCount])

  useLayoutEffect(
    () => () => {
      lineGeo.dispose()
      packetGeo.dispose()
    },
    [lineGeo, packetGeo],
  )

  // In reduced-motion mode the canvas renders on demand, so we re-render on section changes only.
  useLayoutEffect(() => {
    if (!reduced) return
    const id = setInterval(invalidate, 500)
    return () => clearInterval(id)
  }, [reduced, invalidate])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const L = live.current
    const preset = PRESETS[store.state.section] || PRESETS.hero
    const visible = store.state.introDone ? 1 : 0
    const k = reduced ? 1 : 1 - Math.pow(0.0015, dt) // frame-rate independent smoothing

    // pointer parallax (disabled under reduced motion)
    const px = reduced ? 0 : store.pointer.x
    const py = reduced ? 0 : store.pointer.y
    L.px = lerp(L.px, px, k)
    L.py = lerp(L.py, py, k)

    // section + hero-scroll composition
    const heroPush = reduced ? 0 : store.hero * 3.5
    L.opacity = lerp(L.opacity, preset.opacity * visible, k * 0.6)
    L.scale = lerp(L.scale, preset.scale, k * 0.5)
    L.rotY = lerp(L.rotY, preset.rotY, k * 0.4)
    L.camZ = lerp(L.camZ, preset.camZ - heroPush, k * 0.5)
    L.y = lerp(L.y, preset.y, k * 0.5)

    const g = group.current
    const drift = reduced ? 0 : state.clock.elapsedTime * 0.012
    g.rotation.y = L.rotY + drift + L.px * 0.14
    const sc = reduced ? 0 : store.scroll
    g.rotation.x = -L.py * 0.08 + sc * 0.25
    g.position.y = L.y + sc * 2
    g.scale.setScalar(L.scale)
    camera.position.set(L.px * 0.6, L.py * 0.35, L.camZ)
    camera.lookAt(0, 0, 0)

    lineMat.current.opacity = 0.11 * L.opacity
    // dark marks on paper read heavier than light marks on black, so nodes step back in light mode
    nodeMat.current.opacity = (theme === 'light' ? 0.55 : 0.85) * L.opacity
    if (packetMat.current) packetMat.current.opacity = L.opacity

    if (!packetCount) return
    const arr = packetGeo.attributes.position.array
    const boost = 1 + Math.min(Math.abs(store.velocity) * 0.08, 3) // scrolling speeds up the data flow
    for (let i = 0; i < packets.length; i++) {
      const p = packets[i]
      p.t += dt * p.speed * boost
      if (p.t >= 1) {
        p.t = 0
        const prev = p.from
        p.from = p.to
        const nbrs = adjacency[p.to]
        const options = nbrs.length > 1 ? nbrs.filter((n) => n !== prev) : nbrs
        p.to = options[Math.floor(Math.random() * options.length)]
      }
      const A = nodes[p.from]
      const B = nodes[p.to]
      arr[i * 3] = lerp(A.x, B.x, p.t)
      arr[i * 3 + 1] = lerp(A.y, B.y, p.t)
      arr[i * 3 + 2] = lerp(A.z, B.z, p.t)
    }
    packetGeo.attributes.position.needsUpdate = true
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[null, null, nodes.length]} frustumCulled={false}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshBasicMaterial ref={nodeMat} transparent opacity={0} toneMapped={false} />
      </instancedMesh>

      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial ref={lineMat} color={P.fg} transparent opacity={0} depthWrite={false} />
      </lineSegments>

      {packetCount > 0 && (
        <points geometry={packetGeo} frustumCulled={false}>
          <pointsMaterial
            ref={packetMat}
            color={P.accent}
            size={high ? 3 : 2.5}
            sizeAttenuation={false}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </points>
      )}
    </group>
  )
}
