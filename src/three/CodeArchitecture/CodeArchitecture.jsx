import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Network, { PALETTES } from './Network'
import { useStore } from '../../hooks/useStore'
import { getQuality } from '../../utils/device'

/**
 * Fixed WebGL backdrop. App loads it lazily so it never blocks first paint.
 * Pointer events are disabled; the pointer position comes from the shared store.
 */
export default function CodeArchitecture({ reduced }) {
  const [quality] = useState(getQuality)
  const [visible, setVisible] = useState(true)
  const theme = useStore('theme')
  const bg = (PALETTES[theme] || PALETTES.dark).bg

  // Stop rendering while the tab is hidden.
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const high = quality === 'high'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, high ? 1.75 : 1.25]}
        frameloop={!visible ? 'never' : reduced ? 'demand' : 'always'}
        camera={{ fov: 45, near: 0.1, far: 80, position: [0, 0, 22] }}
        gl={{ antialias: high, alpha: false, powerPreference: high ? 'high-performance' : 'low-power' }}
      >
        <color key={`bg-${theme}`} attach="background" args={[bg]} />
        <fog key={`fog-${theme}`} attach="fog" args={[bg, 10, 30]} />
        <Network quality={quality} reduced={reduced} theme={theme} />
      </Canvas>
    </div>
  )
}
