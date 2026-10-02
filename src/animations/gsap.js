import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

gsap.defaults({ ease: 'expo.out', duration: 0.9 })

// Mobile URL-bar resizes shouldn't cause refresh jank.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText }
