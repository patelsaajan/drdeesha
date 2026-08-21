import { ScrollTrigger } from 'gsap/ScrollTrigger'

// The page's real height doesn't exist until GSAP has measured its pins — the
// testimonials deck's pin spacer alone adds about four and a half viewports on
// mount. The browser, meanwhile, does its load-time scroll work well before
// that: restoring where you were on a reload, or jumping to a #hash, against a
// document still four viewports short. Both readings of the target came out
// wrong (clamped to the short document), and because the stylesheet asked for
// smooth scrolling the restore ran as an animation, which the browser abandons
// the moment the document's height changes. Reloading anywhere below the fold
// left you a few hundred pixels from the top — back on the hero, with the nav
// pill dutifully reading "Home" while you had been reading the reviews.
//
// So the load-time scroll is taken over here: tell the browser not to restore,
// hold the target, and apply it once the pins have measured and the page is its
// full height.
export default defineNuxtPlugin(() => {
  const KEY = `scroll:${window.location.pathname}`

  // Ours to restore now, not the browser's.
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

  // Read before anything else has a chance to move the page.
  const hashId = decodeURIComponent(window.location.hash.slice(1))
  const saved = Number(window.sessionStorage.getItem(KEY))

  // pagehide rather than beforeunload: it also fires when the page goes into
  // the back/forward cache, which is exactly when the position matters.
  window.addEventListener('pagehide', () => {
    window.sessionStorage.setItem(KEY, String(window.scrollY))
  })

  // The restore stops being ours the instant the visitor scrolls, taps or
  // clicks anything (a nav jump included) — from then on the position is
  // theirs and re-asserting would yank the page out from under them.
  let released = false
  const release = () => {
    released = true
    ScrollTrigger.removeEventListener('refresh', apply)
  }
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
    window.addEventListener(type, release, { passive: true, once: true })
  }

  function apply() {
    if (released) return
    const target = hashId ? document.getElementById(hashId) : null
    const y = target
      ? window.scrollY + target.getBoundingClientRect().top
      : Number.isFinite(saved) && saved > 0
        ? saved
        : null

    if (y != null) window.scrollTo({ top: y, behavior: 'auto' })
  }

  onNuxtReady(() => {
    const settle = () => {
      // One frame on, so every component has registered its ScrollTriggers,
      // then refresh so the pin spacers are built and the document is finally
      // as tall as it will actually be.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        apply()
        // Anchors may glide again now that nothing is in flight.
        document.documentElement.setAttribute('data-scroll-ready', '')
      })
    }

    if (document.readyState === 'complete') settle()
    else window.addEventListener('load', settle, { once: true })

    // Images and webfonts landing late each trigger another refresh, and a
    // refresh re-measures every pin — which moves the page back out from under
    // the position just set. Re-assert on each one until the visitor takes over.
    ScrollTrigger.addEventListener('refresh', apply)
  })
})
