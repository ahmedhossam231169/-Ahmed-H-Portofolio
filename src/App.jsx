import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { LazyMotion } from 'motion/react'
import Nav from './components/navigation/Nav'
import Cursor from './components/cursor/Cursor'
import Intro from './components/common/Intro'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import Journey from './sections/Journey/Journey'
import Projects from './sections/Projects/Projects'
import Skills from './sections/Skills/Skills'
import Contact from './sections/Contact/Contact'
import { ScrollTrigger } from './animations/gsap'
import { initLenis } from './animations/scroll/lenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useMediaQuery } from './hooks/useMediaQuery'
import { setState, store } from './utils/store'
import { play } from './utils/sound'
import { supportsWebGL } from './utils/device'

// The 3D scene is a separate chunk and loads after first paint.
const CodeArchitecture = lazy(() => import('./three/CodeArchitecture/CodeArchitecture'))
const motionFeatures = () => import('./utils/motionFeatures').then((m) => m.default)

function shouldPlayIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem('intro-seen')
  } catch {
    return true
  }
}

export default function App() {
  const reduced = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [intro, setIntro] = useState(shouldPlayIntro)
  const [scene, setScene] = useState(false)

  // Intro skipped (repeat visit / reduced motion) → hand over immediately.
  useLayoutEffect(() => {
    if (!intro) setState({ introDone: true })
  }, [intro])

  // Smooth scroll (off for reduced motion)
  useEffect(() => initLenis({ smooth: !reduced }), [reduced])

  // Mount the WebGL backdrop once the main thread is idle.
  useEffect(() => {
    if (!supportsWebGL()) return
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
    const id = idle(() => setScene(true))
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [])

  // Pointer → store (normalised) for the 3D parallax and readouts.
  useEffect(() => {
    const onMove = (e) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Optional interface sound: hover ticks on interactive elements, a soft click on press.
  useEffect(() => {
    let lastEl = null
    const over = (e) => {
      const el = e.target.closest?.('a, button')
      if (el && el !== lastEl) play('tick')
      lastEl = el
    }
    const down = (e) => e.target.closest?.('a, button') && play('select')
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerdown', down)
    return () => {
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerdown', down)
    }
  }, [])

  // Active section → nav indicator + 3D composition.
  useEffect(() => {
    const triggers = [...document.querySelectorAll('[data-section]')].map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setState({ section: el.dataset.section }),
      }),
    )
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      triggers.forEach((t) => t.kill())
      window.removeEventListener('load', refresh)
    }
  }, [reduced])

  return (
    <LazyMotion features={motionFeatures} strict>
      <a href="#main" className="sr-only-focusable meta fixed top-3 left-3 z-[95] bg-fg px-3 py-2 text-bg">
        Skip to content
      </a>

      {scene && (
        <Suspense fallback={null}>
          <CodeArchitecture reduced={reduced} />
        </Suspense>
      )}

      {intro && <Intro onDone={() => setIntro(false)} />}
      {finePointer && <Cursor reduced={reduced} />}
      <Nav />

      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <div aria-hidden="true" className="grain" />
    </LazyMotion>
  )
}
