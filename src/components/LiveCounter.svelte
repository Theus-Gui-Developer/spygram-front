<script lang="ts">
  import { onMount } from 'svelte'

  const MIN = 280
  const MAX = 350

  function randomCount() {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN
  }

  let count = $state(308)

  onMount(() => {
    const update = () => {
      count = randomCount()
    }

    const timer = setInterval(update, 4_000)
    return () => clearInterval(timer)
  })
</script>

<span class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
  <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
  <span>{count} pessoas usando o sistema agora</span>
</span>
