<script lang="ts">
  import { onMount } from 'svelte'
  import Logo from '../components/Logo.svelte'
  import { openCheckout, proxiedImageUrl } from '../lib/config'
  import { getSearchCache } from '../lib/search-cache'

  /**
   * Port fiel da rota /back/vsl da referência:
   * versão escura da VSL usada como backredirect a partir do relatório.
   */
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const cache = getSearchCache()

  const username = params.get('usuario') ?? cache?.username ?? 'o perfil monitorado'
  const profilePic = cache?.profile?.profile_pic_url
    ? proxiedImageUrl(cache.profile.profile_pic_url)
    : null

  const stats = {
    mensagens: 148,
    imagens: 35,
    localizacoes: 2,
  }

  const benefits = [
    'Acesso completo às DMs, Stories e fotos do Instagram <strong>sem deixar rastros ou alertas</strong>',
    'Localização em tempo real e histórico de lugares visitados <strong>(incluindo endereços suspeitos)</strong>',
    'Todas as fotos do celular, incluindo <strong>imagens íntimas já detectadas</strong>',
    'Conversas deletadas recuperadas e <strong>áudios comprometedores</strong>',
    '<strong>TOTAL ANONIMATO</strong> — A pessoa nunca saberá que está sendo monitorada',
  ]

  let toast = $state('')
  let toastVisible = $state(false)

  onMount(() => {
    const first = setTimeout(() => {
      toast = `CUIDADO: @${username} pode receber um alerta!`
      toastVisible = true
    }, 600)
    const hide = setTimeout(() => (toastVisible = false), 4600)
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100])

    return () => {
      clearTimeout(first)
      clearTimeout(hide)
    }
  })

  function scrollToOffer() {
    const el = document.getElementById('oferta-especial')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function backToReport() {
    window.location.hash = `#/relatorio?usuario=${encodeURIComponent(username)}`
  }
</script>

<div class="min-h-screen bg-black px-4 py-6 text-white" style="font-family: 'Inter', sans-serif;">
  <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-900/10 via-transparent to-purple-900/10"></div>

  <div class="relative z-10 mx-auto w-full max-w-md">
    <!-- Toast -->
    <div
      class="fixed left-1/2 top-4 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 shadow-[0_8px_32px_rgba(239,68,68,0.4)] transition-all duration-300 {toastVisible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-4 opacity-0 pointer-events-none'}"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-base animate-pulse flex-shrink-0">🚨</span>
          <p class="text-sm font-semibold leading-snug">{toast}</p>
        </div>
        <button onclick={() => (toastVisible = false)} class="text-white/70 hover:text-white text-lg leading-none flex-shrink-0">×</button>
      </div>
    </div>

    <div class="mb-5 flex justify-center">
      <Logo variant="light" />
    </div>

    <!-- Alerta principal -->
    <div class="mb-5 rounded-2xl bg-gradient-to-b from-red-600 to-red-700 p-6 text-center shadow-[0_0_40px_rgba(239,68,68,0.3)] relative overflow-hidden">
      <div class="relative z-10">
        {#if profilePic}
          <div class="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full border-[3px] border-white/30 shadow-lg">
            <img src={profilePic} alt="@{username}" class="h-full w-full object-cover" />
          </div>
        {:else}
          <div class="mb-3 text-5xl">⚠️</div>
        {/if}
        <h1 class="text-lg font-extrabold uppercase tracking-tight leading-tight">
          @{username} vai receber um alerta dizendo que você está monitorando!
        </h1>
        <div class="mt-3 inline-block rounded-full bg-yellow-500 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-black">
          Cuidado
        </div>
      </div>
    </div>

    <!-- Explicação -->
    <div class="mb-5 rounded-2xl border border-red-500/30 bg-white/5 p-5">
      <p class="mb-3 text-sm leading-relaxed text-slate-200">
        <strong class="text-white">Na versão gratuita</strong> o perfil que você está investigando pode receber uma notificação falando que você está investigando ele.
      </p>
      <p class="mb-4 text-sm leading-relaxed text-slate-200">
        <strong class="text-white">Não deixe isso acontecer.</strong> Assine a versão paga do aplicativo e não deixe que o perfil receba uma notificação falando que você tentou monitorar.
      </p>
      <div class="mb-3 rounded-xl border border-green-500/30 bg-green-500/10 p-3">
        <p class="text-sm font-semibold leading-relaxed text-green-300">
          Continue monitorando e vendo todo conteúdo que quiser sem que a pessoa seja notificada.
        </p>
      </div>
      <div class="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
        <p class="text-sm font-semibold leading-relaxed text-green-300">
          Veja DMs, stories, fotos apagadas, curtidas secretas e localização!
        </p>
      </div>
    </div>

    <!-- Botão Instagram -->
    <button
      type="button"
      onclick={backToReport}
      class="mb-5 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-4 text-left shadow-[0_10px_30px_rgba(225,48,108,0.35)] transition-all hover:brightness-110 active:scale-[0.98]"
    >
      <img src="/v4/insta_logo.webp" alt="" class="h-10 w-10 shrink-0 rounded-lg" />
      <div class="min-w-0 flex-1">
        <div class="text-[14px] font-black leading-tight text-white">Ver o Instagram real de @{username}</div>
        <div class="truncate text-[11px] text-white/90">Acesse fotos, posts e seguidores agora</div>
      </div>
      <div class="shrink-0 rounded-full bg-white px-3 py-1.5 text-[12px] font-black text-[#E1306C]">ABRIR →</div>
    </button>

    <!-- Resultados -->
    <div class="mb-5 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 class="mb-4 text-center text-sm font-extrabold uppercase tracking-wide text-[#E1306C]">Resultados da Análise Completa</h2>
      <div class="grid grid-cols-3 gap-3">
        <button type="button" class="rounded-xl border border-[#E1306C]/40 bg-black/30 p-3 text-center transition-colors hover:bg-black/40 active:scale-[0.98]">
          <span class="mb-1 block text-2xl">💬</span>
          <div class="mb-1 text-xs font-bold text-[#E1306C]">Mensagens Suspeitas</div>
          <div class="text-2xl font-black tabular-nums text-red-400">{stats.mensagens}</div>
          <div class="text-[10px] text-slate-400">toque pra ver</div>
        </button>
        <button type="button" class="rounded-xl border border-[#E1306C]/40 bg-black/30 p-3 text-center transition-colors hover:bg-black/40 active:scale-[0.98]">
          <span class="mb-1 block text-2xl">📸</span>
          <div class="mb-1 text-xs font-bold text-[#E1306C]">Fotos Comprometedoras</div>
          <div class="text-2xl font-black tabular-nums text-red-400">{stats.imagens}</div>
          <div class="text-[10px] text-slate-400">toque pra ver</div>
        </button>
        <button type="button" class="rounded-xl border border-[#E1306C]/40 bg-black/30 p-3 text-center transition-colors hover:bg-black/40 active:scale-[0.98]">
          <span class="mb-1 block text-2xl">📍</span>
          <div class="mb-1 text-xs font-bold text-[#E1306C]">Localizações Suspeitas</div>
          <div class="text-2xl font-black tabular-nums text-red-400">{stats.localizacoes}</div>
          <div class="text-[10px] text-slate-400">toque pra ver</div>
        </button>
      </div>
    </div>

    <!-- Oferta -->
    <div id="oferta-especial" class="mb-5 scroll-mt-4 rounded-2xl border-[2px] border-green-500/40 bg-gradient-to-b from-green-900/40 to-green-800/20 p-5">
      <h2 class="mb-1 text-center text-xl font-extrabold uppercase tracking-wide text-green-400">Oferta Especial Para Você!</h2>
      <p class="mb-4 text-center text-xs text-slate-400">Desconto exclusivo por tempo limitado</p>
      <div class="mb-4 text-center">
        <div class="text-sm text-slate-400 line-through">De R$ 79,00</div>
        <div class="flex items-center justify-center gap-3">
          <div>
            <div class="text-xs text-slate-300">até 12x de</div>
            <div class="text-4xl font-black tracking-tight text-green-400">R$ 5,38</div>
            <div class="text-xs text-slate-400">ou R$ 48,90 à vista</div>
          </div>
          <div class="rounded-full bg-red-500 px-3 py-1.5 text-xs font-extrabold text-white">36% OFF</div>
        </div>
      </div>
      <button
        type="button"
        onclick={openCheckout}
        class="animate-crack-pulse-green block w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_0_25px_rgba(34,197,94,0.45)] transition-all active:scale-95 hover:brightness-110"
      >
        <span class="flex items-center justify-center gap-2">
          <span class="text-lg">🔒</span>
          <span>SIM, QUERO MONITORAR SEM SER DESCOBERTO!</span>
        </span>
        <span class="mt-1 block text-[10px] font-normal normal-case tracking-normal opacity-90">Clique aqui para ter acesso completo e anônimo</span>
      </button>
      <div class="mt-3 flex items-center justify-center gap-2 rounded-xl bg-black/30 p-3">
        <span class="text-lg">🛡️</span>
        <div>
          <div class="text-xs font-bold text-white">GARANTIA DE 30 DIAS</div>
          <div class="text-[10px] text-slate-400">Se não funcionar, devolvemos 100% do seu dinheiro</div>
        </div>
      </div>
    </div>

    <!-- Benefícios -->
    <div class="mb-5 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 class="mb-4 text-center text-sm font-extrabold uppercase tracking-wide text-[#E1306C]">
        Se você quer ter acesso a todas essas evidências sem ser descoberto, preste atenção...
      </h2>
      <div class="space-y-3">
        {#each benefits as item}
          <div class="flex items-start gap-3">
            <span class="mt-0.5 flex-shrink-0 text-sm text-green-400">✅</span>
            <p class="text-xs leading-relaxed text-slate-300">{@html item}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Decisão -->
    <div class="mb-5 rounded-2xl border border-red-500/30 bg-white/5 p-5">
      <h3 class="mb-3 text-center text-sm font-extrabold text-red-400">A decisão está nas suas mãos...</h3>
      <p class="mb-3 text-center text-xs leading-relaxed text-slate-300">
        Você pode continuar arriscando ser descoberto na versão gratuita, ou garantir total anonimato com a versão paga.
      </p>
      <div class="mb-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
        <p class="text-center text-xs leading-relaxed text-yellow-300">
          <strong>ATENÇÃO:</strong> Na versão gratuita, o perfil pode receber um alerta sobre o monitoramento!
        </p>
      </div>
      <div class="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
        <p class="text-center text-xs leading-relaxed text-red-300">
          <strong>LEMBRE-SE:</strong> @{username} pode descobrir que você está monitorando!
        </p>
      </div>
    </div>

    <!-- CTA final -->
    <div class="mb-5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-5 text-center">
      <h3 class="mb-1 text-sm font-extrabold uppercase tracking-tight text-white">Última oportunidade!</h3>
      <p class="mb-4 text-xs text-orange-100">Não deixe ser descoberto! Garanta seu anonimato agora!</p>
      <button
        type="button"
        onclick={openCheckout}
        class="animate-crack-pulse-green block w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_0_25px_rgba(34,197,94,0.45)] transition-all active:scale-95 hover:brightness-110"
      >
        <span class="flex items-center justify-center gap-2">
          <span class="text-lg">🛡️</span>
          <span>GARANTIR ANONIMATO TOTAL AGORA!</span>
        </span>
        <span class="mt-1 block text-[10px] font-normal normal-case tracking-normal opacity-80">Última chance de evitar ser descoberto</span>
      </button>
    </div>

    <!-- Risco -->
    <div class="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
      <div class="mb-3 text-center">
        <span class="text-3xl">🚨</span>
        <h4 class="mt-1 text-sm font-extrabold uppercase text-red-400">Risco de ser descoberto!</h4>
      </div>
      <p class="mb-3 text-center text-xs leading-relaxed text-slate-300">
        Sem a versão paga, você corre o risco de o perfil receber uma notificação como esta:
      </p>
      <div class="mb-3 rounded-xl border border-white/10 bg-black/40 p-3">
        <p class="text-center text-xs italic text-slate-200">"Alguém está tentando acessar suas conversas e fotos do Instagram"</p>
      </div>
      <p class="text-center text-xs font-semibold text-red-400">Não deixe isso acontecer! Garanta já sua versão paga!</p>
    </div>
  </div>
</div>
