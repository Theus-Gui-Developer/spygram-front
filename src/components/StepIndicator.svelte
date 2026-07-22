<script lang="ts">
  interface Props {
    step: number
    total?: number
  }

  let { step, total = 3 }: Props = $props()
</script>

<div class="flex items-center justify-center gap-2 mt-6" aria-label="Etapa {step} de {total}">
  {#each Array(total) as _, i}
    <span
      class="h-1.5 rounded-full transition-all duration-300 {i + 1 === step
        ? 'w-8 spy-gradient'
        : i + 1 < step
          ? 'w-1.5 bg-spy-orange'
          : 'w-1.5 bg-slate-200'}"
      aria-hidden="true"
    ></span>
  {/each}
</div>

<p class="text-center text-[11px] font-semibold uppercase tracking-wider text-spy-muted mt-3">
  Etapa {step} de {total}
</p>
