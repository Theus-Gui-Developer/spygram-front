<script lang="ts">
  import Logo from '../components/Logo.svelte'
  import GradientButton from '../components/GradientButton.svelte'
  import Footer from '../components/Footer.svelte'
  import FAQ from '../components/FAQ.svelte'
  import { setSearchUsername, clearSearchError } from '../lib/search-store.svelte'
  import { getSearchCache, getCachedEntryUrl } from '../lib/search-cache'

  let username = $state('')
  let error = $state('')
  let touched = $state(false)
  let showBrowserTip = $state(false)

  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const genero = params.get('genero') ?? 'homem'

  function validate(value: string) {
    const clean = value.trim()
    if (!clean) return 'Digite um nome de usuário válido'
    if (clean.includes(' ')) return 'O @ não pode conter espaços'
    return ''
  }

  function handleSubmit() {
    touched = true
    error = validate(username)
    if (error) return

    const clean = username.replace(/^@/, '').trim().toLowerCase()
    const cache = getSearchCache()
    if (cache && cache.username !== clean) {
      window.location.hash = getCachedEntryUrl(cache)
      return
    }

    setSearchUsername(username)
    clearSearchError()
    window.location.hash = `#/analise?usuario=${encodeURIComponent(username)}&genero=${genero}`
  }

  function openExternalBrowser() {
    const url = new URL(window.location.href)
    url.hash = `#/inicio?genero=${genero}`
    window.open(url.toString(), '_system') || window.open(url.toString(), '_blank')
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 spy-soft-gradient-bg">
  <div class="w-full max-w-[420px] bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-[0_24px_60px_rgba(225,48,108,0.12)] border border-white/60 animate-fadeInScale">
    <div class="flex justify-center mb-4">
      <Logo />
    </div>

    <div class="flex justify-center mb-5 animate-float">
      <img
        src="/v4/spg-hero.webp"
        alt="SpyGram - Análise de Insta"
        width="400"
        height="303"
        class="w-full max-w-[320px] h-auto rounded-2xl shadow-lg"
        loading="eager"
      />
    </div>

    <h1 class="text-2xl sm:text-3xl font-bold text-center text-slate-950 leading-tight">
      Informe o usuário do <span class="spy-gradient-text">Insta</span>
    </h1>

    <p class="text-center text-sm text-slate-600 mt-3 leading-snug">
      Digite o @ exato da pessoa que você quer analisar
    </p>

    <div class="mt-4 flex justify-center">
      <span class="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
        1 análise grátis por dispositivo
      </span>
    </div>

    <form class="mt-5 space-y-4" onsubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div>
        <label for="username" class="block text-sm font-medium text-slate-700 mb-1.5">Nome de usuário</label>
        <div class="spy-soft-input flex items-center gap-2 rounded-full px-4 py-2.5 {touched && error ? 'border-red-400' : ''}">
          <span class="text-slate-400 font-medium">@</span>
          <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="usuario.exemplo"
            class="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
          />
        </div>
        {#if touched && error}
          <p class="text-[11px] text-red-500 mt-1.5 ml-1">{error}</p>
        {/if}
      </div>

      <GradientButton type="submit">
        {#snippet icon()}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        {/snippet}
        Iniciar monitoramento
      </GradientButton>
    </form>

    <button
      type="button"
      onclick={() => showBrowserTip = !showBrowserTip}
      class="mt-3 w-full rounded-full bg-amber-400 hover:bg-amber-300 text-black font-black text-[12px] uppercase tracking-wide py-3 transition-colors shadow-sm"
    >
      Abrir em outro navegador
    </button>

    {#if showBrowserTip}
      <div class="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3.5 animate-fadeInUp">
        <p class="text-[11px] text-amber-900/80 leading-relaxed">
          <strong>Dica:</strong> o Insta não deixa copiar e colar o @. Verifique letras, pontos e números no perfil da pessoa antes de continuar.
        </p>
      </div>
    {/if}

    <div class="mt-6">
      <FAQ />
    </div>
  </div>

  <Footer />
</div>
