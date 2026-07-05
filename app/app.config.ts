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
      ],
    },
  },
})
