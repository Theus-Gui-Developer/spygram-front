<script lang="ts">
  import { onMount } from 'svelte'
  import Logo from '../components/Logo.svelte'
  import { openCheckout } from '../lib/config'

  /**
   * Port da rota /back/checkout da referência (versão moderada, sem acesso à câmera):
   * backredirect quando o usuário tenta sair do checkout externo.
   */
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const username = params.get('usuario') ?? 'o perfil monitorado'

  let timeLeft = $state(299)
  const minutes = $derived(Math.floor(timeLeft / 60))
  const seconds = $derived(String(timeLeft % 60).padStart(2, '0'))

  const toasts = [
    'CUIDADO: o acesso a @' + username + ' pode expirar!',
    'Seu relatório está reservado por tempo limitado...',
    'Outras pessoas estão analisando este perfil agora...',
  ]
  let toast = $state('')
  let toastVisible = $state(false)

  onMount(() => {
    const id = setInterval(() => {
      timeLeft = timeLeft > 0 ? timeLeft - 1 : 0
    }, 1000)

    let index = 0
    let hideTimer: ReturnType<typeof setTimeout> | null = null
    const show = () => {
      toast = toasts[index % toasts.length]
      index += 1
      toastVisible = true
      hideTimer = setTimeout(() => (toastVisible = false), 4000)
    }
    const first = setTimeout(show, 600)
    const interval = setInterval(show, 7000)

    return () => {
      clearInterval(id)
      clearTimeout(first)
      clearInterval(interval)
      if (hideTimer) clearTimeout(hideTimer)
    }
  })

  function backToReport() {
    window.location.hash = `#/relatorio?usuario=${encodeURIComponent(username)}`
  }
</script>

<div class="v4-report-shell flex min-h-screen flex-col items-center px-4 py-6">
  <div class="w-full max-w-[420px]">
    <div class="mb-6 flex justify-center">
      <Logo />
    </div>

    <!-- Toast -->
    <div
      class="fixed left-1/2 top-[76px] z-[60] w-[90%] max-w-[340px] -translate-x-1/2 rounded-[10px] border-l-4 border-red-600 bg-white px-4 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-300 {toastVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-4 opacity-0'}"
    >
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
        <div class="text-[12px] font-semibold leading-snug text-slate-900">{toast}</div>
      </div>
    </div>

    <!-- Alerta principal -->
    <div class="v4-report-card mb-4 text-center">
      <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#dc2626">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm.75 10.5L17 15l-.75 1.3L11 13V6.5h1.75V12.5Z" />
        </svg>
      </div>
      <h1 class="mb-1 text-lg font-black text-slate-950">Pagamento não concluído</h1>
      <p class="text-[13px] leading-relaxed text-slate-600">
        Você interrompeu o desbloqueio do relatório de <strong class="text-slate-900">@{username}</strong>.
      </p>
    </div>

    <!-- O que perde -->
    <div class="v4-report-card mb-4">
      <div class="mb-3 text-center text-sm font-bold text-slate-950">Ao sair agora, você perde:</div>
      <ul class="space-y-2.5 text-[13px] text-slate-700">
        {#each ['Todas as conversas do Direct interceptadas', 'Fotos e vídeos privados recuperados', 'Áudios apagados restaurados', 'Localizações suspeitas dos últimos 14 dias'] as item}
          <li class="flex items-start gap-2.5">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <!-- Urgência -->
    <div class="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-center">
      <div class="mb-1 text-[11px] font-black uppercase tracking-wide text-red-600">Reserva expira em</div>
      <div class="text-2xl font-black tabular-nums text-red-700">{minutes}:{seconds}</div>
    </div>

    <!-- CTAs -->
    <button
      type="button"
      onclick={openCheckout}
      class="animate-crack-pulse-green mb-3 block w-full rounded-xl bg-[#25D366] py-4 text-base font-bold uppercase tracking-wide text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)]"
    >
      🔓 Concluir desbloqueio — R$ 48,90
    </button>

    <button
      type="button"
      onclick={backToReport}
      class="block w-full rounded-xl bg-slate-100 py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-200"
    >
      Voltar ao relatório prévio
    </button>
  </div>
</div>
