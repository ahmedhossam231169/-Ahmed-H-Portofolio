import { useSyncExternalStore } from 'react'
import { getState, subscribe } from '../utils/store'

/** Subscribe to a single low-frequency store key. */
export function useStore(key) {
  return useSyncExternalStore(subscribe, () => getState()[key], () => getState()[key])
}
