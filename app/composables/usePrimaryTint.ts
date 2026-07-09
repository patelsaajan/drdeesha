// Primary diluted with white by a given percentage — the shared device
// behind every "lighter shade of purple" surface (About panel, footer
// panels, career timeline spine). Solid color-mix output, not opacity, so
// it reads the same regardless of what's underneath.
export function usePrimaryTint(primaryPct: number) {
  return `color-mix(in oklab, var(--color-primary) ${primaryPct}%, white)`
}
