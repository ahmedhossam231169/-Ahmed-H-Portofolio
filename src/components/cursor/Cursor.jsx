import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap'

/**
 * Contextual cursor for fine pointers only. It never renders on touch devices.
 * States come from the nearest [data-cursor] ancestor:
 *   (none)  → precise dot + small ring
 *   link    → ring tightens around the target; [data-magnetic] elements pull toward the pointer
 *   view    → ring becomes a small "VIEW" lens
 *   canvas  → crosshair with live coordinates (over the 3D architecture)
 * All movement runs on GSAP's ticker via quickTo, so there are no React renders.
 */
export default function Cursor({ reduced }) {
  const root = useRef(null)
  const ring = useRef(null)
  const dot = useRef(null)
  const coords = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('has-cursor')
    gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50 })
    const dur = reduced ? 0 : 0.45
    const rx = gsap.quickTo(ring.current, 'x', { duration: dur, ease: 'expo.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: dur, ease: 'expo.out' })
    const dx = gsap.quickTo(dot.current, 'x', { duration: reduced ? 0 : 0.08, ease: 'none' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: reduced ? 0 : 0.08, ease: 'none' })

    let magnet = null
    let state = ''

    const setMode = (mode) => {
      if (mode === state) return
      state = mode
      root.current.dataset.mode = mode
    }

    const releaseMagnet = () => {
      if (!magnet) return
      gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      magnet = null
    }

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e
      dx(x)
      dy(y)
      root.current.style.opacity = '1'

      const target = e.target.closest?.('[data-cursor]')
      const mode = target?.dataset.cursor || ''
      setMode(mode)

      const mag = e.target.closest?.('[data-magnetic]')
      if (mag && !reduced) {
        if (mag !== magnet) releaseMagnet()
        magnet = mag
        const r = mag.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const strength = parseFloat(mag.dataset.magnetic) || 0.25
        gsap.to(mag, { x: (x - cx) * strength, y: (y - cy) * strength, duration: 0.4, ease: 'power3.out' })
        // ring locks to the element center for a precise "snapped" feel
        rx(cx + (x - cx) * 0.3)
        ry(cy + (y - cy) * 0.3)
      } else {
        releaseMagnet()
        rx(x)
        ry(y)
      }

      if (mode === 'canvas' && coords.current) {
        coords.current.textContent = `${(x / innerWidth).toFixed(3)} · ${(y / innerHeight).toFixed(3)}`
      }
    }

    // Content scrolls under a still pointer, so re-resolve the context from the last position.
    let last = null
    let raf = 0
    const onScroll = () => {
      if (!last || raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = document.elementFromPoint(last.clientX, last.clientY)
        if (el) onMove({ clientX: last.clientX, clientY: last.clientY, target: el })
      })
    }
    const track = (e) => (last = { clientX: e.clientX, clientY: e.clientY })

    const onLeave = () => (root.current.style.opacity = '0')
    const onDown = () => root.current.classList.add('is-down')
    const onUp = () => root.current.classList.remove('is-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointermove', track, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointermove', track)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      releaseMagnet()
    }
  }, [reduced])

  return (
    <div ref={root} aria-hidden="true" className="cursor" style={{ opacity: 0 }}>
      <div ref={ring} className="cursor-ring">
        <span className="cursor-label meta">View</span>
        <span ref={coords} className="cursor-coords meta" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
