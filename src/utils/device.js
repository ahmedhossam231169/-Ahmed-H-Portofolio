// Device / capability detection used to pick experience tiers.

export const isBrowser = typeof window !== 'undefined'

export const hasFinePointer = () =>
  isBrowser && window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Breakpoint where the full desktop choreography (pinning, horizontal work) runs.
export const DESKTOP_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

/** Quality tier for the WebGL scene. */
export function getQuality() {
  if (!isBrowser) return 'low'
  const w = window.innerWidth
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  if (w < 768 || cores <= 4 || memory <= 2 || !hasFinePointer()) return 'low'
  return 'high'
}

export function supportsWebGL() {
  if (!isBrowser) return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
