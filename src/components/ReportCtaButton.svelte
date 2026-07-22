<script lang="ts">
  interface Props {
    icon?: string
    variant?: 'pink' | 'green'
    onclick?: () => void
    children: import('svelte').Snippet
  }

  let { icon = '🔒', variant = 'pink', onclick, children }: Props = $props()

  const gradient = $derived(
    variant === 'green'
      ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a]'
      : 'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
  )
  const pulse = $derived(variant === 'green' ? 'animate-crack-pulse-green' : 'animate-crack-pulse')
</script>

<button
  type="button"
  {onclick}
  class="relative block w-full overflow-hidden rounded-2xl px-5 py-3.5 text-center text-[13px] font-black uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 {gradient} {pulse}"
>
  <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/25 via-transparent to-white/25 animate-shimmer-x"></span>
  <span class="relative">{icon} {@render children()}</span>
</button>
