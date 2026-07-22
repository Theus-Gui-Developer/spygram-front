<script lang="ts">
  import { onMount } from 'svelte'
  import UrgencyModal from '../components/UrgencyModal.svelte'
  import ChatModal, { type ReportChat } from '../components/ChatModal.svelte'
  import AudioLockedModal from '../components/AudioLockedModal.svelte'
  import ReportToast from '../components/ReportToast.svelte'
  import ReportCtaButton from '../components/ReportCtaButton.svelte'
  import { openCheckout, proxiedImageUrl } from '../lib/config'
  import { searchStore } from '../lib/search-store.svelte'

  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const username = params.get('usuario') ?? searchStore.username ?? 'usuario.exemplo'
  const genero = params.get('genero') ?? 'o'

  const folder = genero === 'a' ? 'relatorio-mulher' : 'relatorio-men'

  const profile = $derived(searchStore.buscaCompleta?.instagram_profile ?? searchStore.profile)
  const profileAvatar = $derived(proxiedImageUrl(profile?.profile_pic_url))
  const profileFullName = $derived(profile?.full_name ?? username.replace(/\./g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
  const profilePosts = $derived(profile?.media_count ?? 142)
  const profileFollowers = $derived(profile?.follower_count ?? 8413)
  const profileFollowing = $derived(profile?.following_count ?? 312)
  const profileBio = $derived(profile?.biography ?? 'Mentor | Palestrante | Infoprodutor\n👔 CEO da Agência Cuscoz com Marketing\n🎓 +100 mil alunos no digital\n💰 Te ensino a ganhar dinheiro na internet')

  const todayLong = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Grade de mídias bloqueadas (6 na grade + 3 no modal de urgência)
  // Cada pasta de gênero tem uma numeração diferente de imagens disponíveis
  const imageIds =
    genero === 'a'
      ? { grid: [1, 2, 3, 4, 5, 6], modal: [7, 9, 10] }
      : { grid: [2, 3, 4, 5, 7, 8], modal: [9, 10, 11] }
  const gridImages = imageIds.grid.map((n) => `/v4/${folder}/R-${n}.webp`)
  const modalImages = imageIds.modal.map((n) => `/v4/${folder}/R-${n}.webp`)

  const numbers = { mensagens: 148, imagens: 35, stories: 12, localizacoes: 2 }

  const keywords = [
    { word: 'amor', count: 13 },
    { word: 'saudade', count: 9 },
    { word: genero === 'a' ? 'gostosa' : 'gostoso', count: 8 },
    { word: 'segredo', count: 7 },
    { word: 'te quero', count: 6 },
    { word: 'não conta', count: 5 },
  ]

  const blockedMessages: ReportChat['script'] = [
    { from: 'received', type: 'text', text: 'Conteúdo bloqueado', time: '14:25' },
    { from: 'sent', type: 'text', text: 'Conteúdo bloqueado', time: '14:26' },
    { from: 'received', type: 'text', text: 'Imagem bloqueada', time: '14:28' },
    { from: 'received', type: 'text', text: 'Conteúdo bloqueado', time: '14:30' },
    { from: 'sent', type: 'text', text: 'Conteúdo bloqueado', time: '14:32' },
    { from: 'received', type: 'text', text: 'Conteúdo bloqueado', time: '14:33' },
    { from: 'received', type: 'text', text: 'Esta mensagem foi apagada', time: '14:35' },
  ]

  const avatarPool = Array.from({ length: 14 }, (_, i) => `/v4/feed/perfis-dm/perfil-dm${i}.webp`)
  const shuffledAvatars = [...avatarPool].sort(() => Math.random() - 0.5)

  function randomHandle() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789_.'
    const len = 9 + Math.floor(Math.random() * 5)
    let out = ''
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
    return out
  }

  const chats: (ReportChat & { preview: string; time: string; suspiciousType: 'message' | 'location' })[] = [
    {
      avatar: shuffledAvatars[0],
      blurHandle: randomHandle(),
      preview: randomHandle(),
      time: 'agora',
      suspiciousType: 'message',
      script: [
        { from: 'received', type: 'audio', duration: '0:24', time: '14:12' },
        { from: 'received', type: 'audio', duration: '0:13', time: '14:15' },
        { from: 'sent', type: 'audio', duration: '0:12', time: '14:18' },
        ...blockedMessages,
      ],
    },
    {
      avatar: shuffledAvatars[1],
      blurHandle: randomHandle(),
      preview: randomHandle(),
      time: '1 min',
      suspiciousType: 'message',
      script: [
        { from: 'received', type: 'audio', duration: '0:32', time: '22:47' },
        { from: 'sent', type: 'text', text: 'Tá bom, vida', time: '22:50' },
        { from: 'sent', type: 'text', text: '😏', time: '22:50' },
        ...blockedMessages,
      ],
    },
    {
      avatar: shuffledAvatars[2],
      blurHandle: randomHandle(),
      preview: randomHandle(),
      time: '3 min',
      suspiciousType: 'location',
      script: [{ from: 'received', type: 'location', time: '23:04' }, ...blockedMessages],
    },
  ]

  const audios = [
    { duration: '0:47', direction: 'received', time: '14:22' },
    { duration: '1:23', direction: 'sent', time: '14:23' },
    { duration: '0:15', direction: 'received', time: '14:28' },
    { duration: '2:05', direction: 'received', time: '14:35' },
  ] as const

  const faqItems = [
    {
      question: 'Quanto tempo tenho acesso?',
      answer: 'O acesso é vitalício. Uma única compra, acesso para sempre.',
    },
    {
      question: 'Funciona em todos os celulares?',
      answer: 'Sim — funciona em celulares, tablets e computadores. Basta ter acesso à internet.',
    },
    {
      question: 'A pessoa espionada descobre que estou monitorando?',
      answer:
        'Não. Todo o monitoramento é feito de forma anônima, sem que a outra pessoa saiba. Ninguém recebe notificação.',
    },
    {
      question: 'Preciso instalar algum aplicativo?',
      answer: 'Não. Tudo funciona pelo navegador, sem instalação. Basta liberar o acesso e começar a usar.',
    },
    {
      question: 'E se eu precisar de suporte?',
      answer:
        'Você terá acesso a um canal de suporte direto 24h, por dentro da plataforma, após liberar seu acesso.',
    },
  ]

  // Timer do header (10 min)
  let timeLeft = $state(599)
  const headerMinutes = $derived(Math.floor(timeLeft / 60))
  const headerSeconds = $derived(String(timeLeft % 60).padStart(2, '0'))

  // Contador de pessoas online
  let onlineCount = $state(247 + Math.floor(Math.random() * 140))

  let openFaq = $state<number | null>(null)
  let activeChat = $state<ReportChat | null>(null)
  let showAudioLocked = $state(false)
  let showUrgency = $state(false)

  // Card "Instagram liberado" + pill flutuante
  let showInstaCard = $state(false)
  let showInstaPill = $state(false)

  function goToCheckout() {
    openCheckout()
  }

  function goToInstagramAccess() {
    window.location.hash = `#/acessando-instagram?usuario=${encodeURIComponent(username)}`
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function closeUrgency() {
    showUrgency = false
    // Reaparece a cada 60s após fechar (como na referência)
    setTimeout(() => (showUrgency = true), 60000)
  }

  onMount(() => {
    const timer = setInterval(() => {
      timeLeft = timeLeft > 0 ? timeLeft - 1 : 0
    }, 1000)

    const onlineTimer = setInterval(() => {
      onlineCount = Math.max(220, onlineCount + (Math.floor(Math.random() * 5) - 2))
    }, 7500)

    // Modal de urgência após 35s
    const urgencyTimer = setTimeout(() => (showUrgency = true), 35000)

    // Card "Instagram liberado": aparece aos 2s, sai aos 9s e vira pill
    const instaShow = setTimeout(() => (showInstaCard = true), 2000)
    const instaHide = setTimeout(() => {
      showInstaCard = false
      showInstaPill = true
    }, 9000)

    return () => {
      clearInterval(timer)
      clearInterval(onlineTimer)
      clearTimeout(urgencyTimer)
      clearTimeout(instaShow)
      clearTimeout(instaHide)
    }
  })
</script>

<div class="v4-report-shell min-h-screen w-full pb-24 text-slate-900 relative overflow-x-hidden">
  <!-- Header sticky com timer -->
  <div class="sticky top-0 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-[#d32f2f] to-[#b71c1c] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-[22px]">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm.75 10.5L17 15l-.75 1.3L11 13V6.5h1.75V12.5Z" />
    </svg>
    <span>Acesso ao relatório expira em</span>
    <span class="min-w-[44px] text-[14px] font-black tabular-nums text-[#ffeb3b]">
      {headerMinutes}:{headerSeconds}
    </span>
  </div>

  <ReportToast />

  <!-- Card do perfil -->
  <div class="mx-auto w-full max-w-[560px] px-4">
    <div class="pt-4 pb-2">
      <div class="overflow-hidden rounded-2xl border border-[#E1306C]/20 bg-white shadow-[0_10px_40px_rgba(107,29,84,0.10)]">
        <div class="flex items-center justify-center px-4 pt-4 pb-3">
          <span class="flex items-center gap-2 text-base font-semibold text-slate-950">
            <span>{username}</span>
            <svg aria-label="Ícone de seta para baixo" fill="currentColor" height="11" role="img" viewBox="0 0 24 24" width="11">
              <path d="M12 17.502a1 1 0 0 1-.707-.293l-9-9.004a1 1 0 0 1 1.414-1.414L12 15.087l8.293-8.296a1 1 0 0 1 1.414 1.414l-9 9.004a1 1 0 0 1-.707.293Z" />
            </svg>
          </span>
        </div>

        <div class="flex items-center gap-4 px-5 pb-4">
          <div class="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-[3px] ring-[#FF0069] ring-offset-4 ring-offset-white shadow-[0_0_25px_rgba(255,0,105,0.35)]">
            <img
              src={profileAvatar}
              alt={username}
              class="h-full w-full object-cover"
            />
          </div>
          <div class="min-w-0 flex-1">
            <p class="mb-3 truncate text-[15px] font-bold text-slate-950">
              {profileFullName}
            </p>
            <div class="flex justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <div class="flex flex-col items-center gap-0.5">
                <span class="text-base font-black tabular-nums text-slate-950">{profilePosts.toLocaleString('pt-BR')}</span>
                <span>posts</span>
              </div>
              <div class="flex flex-col items-center gap-0.5">
                <span class="text-base font-black tabular-nums text-slate-950">{profileFollowers.toLocaleString('pt-BR')}</span>
                <span>segs</span>
              </div>
              <div class="flex flex-col items-center gap-0.5">
                <span class="text-base font-black tabular-nums text-slate-950">{profileFollowing.toLocaleString('pt-BR')}</span>
                <span>seg</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 pb-5 text-[13px] leading-relaxed text-slate-700 whitespace-pre-line line-clamp-4">
          {profileBio}
        </div>
      </div>
    </div>
  </div>

  <!-- Card de autenticação -->
  <div class="mx-auto max-w-[560px] px-4">
    <div class="flex flex-col items-center gap-3 rounded-xl border border-[#E1306C]/20 bg-white px-4 py-4 text-center shadow-[0_8px_24px_rgba(107,29,84,0.10)]">
      <div class="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-50 px-2.5 py-1 text-[11px] whitespace-nowrap">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" class="shrink-0">
          <circle cx="12" cy="12" r="12" fill="#0095F6" />
          <path d="M9.5 15.5L6 12l-1 1 4.5 4.5 9-9-1-1z" fill="#fff" />
        </svg>
        <span class="font-semibold text-emerald-700">Relatório autenticado em {todayLong}</span>
      </div>

      <div class="inline-flex items-center gap-1.5 rounded-full border border-red-500/50 bg-red-50 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-red-700">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>
        Atividades suspeitas detectadas
      </div>

      <div class="inline-flex items-center gap-1.5 text-[11px] whitespace-nowrap text-slate-600">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
        <span class="font-semibold tabular-nums text-emerald-700">{onlineCount}</span>
        <span>pessoas usando o sistema agora</span>
      </div>

      <div class="mt-1 w-full border-t border-slate-200 pt-3 text-center">
        <div class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#E1306C]/25 bg-[#E1306C]/[0.08] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#E1306C]">
          📄 Você está no relatório prévio (grátis)
        </div>
        <p class="mb-3 text-[12px] leading-snug text-slate-600">
          As fotos, mensagens do Direct e localizações <strong class="text-slate-900">completas</strong> estão bloqueadas nesta versão.
        </p>
        <ReportCtaButton variant="green" icon="🔓" onclick={goToCheckout}>
          Desbloquear completo — R$ 48,90
        </ReportCtaButton>
      </div>
    </div>
  </div>

  <div class="mx-auto mt-4 w-full max-w-[560px] space-y-4 px-4">
    <!-- Resumo da análise -->
    <div class="rounded-xl border border-[#E1306C]/20 bg-white p-4 shadow-[0_8px_24px_rgba(107,29,84,0.10)]">
      <div class="mb-3 text-center text-sm font-bold text-slate-950">Resumo da Análise</div>
      <div class="flex flex-col gap-2">
        {#each [
          { icon: '💬', label: 'Mensagens do Direct suspeitas', value: numbers.mensagens, target: 'sec-conversas' },
          { icon: '📷', label: 'Fotos e vídeos privados', value: numbers.imagens, target: 'sec-fotos' },
          { icon: '👁️', label: 'Stories salvos/arquivados', value: numbers.stories, target: null },
          { icon: '📍', label: 'Localizações suspeitas', value: numbers.localizacoes, target: 'sec-localizacoes' },
        ] as row}
          {#if row.target}
            <button
              type="button"
              onclick={() => scrollTo(row.target!)}
              class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-[#E1306C]/25 bg-slate-50 px-3.5 py-2.5 text-left transition-colors hover:bg-slate-100 active:scale-[0.99]"
            >
              <span class="shrink-0 text-xl leading-none">{row.icon}</span>
              <span class="min-w-0 flex-1 text-[13px] leading-snug break-words text-slate-700">{row.label}</span>
              <span class="ml-auto shrink-0 text-right text-lg font-black tabular-nums text-red-600">{row.value}</span>
            </button>
          {:else}
            <div class="flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-[#E1306C]/25 bg-slate-50 px-3.5 py-2.5">
              <span class="shrink-0 text-xl leading-none">{row.icon}</span>
              <span class="min-w-0 flex-1 text-[13px] leading-snug break-words text-slate-700">{row.label}</span>
              <span class="ml-auto shrink-0 text-right text-lg font-black tabular-nums text-red-600">{row.value}</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>

    <!-- Conversas do Direct -->
    <div id="sec-conversas" class="v4-report-card w-full max-w-full min-w-0 scroll-mt-4 overflow-hidden">
      <div class="mb-1 text-sm font-bold text-slate-950">Análise de Conversas do Direct</div>
      <div class="mb-3 text-[12px] leading-relaxed break-words text-slate-500">
        <span class="font-semibold text-red-400">{numbers.mensagens} conversas suspeitas</span> foram encontradas durante a análise.
        O sistema conseguiu recuperar <span class="font-bold text-amber-600">mensagens apagadas</span> e algumas foram
        classificadas como <span class="font-semibold text-red-400">críticas</span>.
      </div>

      <div class="flex flex-col gap-2">
        {#each chats as chat}
          <button
            type="button"
            onclick={() => (activeChat = chat)}
            class="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-[#1a1a22] p-3 text-left transition-colors hover:bg-[#22222c]"
          >
            <div class="relative shrink-0">
              <img
                src={chat.avatar}
                alt=""
                class="h-12 w-12 rounded-full object-cover"
                style="filter: blur(6px); user-select: none; pointer-events: none;"
                draggable="false"
              />
              <span class="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#1a1a22] bg-red-500">
                <span class="text-[8px] font-black text-white">!</span>
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline truncate text-[13px] font-semibold text-white">
                <span>@</span><span class="username-blur" aria-hidden="true">{chat.blurHandle}</span>
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-1.5">
                {#if chat.suspiciousType === 'message'}
                  <span class="shrink-0 rounded-full border border-red-500/50 bg-red-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-300">
                    ⚠️ Mensagem suspeita
                  </span>
                {:else}
                  <span class="shrink-0 rounded-full border border-orange-500/50 bg-orange-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-300">
                    📍 Local suspeito
                  </span>
                {/if}
                <span class="username-blur text-[10px] text-slate-500" aria-hidden="true">{chat.preview}</span>
              </div>
            </div>
            <div class="shrink-0 text-[10px] text-slate-500">{chat.time}</div>
          </button>
        {/each}
      </div>

      <div class="mt-3">
        <ReportCtaButton icon="🔓" onclick={goToCheckout}>DESBLOQUEAR ACESSO COMPLETO</ReportCtaButton>
      </div>
    </div>

    <!-- Fotos e vídeos privados -->
    <div id="sec-fotos" class="v4-report-card scroll-mt-4">
      <div class="mb-1 text-sm font-bold text-slate-950">Fotos e vídeos privados</div>
      <div class="mb-3 text-[12px] text-slate-500">
        <span class="font-semibold text-red-400">{numbers.imagens} mídias</span> enviadas em conversas privadas foram detectadas.
        Todas estão bloqueadas até liberação do acesso.
      </div>

      <div class="grid grid-cols-3 gap-2">
        {#each gridImages as src}
          <div class="relative aspect-square overflow-hidden rounded-lg border border-[#E1306C]/10 bg-white/60">
            <img {src} alt="" class="h-full w-full object-cover" style="filter: blur(4px);" />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6z" />
                </svg>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-3">
        <ReportCtaButton icon="📸" onclick={goToCheckout}>VER FOTOS SUSPEITAS</ReportCtaButton>
      </div>
    </div>

    <!-- Áudios do Direct -->
    <div class="v4-report-card">
      <div class="mb-1 text-sm font-bold text-slate-950">Áudios do Direct</div>
      <div class="mb-3 text-[12px] text-slate-500">
        <span class="font-semibold text-red-400">4 áudios comprometedores</span> encontrados no Direct. Toque para ouvir a prévia.
      </div>

      <div class="space-y-2 rounded-xl border border-white/5 bg-[#1a1a22] p-3">
        {#each audios as audio}
          {@const sent = audio.direction === 'sent'}
          <div class="flex {sent ? 'justify-end' : 'justify-start'}">
            <div
              class="max-w-[85%] min-w-[240px] rounded-2xl px-3 py-2 {sent
                ? 'bg-gradient-to-br from-[#3797f0] to-[#0095f6] text-white rounded-br-md'
                : 'bg-[#262628] text-white rounded-bl-md'}"
            >
              <div class="flex items-center">
                <button
                  type="button"
                  onclick={() => (showAudioLocked = true)}
                  class="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-gray-900"
                  aria-label="Tocar áudio"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div class="flex h-4 flex-1 items-center space-x-1">
                  {#each Array(14) as _, i}
                    <span class="w-0.5 rounded-full bg-white/80" style="height: {5 + (i % 4) * 4}px"></span>
                  {/each}
                </div>
                <span class="ml-3 shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] tabular-nums text-white/90">
                  {audio.duration}
                </span>
              </div>
              <div class="mt-1 flex items-center justify-between text-[10px] opacity-75">
                <span>Ver transcrição</span>
                <span>{audio.time}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-3">
        <ReportCtaButton icon="🎧" onclick={goToCheckout}>OUVIR ÁUDIOS COMPLETOS</ReportCtaButton>
      </div>
    </div>

    <!-- Palavras-chave -->
    <div class="v4-report-card">
      <div class="mb-1 text-sm font-bold text-slate-950">Palavras-chave detectadas</div>
      <div class="mb-3 text-[12px] text-slate-500">
        O sistema escaneou <span class="font-semibold text-slate-950">4.327 mensagens</span> e identificou palavras-chave
        associadas a comportamento suspeito.
      </div>

      <div class="flex flex-col gap-1.5">
        {#each keywords as { word, count }}
          <div class="flex items-center justify-between rounded-lg border border-[#E1306C]/10 bg-white px-3 py-2">
            <span class="text-[13px] font-semibold text-slate-900">“{word}”</span>
            <span class="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[12px] font-black tabular-nums text-red-700">
              {count}
            </span>
          </div>
        {/each}
      </div>

      <div class="mt-3">
        <ReportCtaButton icon="💬" onclick={goToCheckout}>VER TODAS AS MENSAGENS</ReportCtaButton>
      </div>
    </div>

    <!-- Localizações -->
    <div id="sec-localizacoes" class="v4-report-card scroll-mt-4">
      <div class="mb-1 text-sm font-bold text-slate-950">Localizações suspeitas</div>
      <div class="mb-3 text-[12px] text-slate-500">
        <span class="font-semibold text-red-400">{numbers.localizacoes} localizações</span> detectadas nos últimos 14 dias,
        próximas a pontos de encontro não declarados.
      </div>

      <div class="relative h-[220px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#1a2332]">
        <!-- Grade do mapa -->
        <div class="absolute inset-0 opacity-[0.15]">
          {#each [20, 40, 60, 80] as top}
            <div class="absolute left-0 right-0 h-px bg-[#4a6a8a]" style="top: {top}%"></div>
          {/each}
          {#each [15, 35, 55, 75, 90] as left}
            <div class="absolute top-0 bottom-0 w-px bg-[#4a6a8a]" style="left: {left}%"></div>
          {/each}
        </div>
        <!-- Ruas -->
        <div class="absolute rounded-sm bg-[#2a3a4a]" style="top: 38%; left: 0; right: 30%; height: 3px;"></div>
        <div class="absolute rounded-sm bg-[#2a3a4a]" style="top: 18%; left: 33%; bottom: 40%; width: 3px;"></div>
        <div class="absolute rounded-sm bg-[#2a3a4a]" style="top: 58%; left: 20%; right: 0; height: 3px;"></div>
        <div class="absolute rounded-sm bg-[#2a3a4a]" style="top: 10%; left: 70%; bottom: 20%; width: 3px;"></div>
        <!-- Pins -->
        <div class="absolute flex items-center justify-center" style="top: 25%; left: 45%;">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="#e74c3c" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5 2.5z" />
          </svg>
        </div>
        <div class="absolute flex items-center justify-center" style="top: 55%; left: 20%;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#e74c3c" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5 2.5z" />
          </svg>
        </div>
        <!-- Overlay blur -->
        <div class="absolute inset-0" style="background: rgba(26,35,50,0.45); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);"></div>
        <!-- CTA dentro do mapa -->
        <div class="absolute bottom-0 left-0 right-0 p-2">
          <ReportCtaButton icon="📍" onclick={goToCheckout}>VER LOCALIZAÇÕES SUSPEITAS</ReportCtaButton>
        </div>
      </div>
    </div>

    <!-- Fim do relatório prévio -->
    <div class="rounded-xl border-2 border-[#E1306C]/45 bg-gradient-to-br from-[#1e1024] to-[#141418] p-4 text-center shadow-[0_10px_30px_rgba(225,48,108,0.15)]">
      <div class="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-400">
        🔒 Fim do relatório prévio
      </div>
      <p class="mb-1.5 text-[13px] leading-snug text-slate-300">
        Você viu só uma <strong class="text-white">amostra</strong>. O relatório completo tem <strong class="text-white">todas</strong>
        as fotos, conversas do Direct e localizações de <strong class="text-white">@{username}</strong>.
      </p>
      <p class="mb-3 text-[12px] text-slate-400">
        Desbloqueio único por apenas <strong class="text-[15px] text-white">R$ 48,90</strong>.
      </p>
      <ReportCtaButton variant="green" icon="🔓" onclick={goToCheckout}>
        Desbloquear relatório completo
      </ReportCtaButton>
    </div>

    <!-- FAQ -->
    <div class="v4-report-card">
      <div class="mb-3 text-sm font-bold text-slate-950">Perguntas frequentes</div>
      <div class="flex flex-col gap-2">
        {#each faqItems as item, i}
          <div class="overflow-hidden rounded-xl border border-[#E1306C]/14 bg-white">
            <button
              type="button"
              class="flex w-full items-center justify-between px-4 py-3 text-left"
              onclick={() => (openFaq = openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
            >
              <span class="text-[13px] font-semibold text-slate-950">{item.question}</span>
              <span class="text-xl text-slate-400 transition-transform {openFaq === i ? 'rotate-45' : ''}">+</span>
            </button>
            {#if openFaq === i}
              <div class="px-4 pb-3 text-[12px] leading-relaxed text-slate-500">{item.answer}</div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-2">
      <div class="text-center text-[10px] text-slate-500">Ferramenta atualizada: {todayLong}</div>
      <div class="mt-2 space-x-3 text-center text-[10px] text-slate-500">
        <a href="#/termos-de-uso" class="underline">Termos de uso</a>
        <a href="#/politica-privacidade" class="underline">Política de privacidade</a>
      </div>
    </div>
  </div>

  <!-- Card "Instagram liberado" -->
  {#if showInstaCard}
    <div class="animate-fadeInUp fixed bottom-4 left-1/2 z-[70] w-[92%] max-w-[360px] -translate-x-1/2 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-4 shadow-[0_10px_40px_rgba(225,48,108,0.45)]">
      <button
        type="button"
        onclick={() => { showInstaCard = false; showInstaPill = true }}
        class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-sm leading-none text-white hover:bg-black/40"
        aria-label="Fechar"
      >
        ×
      </button>
      <div class="mb-3 flex items-center gap-3">
        <img src="/v4/insta_logo.webp" alt="" class="h-10 w-10 animate-float rounded-lg" />
        <div class="min-w-0">
          <div class="text-[15px] font-black leading-tight text-white">Instagram liberado!</div>
          <div class="truncate text-[11px] text-white/90">Veja tudo que @{username} está fazendo agora</div>
        </div>
      </div>
      <button
        type="button"
        onclick={goToInstagramAccess}
        class="w-full rounded-full bg-white py-3 text-[13px] font-black uppercase tracking-wider text-[#E1306C] shadow-md transition-colors hover:bg-white/95"
      >
        Acessar Instagram →
      </button>
    </div>
  {/if}

  <!-- Pill flutuante -->
  {#if showInstaPill && !showInstaCard}
    <button
      type="button"
      onclick={goToInstagramAccess}
      class="animate-crack-pulse fixed bottom-4 right-3 z-[65] flex items-center gap-2 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] px-3.5 py-2.5 text-[12px] font-bold text-white shadow-[0_6px_20px_rgba(225,48,108,0.5)]"
    >
      <img src="/v4/insta_logo.webp" alt="" class="h-6 w-6" />
      <span>Acessar Instagram</span>
    </button>
  {/if}
</div>

{#if activeChat}
  <ChatModal chat={activeChat} onUnlock={goToCheckout} onClose={() => (activeChat = null)} />
{/if}

{#if showAudioLocked}
  <AudioLockedModal onUnlock={goToCheckout} onClose={() => (showAudioLocked = false)} />
{/if}

{#if showUrgency}
  <UrgencyModal {username} images={modalImages} onUnlock={goToCheckout} onContinue={closeUrgency} />
{/if}
