<script lang="ts">
  import ReportSection from './ReportSection.svelte'
  import GradientButton from './GradientButton.svelte'

  interface Props {
    username: string
    count: number
    gender: 'homem' | 'mulher'
    checkoutUrl?: string
  }

  let { username, count, gender, checkoutUrl }: Props = $props()

  const folder = $derived(gender === 'homem' ? 'relatorio-men' : 'relatorio-mulher')
  const images = $derived(Array.from({ length: 6 }, (_, i) => `/v4/${folder}/${folder}${i + 1}.webp`))

  function handleUnlock() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }
</script>

<ReportSection title="Fotos e vídeos privados">
  <p class="text-[12px] text-slate-400 mb-3">
    <span class="text-red-400 font-semibold">{count} mídias</span>
    enviadas em conversas privadas de <span class="text-white">@{username}</span> foram detectadas.
  </p>

  <div class="grid grid-cols-3 gap-2 mb-3">
    {#each images as src}
      <div class="relative aspect-square rounded-lg overflow-hidden">
        <img {src} alt="Mídia bloqueada" class="w-full h-full object-cover blur-md" />
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span class="text-[9px] text-white font-semibold uppercase mt-1">Bloqueado</span>
        </div>
      </div>
    {/each}
  </div>

  <GradientButton onclick={handleUnlock}>
    VER FOTOS SUSPEITAS
  </GradientButton>
</ReportSection>
