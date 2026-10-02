/**
 * Tiny mutable app store.
 * High-frequency values (scroll, pointer) are read imperatively (rAF / useFrame)
 * and never trigger React renders. Low-frequency values (section, sound, intro)
 * notify subscribers so React can opt in via useSyncExternalStore.
 */
const listeners = new Set()

export const store = {
  // high-frequency, read imperatively
  scroll: 0, // 0..1 page progress
  velocity: 0, // lenis velocity
  hero: 0, // 0..1 hero pin progress
  pointer: { x: 0, y: 0 }, // normalized -1..1
  // low-frequency, subscribable
  state: {
    section: 'hero',
    introDone: false,
    sound: false,
  },
}

export function setState(patch) {
  let changed = false
  for (const k in patch) {
    if (store.state[k] !== patch[k]) changed = true
  }
  if (!changed) return
  store.state = { ...store.state, ...patch }
  listeners.forEach((l) => l())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getState = () => store.state
