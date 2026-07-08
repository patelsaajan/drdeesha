export default defineAppConfig({
  ui: {
    button: {
      compoundVariants: [
        {
          color: 'primary' as const,
          variant: 'subtle' as const,
          class: 'rounded-md ring-0 bg-primary/25 hover:bg-primary/35 active:bg-primary/35 font-display font-semibold tracking-wide cursor-pointer transition-colors',
        },
        {
          color: 'primary' as const,
          variant: 'solid' as const,
          class: 'bg-black/5 hover:bg-black/10 backdrop-blur-md text-foreground font-display font-semibold tracking-wide cursor-pointer transition-colors ring-0 shadow-none border-0',
        },
        {
          // Inverted CTA for use on solid-primary/accent backgrounds (e.g. the
          // footer), where a primary-colored button would blend into the surface.
          color: 'neutral' as const,
          variant: 'solid' as const,
          class: 'bg-white hover:bg-white/90 text-primary font-display font-semibold tracking-wide cursor-pointer transition-colors ring-0 shadow-none border-0',
        },
      ],
    },
    drawer: {
      slots: {
        content: 'bg-background text-foreground',
        header: 'border-b border-foreground/10 px-6 pb-6 pt-8 sm:px-8',
        body: 'overflow-y-auto px-6 py-6 sm:px-8',
        footer: 'border-t border-foreground/10 px-6 py-5 sm:px-8',
      },
      // Side drawers (case detail, etc.) default width.
      compoundVariants: [
        { direction: 'right' as const, class: { content: 'w-2/5' } },
        { direction: 'left' as const, class: { content: 'w-2/5' } },
      ],
    },
  },
})
