<script lang="ts">
  import { onMount } from 'svelte'

  let seconds = $state(15 * 60)

  onMount(() => {
    const timer = setInterval(() => {
      if (seconds > 0) seconds--
    }, 1000)
    return () => clearInterval(timer)
  })

  const minutes = $derived(Math.floor(seconds / 60).toString().padStart(2, '0'))
  const secs = $derived((seconds % 60).toString().padStart(2, '0'))
</script>

<div class="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-medium text-white">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
  <span>Acesso ao relatório expira em</span>
  <span class="font-black text-[#ffeb3b] tabular-nums">{minutes}:{secs}</span>
</div>
