<script lang="ts">
  import ReportSection from './ReportSection.svelte'
  import GradientButton from './GradientButton.svelte'

  interface Props {
    count: number
    checkoutUrl?: string
  }

  let { count, checkoutUrl }: Props = $props()

  const audios = [
    { duration: '0:47', time: '14:22' },
    { duration: '0:32', time: '14:45' },
    { duration: '0:18', time: '15:01' },
    { duration: '0:55', time: '15:20' },
  ]

  function handleUnlock() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }
</script>

<ReportSection title="Áudios do Direct">
  <p class="text-[12px] text-slate-400 mb-3">
    <span class="text-red-400 font-semibold">{count} áudios comprometedores</span>
    encontrados. A prévia está disponível abaixo.
  </p>

  <div class="space-y-2 bg-[#1a1a22] rounded-xl p-3 border border-white/5 mb-3">
    {#each audios as audio, i}
      <div class="flex flex-col gap-1">
        <button type="button" class="w-full flex items-center gap-3 group">
          <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
          <div class="flex-1">
            <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full w-1/3 rounded-full bg-spy-rose"></div>
            </div>
          </div>
          <span class="text-[10px] text-slate-400">{audio.duration}</span>
        </button>
        <div class="text-[9px] text-slate-500 text-right">{audio.time}</div>
      </div>
    {/each}
  </div>

  <GradientButton onclick={handleUnlock}>
    OUVIR ÁUDIOS COMPLETOS
  </GradientButton>
</ReportSection>
