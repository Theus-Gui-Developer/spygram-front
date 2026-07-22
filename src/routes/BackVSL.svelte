<script lang="ts">
  import { onMount } from 'svelte'
  import Logo from '../components/Logo.svelte'
  import Footer from '../components/Footer.svelte'
  import NotificationStack from '../components/NotificationStack.svelte'
  import { analysisPhases, phaseDurationMs, liveNotifications } from '../lib/analysis-phases'

  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const username = params.get('usuario') ?? 'usuario.exemplo'

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=128`

  const stats = {
    posts: 428,
    followers: '101.318',
    following: 227,
  }

  let progress = $state(0)
  let currentPhaseIndex = $state(0)
  let completedPhases = $state<Set<string>>(new Set())
  let videoStarted = $state(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function startVideo() {
    if (videoStarted) return
    videoStarted = true
    startProgress()
  }

  function startProgress() {
    const totalDuration = analysisPhases.length * phaseDurationMs
    const intervalMs = 32
    const increment = 100 / (totalDuration / intervalMs)

    timer = setInterval(() => {
      progress += increment

      const nextIndex = Math.min(Math.floor((progress / 100) * analysisPhases.length), analysisPhases.length - 1)

      if (nextIndex !== currentPhaseIndex) {
        completedPhases = new Set([...completedPhases, analysisPhases[currentPhaseIndex].id])
        currentPhaseIndex = nextIndex
      }

      if (progress >= 100) {
        progress = 100
        completedPhases = new Set(analysisPhases.map((p) => p.id))
        if (timer) clearInterval(timer)
      }
    }, intervalMs)
  }

  function goToReport() {
    window.location.hash = `#/relatorio?usuario=${encodeURIComponent(username)}`
  }

  onMount(() => {
    return () => {
      if (timer) clearInterval(timer)
    }
  })

  const badgeState = $derived.by(() => {
    if (!videoStarted) return 'not-started'
    if (progress >= 100) return 'completed'
    return 'in-progress'
  })
</script>

<div class="min-h-screen flex flex-col items-center px-4 py-6 spy-soft-gradient-bg">
  <div class="w-full max-w-[480px]">
    <div class="flex justify-center mb-4">
      <Logo />
    </div>

    <div class="flex justify-center mb-5">
      {#if badgeState === 'not-started'}
        <span class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-500 shadow-sm">
          <span class="h-2 w-2 rounded-full bg-slate-400"></span>
          Acesso não iniciado
        </span>
      {:else if badgeState === 'completed'}
        <span class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          Acesso concluído
        </span>
      {:else}
        <span class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-700 shadow-sm border border-slate-200">
          <span class="h-2 w-2 rounded-full bg-spy-rose animate-pulse"></span>
          Acesso em andamento
          <span class="ml-1 h-1 w-12 rounded-full bg-slate-100 overflow-hidden">
            <span class="block h-full bg-black rounded-full transition-all duration-100" style="width: {progress}%"></span>
          </span>
        </span>
      {/if}
    </div>

    <!-- Placeholder VSL -->
    <button
      type="button"
      onclick={startVideo}
      class="mb-5 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl transition-transform active:scale-[0.99]"
      aria-label="Iniciar vídeo explicativo"
    >
      <div class="flex h-32 w-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-600 p-3">
        <span class="text-center text-xs font-medium text-slate-500">Área reservada para VSL</span>
        {#if !videoStarted}
          <span class="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-spy-rose">Clique para iniciar</span>
        {/if}
      </div>
    </button>

    <div class="mb-4 text-center">
      <p class="mb-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Assista o vídeo enquanto</p>
      <p class="text-xl font-bold text-slate-950">
        Acessamos a conta <span class="text-spy-rose">@{username}</span>
      </p>
    </div>

    <div class="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center">
      <p class="text-xs font-bold text-red-600 flex items-center justify-center gap-1.5">
        <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
        Não saia dessa página até que o acesso seja liberado
      </p>
    </div>

    <!-- Card do perfil -->
    <div class="mb-5 rounded-2xl border border-spy-border bg-white p-4 spy-shadow">
      <div class="mb-4 flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={username}
          class="h-14 w-14 rounded-full border-2 border-spy-rose/20 object-cover"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-base font-bold text-slate-950">@{username}</p>
          <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-600">
            Perfil privado
          </span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="rounded-xl bg-slate-50 py-2.5">
          <div class="text-sm font-bold text-slate-950">{stats.posts}</div>
          <div class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Posts</div>
        </div>
        <div class="rounded-xl bg-slate-50 py-2.5">
          <div class="text-sm font-bold text-slate-950">{stats.followers}</div>
          <div class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Seguidores</div>
        </div>
        <div class="rounded-xl bg-slate-50 py-2.5">
          <div class="text-sm font-bold text-slate-950">{stats.following}</div>
          <div class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Seguindo</div>
        </div>
      </div>
    </div>

    <!-- Painel de acesso em tempo real -->
    <div class="mb-6 rounded-2xl border border-white/10 bg-[#0d0d10] p-4 text-white shadow-xl">
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <h2 class="text-sm font-bold">Acesso em tempo real</h2>
        </div>
        <span class="text-sm font-black spy-gradient-text">{Math.round(progress)}%</span>
      </div>

      <div class="mb-4 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div class="h-full rounded-full spy-gradient transition-all duration-100" style="width: {Math.round(progress)}%"></div>
      </div>

      <ul class="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
        {#each analysisPhases as phase, i}
          <li class="flex items-start gap-3 text-[13px]">
            {#if completedPhases.has(phase.id)}
              <svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span class="text-slate-400 line-through">{phase.label}</span>
            {:else if i === currentPhaseIndex}
              <svg class="mt-0.5 h-4 w-4 flex-shrink-0 animate-spin text-spy-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span class="font-medium text-white">{phase.label}</span>
            {:else}
              <span class="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-slate-600"></span>
              <span class="text-slate-500">{phase.label}</span>
            {/if}
          </li>
        {/each}
      </ul>
    </div>

    {#if progress >= 90}
      <div class="mb-4 animate-fadeInUp">
        <div class="mb-3 rounded-xl border-2 border-red-200 bg-red-50 p-3 text-center">
          <div class="flex items-center justify-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span class="text-xs font-black uppercase tracking-wider text-red-600">Conteúdo suspeito identificado</span>
          </div>
        </div>

        <button
          type="button"
          onclick={goToReport}
          class="spy-gradient group flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl px-5 py-4 text-white shadow-[0_12px_28px_rgba(255,0,105,0.28)] transition-all duration-200 active:scale-[0.98]"
        >
          <span class="flex items-center gap-2 text-[16px] font-bold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 group-hover:scale-110">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            CLIQUE AQUI PARA VER TUDO
          </span>
          <span class="text-[11px] font-medium text-white/90">
            Acesse todo o conteúdo monitorado de @{username}
          </span>
        </button>
      </div>
    {/if}
  </div>

  <Footer />
</div>

<NotificationStack items={liveNotifications} />
