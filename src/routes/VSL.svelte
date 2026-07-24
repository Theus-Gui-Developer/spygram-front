<script lang="ts">
  import { onMount } from 'svelte'
  import Footer from '../components/Footer.svelte'
  import NotificationStack from '../components/NotificationStack.svelte'
  import {
    flatScanMessages,
    VSL_PROGRESS_DURATION_MS,
    imageFoundToast,
    dmSnippets,
    liveNotifications,
  } from '../lib/analysis-phases'
  import { searchStore } from '../lib/search-store.svelte'
  import { proxiedImageUrl } from '../lib/config'
  import { getSearchCache, saveSearchCache } from '../lib/search-cache'

  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const username = params.get('usuario') ?? 'usuario.exemplo'
  const genero = params.get('genero') ?? 'o'
  const genderKey = genero === 'a' || genero === 'mulher' ? 'mulher' : 'homem'
  const folder = genderKey === 'mulher' ? 'relatorio-mulher' : 'relatorio-men'
  const thumbIds = genderKey === 'mulher' ? [2, 3, 4] : [2, 3, 4]
  const thumbs = thumbIds.map((n) => `/v4/${folder}/R-${n}.webp`)

  const profile = $derived(searchStore.buscaCompleta?.instagram_profile ?? searchStore.profile)
  const profileAvatar = $derived(proxiedImageUrl(profile?.profile_pic_url))
  const profileFullName = $derived(profile?.full_name ?? username.replace(/\./g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
  const profilePosts = $derived(profile?.media_count ?? 1843)
  const profileFollowers = $derived(profile?.follower_count ?? 183053)
  const profileFollowing = $derived(profile?.following_count ?? 235)
  const isPrivate = $derived(profile?.is_private ?? true)

  let progress = $state(0)
  let showImageToast = $state(false)
  let imageToastDismissed = $state(false)
  let showIgCta = $state(false)
  let igCtaDismissed = $state(false)

  const done = $derived(progress >= 100)

  const currentMsgIndex = $derived(
    Math.min(
      flatScanMessages.length - 1,
      Math.max(0, flatScanMessages.findLastIndex((m) => progress >= m.atProgress)),
    ),
  )

  const visibleLogs = $derived.by(() => {
    if (done) return []
    const end = currentMsgIndex
    const start = Math.max(0, end - 2)
    return flatScanMessages.slice(start, end + 1).map((m, i) => {
      const globalIdx = start + i
      return {
        ...m,
        isDone: globalIdx < currentMsgIndex,
        isActive: globalIdx === currentMsgIndex,
      }
    })
  })

  // Contagens (valores da referência no fim)
  const msgPhase = $derived(cardPhase(50, 62))
  const imgPhase = $derived(cardPhase(65, 76))
  const locPhase = $derived(cardPhase(80, 90))

  const counts = $derived({
    messages: progress < 50 ? 0 : progress < 62 ? Math.min(125, Math.floor(((progress - 50) / 12) * 125)) : 125,
    images: progress < 65 ? 0 : progress < 76 ? Math.min(3, Math.floor(((progress - 65) / 11) * 3) || 1) : 3,
    locations: progress < 80 ? 0 : progress < 90 ? 1 : 1,
  })

  function cardPhase(startAt: number, foundAt: number): 'waiting' | 'analyzing' | 'found' {
    if (progress >= foundAt) return 'found'
    if (progress >= startAt) return 'analyzing'
    return 'waiting'
  }

  function goToReport() {
    window.location.hash = `#/relatorio?usuario=${encodeURIComponent(username)}&genero=${genero}`
  }

  function goToInstagram() {
    window.location.hash = `#/acessando-instagram?usuario=${encodeURIComponent(username)}&genero=${genero}`
  }

  onMount(() => {
    const cache = getSearchCache()
    const savedProgress = cache?.vslProgress ?? 0

    if (savedProgress >= 100) {
      progress = 100
      showImageToast = true
      showIgCta = true
      return
    }

    if (savedProgress > 0) {
      progress = savedProgress
      if (!imageToastDismissed && progress >= imageFoundToast.appearAt) showImageToast = true
      if (!igCtaDismissed && progress >= 95) showIgCta = true
    }

    const intervalMs = 50
    const increment = 100 / (VSL_PROGRESS_DURATION_MS / intervalMs)
    let saveTick = 0

    const timer = setInterval(() => {
      progress = Math.min(100, progress + increment)

      if (!imageToastDismissed && progress >= imageFoundToast.appearAt) showImageToast = true
      if (!igCtaDismissed && progress >= 95) showIgCta = true

      saveTick += 1
      if (saveTick % 20 === 0 || progress >= 100) {
        saveSearchCache({ username, genero, vslProgress: progress })
      }

      if (progress >= 100) {
        progress = 100
        clearInterval(timer)
      }
    }, intervalMs)

    return () => clearInterval(timer)
  })
</script>

<svelte:head>
  <script async src="https://script-prod.b-cdn.net/V0.700/hostvsl-player.js"></script>
</svelte:head>

<div class="relative min-h-screen overflow-x-hidden px-3 pb-28 pt-4 sm:px-4">
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#fff5f8] via-[#fff0f5] to-[#f8f4ff]"></div>
    <div class="vsl-orb vsl-orb-a"></div>
    <div class="vsl-orb vsl-orb-b"></div>
    <div class="vsl-orb vsl-orb-c"></div>
    <div class="vsl-matrix" aria-hidden="true"></div>
  </div>

  <div class="mx-auto w-full max-w-[480px]">
    <!-- Badge -->
    <div class="mb-4 flex justify-center">
      {#if done}
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
          Acesso concluído
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      {:else}
        <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-700 shadow-sm">
          <span class="h-2 w-2 animate-pulse rounded-full bg-spy-rose"></span>
          Acesso em andamento
          <span class="ml-1 h-1 w-12 overflow-hidden rounded-full bg-slate-100">
            <span class="block h-full rounded-full bg-black transition-all duration-100" style="width: {progress}%"></span>
          </span>
        </span>
      {/if}
    </div>

    <!-- VSL player -->
    <div class="mb-3 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <div class="border-b border-spy-rose/20 bg-[#0d0d10] px-4 py-3 text-center">
        <p class="text-[11px] font-black uppercase tracking-wider text-white">Assista o vídeo enquanto</p>
        <p class="text-base font-bold text-white">
          Acessamos a conta <span class="text-spy-rose">@{username}</span>
        </p>
      </div>
      <div class="flex aspect-video items-center justify-center bg-black">
        <hostvsl-player
          id="vid-02152869-cf17-4450-a25a-93a56f21623a"
          data-video="https://prod-hostvsl.b-cdn.net/0e3f7df2-86a2-49f1-8227-ec87180c480f/02152869-cf17-4450-a25a-93a56f21623a/videoInformations.js?VIDEO_ORIGIN=ORIGINAL"
        ></hostvsl-player>
      </div>
      <div class="bg-black/80 px-3 py-2 text-center">
        <p class="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-red-400">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>
          Não saia dessa página até que o acesso seja liberado
        </p>
      </div>
    </div>

    {#if done}
      <!-- Banner conteúdo suspeito -->
      <div class="mb-3 animate-fadeInUp rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
        <div class="mb-1 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-red-600">
          <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          Conteúdo suspeito identificado
        </div>
        <p class="text-[13px] leading-snug text-slate-700">
          A análise de <strong>@{username}</strong> foi concluída. Foram encontradas
          <strong class="text-red-600">conversas</strong>,
          <strong class="text-red-600">fotos</strong> e
          <strong class="text-red-600">localizações suspeitas</strong>
          que exigem sua atenção imediata.
        </p>
      </div>

      <button
        type="button"
        onclick={goToReport}
        class="mb-4 flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-5 py-4 text-white shadow-[0_12px_28px_rgba(225,48,108,0.35)] animate-crack-pulse"
      >
        <span class="flex items-center gap-2 text-[15px] font-black uppercase tracking-wide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Clique aqui para ver tudo
        </span>
        <span class="text-[11px] font-medium text-white/90">
          Acesse todo o conteúdo monitorado de @{username}
        </span>
      </button>
    {/if}

    <!-- Perfil -->
    <div class="mb-4 rounded-2xl border border-spy-border bg-white p-3.5 shadow-[0_8px_24px_rgba(107,29,84,0.08)]">
      <div class="flex items-center gap-3">
        <img src={profileAvatar} alt={username} class="h-12 w-12 rounded-full border-2 border-[#FF0069]/40 object-cover" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-[15px] font-bold text-slate-950">@{username}</p>
          <p class="truncate text-xs text-slate-600">{profileFullName}</p>
          <span class="text-[10px] font-black uppercase tracking-wider {isPrivate ? 'text-amber-600' : 'text-emerald-600'}">{isPrivate ? 'Perfil privado' : 'Perfil público'}</span>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-3 gap-2 text-center">
        <div class="rounded-xl bg-slate-50 py-2">
          <div class="text-sm font-black tabular-nums text-slate-950">{profilePosts.toLocaleString('pt-BR')}</div>
          <div class="text-[10px] font-medium uppercase tracking-wide text-slate-500">posts</div>
        </div>
        <div class="rounded-xl bg-slate-50 py-2">
          <div class="text-sm font-black tabular-nums text-slate-950">{profileFollowers.toLocaleString('pt-BR')}</div>
          <div class="text-[10px] font-medium uppercase tracking-wide text-slate-500">seguidores</div>
        </div>
        <div class="rounded-xl bg-slate-50 py-2">
          <div class="text-sm font-black tabular-nums text-slate-950">{profileFollowing.toLocaleString('pt-BR')}</div>
          <div class="text-[10px] font-medium uppercase tracking-wide text-slate-500">seguindo</div>
        </div>
      </div>
    </div>

    <!-- Painel acesso -->
    <div class="mb-4 rounded-2xl border border-white/10 bg-[#0d0d10] p-4 text-white shadow-xl">
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full {done ? 'bg-emerald-500' : 'bg-emerald-500'}"></span>
          <h2 class="text-sm font-bold">{done ? 'Acesso concluído' : 'Acesso em tempo real'}</h2>
        </div>
        <span class="text-sm font-black tabular-nums spy-gradient-text">{Math.round(progress)}%</span>
      </div>
      <div class="mb-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div class="h-full rounded-full spy-gradient transition-all duration-100" style="width: {Math.round(progress)}%"></div>
      </div>

      {#if done}
        <div class="flex items-center gap-2 text-[13px] text-emerald-400">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Acesso total à conta liberado</span>
        </div>
      {:else}
        <ul class="space-y-2.5">
          {#each visibleLogs as log (log.id)}
            <li class="flex items-start gap-2.5 text-[13px]">
              {#if log.isDone}
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span class="text-slate-400 line-through">{log.label}</span>
              {:else}
                <svg class="mt-0.5 h-4 w-4 shrink-0 animate-spin text-spy-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span class="font-medium text-white">{log.label}</span>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <!-- Dados suspeitos detectados -->
    <div class="mb-4">
      <h3 class="mb-3 text-base font-bold text-slate-950">Dados suspeitos detectados:</h3>

      {#if showImageToast && !imageToastDismissed}
        <div class="detected-found mb-3 animate-fadeInUp rounded-xl border-2 border-red-500 bg-red-50 p-4 shadow-[0_14px_34px_rgba(239,68,68,0.22)]">
          <div class="mb-2 flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span class="text-sm font-bold text-red-500">{imageFoundToast.title}</span>
            </div>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600"
              aria-label="Fechar"
              onclick={() => {
                showImageToast = false
                imageToastDismissed = true
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p class="text-[13px] leading-snug text-slate-600">
              {genderKey === 'mulher' ? imageFoundToast.bodyMulher : imageFoundToast.bodyHomem}
            </p>
          </div>
        </div>
      {/if}

      <!-- Mensagens -->
      <div
        class="mb-3 rounded-xl border-2 p-4 transition-all {msgPhase === 'found'
          ? 'border-red-500 bg-red-50 shadow-[0_14px_34px_rgba(239,68,68,0.22)]'
          : 'border-slate-200 bg-white shadow-[0_12px_30px_rgba(107,29,84,0.13)]'}"
      >
        <div class="mb-1.5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={msgPhase === 'found' ? '#ef4444' : '#94a3b8'} stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span class="text-sm font-semibold text-slate-950">Mensagens suspeitas</span>
          </div>
          {#if msgPhase === 'found'}
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          {:else if msgPhase === 'analyzing'}
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500"></div>
          {:else}
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500"></div>
          {/if}
        </div>
        <p class="text-xs {msgPhase === 'found' ? 'font-semibold text-red-500' : 'text-slate-500'}">
          {#if msgPhase === 'waiting'}
            Aguardando análise...
          {:else if msgPhase === 'analyzing'}
            {counts.messages > 0 ? `${counts.messages} encontrados — analisando...` : 'Descriptografando DMs apagadas...'}
          {:else}
            {counts.messages} itens suspeitos identificados
          {/if}
        </p>
        {#if msgPhase !== 'waiting' && counts.messages > 0}
          <div class="mt-3 space-y-2">
            {#each dmSnippets[genderKey].slice(0, msgPhase === 'found' ? 2 : 1) as snip}
              {#if progress >= snip.appearAt || msgPhase === 'found'}
                <div class="flex items-center gap-2 rounded-lg border border-red-100 bg-white/80 px-2.5 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" class="shrink-0">
                    <rect width="18" height="11" x="3" y="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span class="username-blur text-[12px] text-slate-700">{snip.user}</span>
                  <span class="username-blur truncate text-[11px] text-slate-500">{snip.text}</span>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>

      <!-- Imagens -->
      <div
        class="mb-3 rounded-xl border-2 p-4 transition-all {imgPhase === 'found'
          ? 'border-red-500 bg-red-50 shadow-[0_14px_34px_rgba(239,68,68,0.22)]'
          : 'border-slate-200 bg-white shadow-[0_12px_30px_rgba(107,29,84,0.13)]'}"
      >
        <div class="mb-1.5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={imgPhase === 'found' ? '#ef4444' : '#94a3b8'} stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span class="text-sm font-semibold text-slate-950">Imagens suspeitas</span>
          </div>
          {#if imgPhase === 'found'}
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          {:else}
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500"></div>
          {/if}
        </div>
        <p class="text-xs {imgPhase === 'found' ? 'font-semibold text-red-500' : 'text-slate-500'}">
          {#if imgPhase === 'waiting'}
            Aguardando análise...
          {:else if imgPhase === 'analyzing'}
            Analisando fotos temporárias...
          {:else}
            {counts.images} itens suspeitos identificados
          {/if}
        </p>
        {#if imgPhase === 'found'}
          <div class="mt-3 grid grid-cols-3 gap-2">
            {#each thumbs as src}
              <div class="relative aspect-square overflow-hidden rounded-lg bg-slate-800">
                <img {src} alt="" class="h-full w-full object-cover" style="filter: blur(6px);" />
                <div class="absolute inset-0 flex items-center justify-center bg-black/35">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                    <path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6z" />
                  </svg>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Localizações -->
      <div
        class="mb-3 rounded-xl border-2 p-4 transition-all {locPhase === 'found'
          ? 'border-red-500 bg-red-50 shadow-[0_14px_34px_rgba(239,68,68,0.22)]'
          : 'border-slate-200 bg-white shadow-[0_12px_30px_rgba(107,29,84,0.13)]'}"
      >
        <div class="mb-1.5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={locPhase === 'found' ? '#ef4444' : '#94a3b8'} stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span class="text-sm font-semibold text-slate-950">Localizações suspeitas</span>
          </div>
          {#if locPhase === 'found'}
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          {:else}
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500"></div>
          {/if}
        </div>
        <p class="text-xs {locPhase === 'found' ? 'font-semibold text-red-500' : 'text-slate-500'}">
          {#if locPhase === 'waiting'}
            Aguardando análise...
          {:else if locPhase === 'analyzing'}
            Triangulando GPS...
          {:else}
            {counts.locations} item suspeito identificado
          {/if}
        </p>
        {#if locPhase === 'found'}
          <div class="mt-3 flex items-center justify-between rounded-xl border border-red-100 bg-white/80 px-3 py-2.5">
            <div class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div class="text-[13px] font-semibold text-slate-900">Motel/Casa de Massagem</div>
                <div class="text-[11px] text-slate-500">Nos últimos 30 dias</div>
              </div>
            </div>
            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-[12px] font-black text-white">1</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <Footer />
</div>

<!-- CTA flutuante final (referência: Mensagens suspeitas encontradas) -->
{#if showIgCta && !igCtaDismissed}
  <div class="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-fadeInUp">
    <div class="relative overflow-hidden rounded-2xl border border-[#E1306C]/40 bg-white shadow-[0_0_40px_rgba(225,48,108,0.35)]">
      <button
        type="button"
        class="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500"
        aria-label="Fechar"
        onclick={() => {
          showIgCta = false
          igCtaDismissed = true
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <div class="h-1 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]"></div>
      <div class="flex items-center gap-3 p-3.5">
        <img src="/v4/insta_logo.webp" alt="" class="h-10 w-10 rounded-lg" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold leading-tight text-slate-950">Mensagens suspeitas encontradas</p>
          <p class="mt-0.5 text-xs text-slate-600">
            Análise de <strong class="text-slate-950">@{username}</strong> concluída
          </p>
        </div>
        <span class="relative flex h-3 w-3 shrink-0">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
        </span>
      </div>
      <div class="px-3.5 pb-3.5">
        <button
          type="button"
          onclick={goToInstagram}
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] py-3 text-[13px] font-black text-white shadow-md"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Acessar o Instagram e ver tudo
        </button>
      </div>
    </div>
  </div>
{/if}

<NotificationStack items={liveNotifications} />

<style>
  .vsl-orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(70px);
    opacity: 0.55;
    animation: vslFloat 18s ease-in-out infinite;
  }
  .vsl-orb-a {
    width: 22rem;
    height: 22rem;
    top: -6rem;
    left: -8rem;
    background: radial-gradient(circle, rgba(255, 0, 105, 0.45), transparent 70%);
  }
  .vsl-orb-b {
    width: 26rem;
    height: 26rem;
    top: 30%;
    right: -10rem;
    background: radial-gradient(circle, rgba(255, 122, 0, 0.35), transparent 70%);
    animation-delay: -6s;
  }
  .vsl-orb-c {
    width: 20rem;
    height: 20rem;
    bottom: 10%;
    left: 20%;
    background: radial-gradient(circle, rgba(118, 56, 250, 0.35), transparent 70%);
    animation-delay: -12s;
  }
  .vsl-matrix {
    position: absolute;
    inset: 0;
    opacity: 0.07;
    background-image:
      linear-gradient(rgba(225, 48, 108, 0.35) 1px, transparent 1px),
      linear-gradient(90deg, rgba(225, 48, 108, 0.25) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent 85%);
  }
  @keyframes vslFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(2rem, 3rem) scale(1.06); }
    66% { transform: translate(-1.5rem, 2rem) scale(0.96); }
  }
</style>
