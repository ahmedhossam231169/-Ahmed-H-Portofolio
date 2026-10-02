import { useLayoutEffect } from 'react'
import { gsap } from '../gsap'
import { DESKTOP_QUERY } from '../../utils/device'

/** Media conditions shared by every choreography. */
export const MEDIA = {
  desktop: `${DESKTOP_QUERY} and (prefers-reduced-motion: no-preference)`,
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
}

/**
 * Runs GSAP setup inside a gsap.matchMedia scoped to `scope`.
 * Each condition block reverts automatically when the media query changes
 * or the component unmounts, so tweens, ScrollTriggers and SplitText are cleaned up.
 *
 * setup(conditions, ctx) receives { desktop, motion, reduce } booleans and the matchMedia context.
 */
export function useGsap(setup, scope, deps = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scope?.current || undefined)
    mm.add(MEDIA, (ctx) => setup(ctx.conditions, ctx))
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
