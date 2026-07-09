import type { Ref } from 'vue'
import gsap from 'gsap'

/**
 * The site's shared section entrance: every `.reveal` element inside `root`
 * fades up (autoAlpha + y) on a stagger the first time the section scrolls
 * into view. Respects prefers-reduced-motion by showing everything at once.
 *
 * Pair with the component's own scoped anti-FOUC rule so nothing flashes
 * before GSAP takes over:
 *
 *   @media (prefers-reduced-motion: no-preference) {
 *     .reveal { opacity: 0; }
 *   }
 *
 * Sections that orchestrate extra timeline work alongside their reveals
 * (AboutSection's portrait, TestimonialsSection's row scrub) keep their own
 * bespoke setup instead of this.
 */
export function useSectionReveal(
  root: Ref<HTMLElement | null>,
  options: { stagger?: number, duration?: number, threshold?: number } = {},
) {
  const { stagger = 0.08, duration = 0.9, threshold = 0.15 } = options

  let ctx: gsap.Context | undefined
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const el = root.value
    if (!el) return

    const reveals = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.reveal'))
    if (reveals.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(reveals, { autoAlpha: 1, y: 0 })
      return
    }

    gsap.set(reveals, { autoAlpha: 0, y: 28 })

    ctx = gsap.context(() => {
      observer = new IntersectionObserver(
        ([entry], obs) => {
          if (!entry?.isIntersecting) return
          obs.disconnect()

          gsap.timeline({ defaults: { ease: 'expo.out' } }).to(reveals, {
            autoAlpha: 1,
            y: 0,
            duration,
            stagger,
          })
        },
        { threshold },
      )
      observer.observe(el)
    }, el)
  })

  onUnmounted(() => {
    observer?.disconnect()
    ctx?.revert()
  })
}
