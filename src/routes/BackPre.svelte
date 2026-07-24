<script lang="ts">
  import { onMount } from 'svelte'
  import Logo from '../components/Logo.svelte'
  import { openCheckout } from '../lib/config'

  /**
   * Port fiel da rota /back/pre da referência:
   * backredirect quando o usuário tenta sair antes de completar a investigação.
   */
  let toastVisible = $state(false)

  onMount(() => {
    const first = setTimeout(() => (toastVisible = true), 600)
    const hide = setTimeout(() => (toastVisible = false), 4600)
    if (navigator.vibrate) navigator.vibrate([100, 50, 100])

    return () => {
      clearTimeout(first)
      clearTimeout(hide)
    }
  })

  function backToQuiz() {
    window.location.hash = '#/pre'
  }
</script>

<div class="min-h-screen bg-[#0a0a0f] px-4 py-6 text-white" style="font-family: 'Inter', sans-serif;">
  <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-red-900/10"></div>

  <div class="relative z-10 mx-auto w-full max-w-[420px]">
    <!-- Toast -->
    <div
      class="fixed left-1/2 top-4 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 shadow-[0_8px_32px_rgba(239,68,68,0.4)] transition-all duration-300 {toastVisible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-4 opacity-0 pointer-events-none'}"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-base animate-pulse flex-shrink-0">⚠️</span>
          <p class="text-sm font-semibold leading-snug">Investigação interrompida!</p>
        </div>
        <button onclick={() => (toastVisible = false)} class="text-white/70 hover:text-white text-lg leading-none flex-shrink-0">×</button>
      </div>
    </div>

    <div class="mb-6 flex justify-center">
      <Logo variant="light" />
    </div>

    <!-- Alerta principal -->
    <div class="mb-5 rounded-2xl bg-gradient-to-b from-red-600 to-red-700 p-6 text-center shadow-[0_0_40px_rgba(239,68,68,0.3)] relative overflow-hidden">
      <div class="relative z-10">
        <div class="mb-3 text-5xl">⚠️</div>
        <h1 class="text-xl font-extrabold uppercase tracking-tight leading-tight">Espionagem interrompida!</h1>
        <p class="mt-2 text-sm leading-relaxed text-red-100">Você saiu antes de completar a investigação</p>
      </div>
    </div>

    <!-- Cards de status -->
    <div class="mb-5 space-y-3">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
        <span class="text-2xl flex-shrink-0">🔍</span>
        <div>
          <h3 class="text-orange-400 font-bold text-sm mb-1">Investigação em Andamento</h3>
          <p class="text-slate-300 text-xs leading-relaxed">
            Sua varredura foi <strong class="text-white">pausada</strong> e o processo está sendo <strong class="text-orange-400">interrompido</strong>
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
        <span class="text-2xl flex-shrink-0">📋</span>
        <div>
          <h3 class="text-orange-400 font-bold text-sm mb-1">Processo Incompleto</h3>
          <p class="text-slate-300 text-xs leading-relaxed">
            A análise estava em <strong class="text-white">progresso</strong> e precisa ser <strong class="text-orange-400">finalizada</strong>
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
        <span class="text-2xl flex-shrink-0">⏰</span>
        <div>
          <h3 class="text-red-400 font-bold text-sm mb-1">Tempo Limitado</h3>
          <p class="text-slate-300 text-xs leading-relaxed">
            A conexão será <strong class="text-red-400">perdida permanentemente</strong> se você não voltar agora
          </p>
        </div>
      </div>
    </div>

    <!-- Banner de urgência -->
    <div class="mb-5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 p-4 text-center shadow-lg">
      <p class="text-white font-extrabold text-sm uppercase tracking-tight mb-1">Não interrompa o processo!</p>
      <p class="text-red-100 text-xs leading-relaxed">
        A investigação estava em andamento e precisa ser <strong>finalizada</strong>. Volte agora para <strong>completar a análise</strong> antes que a conexão seja perdida!
      </p>
    </div>

    <!-- CTA continuar -->
    <button
      type="button"
      onclick={backToQuiz}
      class="animate-crack-pulse relative mb-4 block w-full overflow-hidden rounded-2xl border-2 border-dashed border-yellow-300/50 bg-gradient-to-r from-[#FFD600] via-[#FF7A00] via-[#FF0069] to-[#7638FA] px-5 py-5 text-center text-base font-extrabold uppercase tracking-wide text-white shadow-[0_0_30px_rgba(255,0,105,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(255,0,105,0.6)] active:scale-95"
    >
      <span class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-white/20 via-transparent to-white/20"></span>
      <span class="relative z-10 flex items-center justify-center gap-3">
        <span class="text-2xl">🔍</span>
        <span>Voltar e continuar investigação</span>
      </span>
    </button>

    <!-- Oferta -->
    <div class="rounded-2xl border border-[#E1306C]/45 bg-gradient-to-br from-[#1e1024] to-[#141418] p-4 text-center shadow-[0_10px_30px_rgba(225,48,108,0.15)]">
      <div class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-400">
        Última chance: 50% OFF
      </div>
      <p class="mb-1 text-[13px] text-slate-300">
        De <span class="line-through">R$ 97,80</span> por apenas
      </p>
      <p class="mb-3 text-2xl font-black text-white">R$ 48,90</p>
      <button
        type="button"
        onclick={openCheckout}
        class="animate-crack-pulse-green block w-full rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] py-4 text-[14px] font-black uppercase tracking-wide text-white"
      >
        🔓 Garantir acesso com desconto
      </button>
      <button
        type="button"
        onclick={backToQuiz}
        class="mt-3 block w-full py-2 text-[12px] font-semibold text-slate-400 transition-colors hover:text-slate-200"
      >
        Não, vou continuar a investigação grátis
      </button>
    </div>

    <!-- Aviso final -->
    <div class="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
      <span class="text-red-400 text-lg flex-shrink-0">⚡</span>
      <p class="text-xs leading-relaxed text-red-200">
        <strong>ATENÇÃO:</strong> Se você fechar esta página, toda a investigação será perdida e você terá que começar do zero!
      </p>
    </div>
  </div>
</div>
