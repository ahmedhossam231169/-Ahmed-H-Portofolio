/**
 * Optional interface sound. Synthesized with WebAudio (no assets, no autoplay).
 * The AudioContext is created only after the user explicitly enables sound.
 */
import { store } from './store'

let ctx = null
let master = null
let last = 0

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.06
  master.connect(ctx.destination)
  return ctx
}

export function enableAudio() {
  const c = ensure()
  if (c && c.state === 'suspended') c.resume()
}

/** kind: 'tick' (hover) | 'select' (click) */
export function play(kind = 'tick') {
  if (!store.state.sound) return
  const c = ensure()
  if (!c) return
  const now = c.currentTime
  if (now - last < 0.04) return // rate limit
  last = now

  const osc = c.createOscillator()
  const gain = c.createGain()
  const freq = kind === 'select' ? 660 : 1760
  const dur = kind === 'select' ? 0.12 : 0.035

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, now)
  if (kind === 'select') osc.frequency.exponentialRampToValueAtTime(440, now + dur)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(kind === 'select' ? 0.9 : 0.35, now + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

  osc.connect(gain).connect(master)
  osc.start(now)
  osc.stop(now + dur + 0.02)
}
