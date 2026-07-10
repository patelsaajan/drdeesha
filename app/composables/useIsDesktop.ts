// Tracks the lg breakpoint (1024px) for behaviour that CSS can't switch —
// e.g. the case drawer's direction prop. SSR renders the mobile value and
// corrects on mount; components should only branch on this for interactions
// that can't happen before hydration anyway.
export function useIsDesktop() {
  const isDesktop = ref(false)

  let mq: MediaQueryList | undefined
  const update = () => {
    isDesktop.value = !!mq?.matches
  }

  onMounted(() => {
    mq = window.matchMedia('(min-width: 1024px)')
    update()
    mq.addEventListener('change', update)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', update)
  })

  return isDesktop
}
