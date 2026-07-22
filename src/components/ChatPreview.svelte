<script lang="ts">
  import ReportSection from './ReportSection.svelte'
  import GradientButton from './GradientButton.svelte'

  interface Props {
    username: string
    count: number
    checkoutUrl?: string
  }

  let { username, count, checkoutUrl }: Props = $props()

  const previews = [
    { name: 'Contato suspeito #1', text: 'Saudade de você... 💋', time: 'Ontem, 22:14' },
    { name: 'Contato suspeito #2', text: 'A gente se vê hoje?', time: 'Hoje, 09:43' },
    { name: 'Contato suspeito #3', text: 'Te mandei no privado', time: 'Hoje, 14:07' },
  ]

  function handleUnlock() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }
</script>

<ReportSection title="Análise de Conversas do Direct">
  <p class="text-[12px] text-slate-400 mb-3">
    <span class="text-red-400 font-semibold">{count} conversas suspeitas</span>
    foram encontradas no direct de <span class="text-white">@{username}</span>. O conteúdo completo está bloqueado.
  </p>

  <div class="space-y-2 mb-3">
    {#each previews as preview}
      <div class="flex items-center gap-3 bg-[#1a1a22] rounded-xl p-3 border border-white/5">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-spy-pink/40 to-spy-purple/40 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {preview.name.slice(-2)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-white/80 blur-[3px] select-none truncate">{preview.name}</div>
          <div class="text-[11px] text-slate-400 truncate">{preview.text}</div>
        </div>
        <span class="text-[9px] text-slate-500 shrink-0">{preview.time}</span>
      </div>
    {/each}
  </div>

  <GradientButton onclick={handleUnlock}>
    DESBLOQUEAR CONVERSAS COMPLETAS
  </GradientButton>
</ReportSection>
