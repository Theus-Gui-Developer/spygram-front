<script lang="ts">
  import { onMount } from 'svelte'

  interface Props {
    initialSeconds?: number
  }

  let { initialSeconds = 420 }: Props = $props()

  let seconds = $state<number>()

  $effect.pre(() => {
    if (seconds === undefined) {
      seconds = initialSeconds
    }
  })

  onMount(() => {
    const timer = setInterval(() => {
      if ((seconds ?? 0) > 0) seconds = (seconds ?? 0) - 1
    }, 1000)
    return () => clearInterval(timer)
  })

  const currentSeconds = $derived(seconds ?? 0)
  const minutes = $derived(Math.floor(currentSeconds / 60).toString().padStart(2, '0'))
  const secs = $derived((currentSeconds % 60).toString().padStart(2, '0'))
  const expired = $derived(currentSeconds <= 0)
</script>

<span class="font-bold text-spy-yellow tabular-nums">
  {#if expired}
    Expirado
  {:else}
    {minutes}:{secs}
  {/if}
</span>
