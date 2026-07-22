<script lang="ts">
  import { onMount } from 'svelte'
  import Logo from '../components/Logo.svelte'
  import { openCheckout } from '../lib/config'

  /**
   * Port da rota /back/pre da referência:
   * backredirect quando o usuário tenta sair antes de completar a investigação.
   */
  let timeLeft = $state(299)
  const minutes = $derived(Math.floor(timeLeft / 60))
  const seconds = $derived(String(timeLeft % 60).padStart(2, '0'))

  onMount(() => {
    const id = setInterval(() => {
      timeLeft = timeLeft > 0 ? timeLeft - 1 : 0
    }, 1000)
    return () => clearInterval(id)
  })

  function backToQuiz() {
    window.location.hash = '#/pre'
  }
</script>

<div class="v4-report-shell flex min-h-screen flex-col items-center px-4 py-6">
  <div class="w-full max-w-[420px]">
    <div class="mb-6 flex justify-center">
      <Logo />
    </div>

    <!-- Alerta principal -->
    <div class="v4-report-card mb-4 text-center">
      <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#dc2626">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      </div>
      <h1 class="mb-1 text-lg font-black text-slate-950">Investigação interrompida!</h1>
      <p class="text-[13px] leading-relaxed text-slate-600">
        Você saiu antes de completar a investigação.
      </p>
    </div>

    <!-- Progresso pausado -->
    <div class="v4-report-card mb-4">
      <div class="mb-2 flex items-center justify-between text-[12px] font-bold">
        <span class="text-slate-700">Investigação em andamento</span>
        <span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-700">pausada</span>
      </div>
      <div class="mb-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div class="h-full w-[68%] rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF0069]"></div>
      </div>
      <div class="flex items-center justify-between text-[11px] text-slate-500">
        <span>Processo incompleto</span>
        <span class="font-bold tabular-nums text-slate-700">68%</span>
      </div>
    </div>

    <!-- Urgência -->
    <div class="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-center">
      <div class="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-red-600">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm.75 10.5L17 15l-.75 1.3L11 13V6.5h1.75V12.5Z" />
        </svg>
        Tempo limitado
      </div>
      <p class="text-[12px] leading-relaxed text-red-700">
        Sua análise será <strong>perdida permanentemente</strong> em
        <strong class="tabular-nums">{minutes}:{seconds}</strong>
      </p>
    </div>

    <!-- CTA continuar -->
    <button
      type="button"
      onclick={backToQuiz}
      class="animate-crack-pulse mb-4 block w-full rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-5 py-4 text-center text-[14px] font-black uppercase tracking-wide text-white"
    >
      Voltar e continuar investigação
    </button>

    <!-- Oferta -->
    <div class="rounded-xl border-2 border-[#E1306C]/45 bg-gradient-to-br from-[#1e1024] to-[#141418] p-4 text-center shadow-[0_10px_30px_rgba(225,48,108,0.15)]">
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
  </div>
</div>
