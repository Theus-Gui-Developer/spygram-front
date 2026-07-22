<script lang="ts">
  import ReportSection from './ReportSection.svelte'
  import GradientButton from './GradientButton.svelte'

  interface Props {
    gender: 'homem' | 'mulher'
    checkoutUrl?: string
  }

  let { gender, checkoutUrl }: Props = $props()

  const keywords = [
    { word: 'amor', count: 14 },
    { word: 'saudade', count: 9 },
    { word: 'hoje à noite', count: 7 },
    { word: 'te espero', count: 5 },
    { word: 'gostosa', count: 4 },
    { word: 'beijo', count: 11 },
  ]

  function handleUnlock() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }
</script>

<ReportSection title="Palavras-chave detectadas">
  <p class="text-[12px] text-slate-400 mb-3">
    Termos suspeitos identificados nas conversas analisadas.
  </p>

  <div class="space-y-2 mb-3">
    {#each keywords as item}
      <div class="flex items-center justify-between bg-[#1a1a22] rounded-lg px-3 py-2 border border-white/5">
        <span class="text-xs font-medium text-white capitalize">{item.word}</span>
        <span class="text-[11px] font-bold text-spy-rose">{item.count}x</span>
      </div>
    {/each}
  </div>

  <GradientButton onclick={handleUnlock}>
    VER TODAS AS MENSAGENS
  </GradientButton>
</ReportSection>
