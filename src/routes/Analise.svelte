<script lang="ts">
  import { onMount } from 'svelte'
  import ProgressModal from '../components/ProgressModal.svelte'
  import ProfileConfirmModal from '../components/ProfileConfirmModal.svelte'
  import Footer from '../components/Footer.svelte'
  import { fetchBuscaCompleta, fetchProfile, InstagramApiError } from '../lib/api'
  import { getFingerprint } from '../lib/fingerprint'
  import {
    searchStore,
    setSearchBuscaCompleta,
    setSearchError,
    setSearchLoading,
    setSearchProfile,
    setSearchUsername,
  } from '../lib/search-store.svelte'

  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const username = params.get('usuario') ?? searchStore.username ?? 'usuario.exemplo'
  const genero = params.get('genero') ?? 'homem'

  let showConfirm = $state(false)
  let finished = $state(false)
  let loading = $state(false)
  let localError = $state('')

  onMount(() => {
    setSearchUsername(username)
    loadProfile()
  })

  async function loadProfile() {
    loading = true
    localError = ''
    setSearchLoading(true)
    try {
      const profile = await fetchProfile(username)
      setSearchProfile(profile)
      showConfirm = true
    } catch (error) {
      const message = error instanceof InstagramApiError ? error.message : 'Não foi possível localizar o perfil. Tente novamente.'
      localError = message
      setSearchError(message)
    } finally {
      loading = false
      setSearchLoading(false)
    }
  }

  async function handleConfirm() {
    showConfirm = false
    loading = true
    setSearchLoading(true)
    try {
      const fingerprint = getFingerprint()
      const result = await fetchBuscaCompleta(username, fingerprint)
      setSearchBuscaCompleta(result)
      finished = true
      setTimeout(() => {
        window.location.hash = `#/vsl?usuario=${encodeURIComponent(username)}&genero=${genero}`
      }, 1500)
    } catch (error) {
      const isBlocked = error instanceof InstagramApiError && error.statusCode === 403
      const message = isBlocked
        ? 'Você já usou sua análise gratuita neste dispositivo. Libere o acesso completo para continuar.'
        : error instanceof InstagramApiError
          ? error.message
          : 'Falha ao gerar o relatório. Tente novamente.'
      localError = message
      setSearchError(message, isBlocked ? 'blocked' : '')
      if (isBlocked) {
        setTimeout(() => {
          window.location.hash = `#/vsl?usuario=${encodeURIComponent(username)}&genero=${genero}`
        }, 2500)
      }
    } finally {
      loading = false
      setSearchLoading(false)
    }
  }

  function handleDecline() {
    window.history.back()
  }
</script>

<div class="page-shell">
  <div class="page-card text-center min-h-[320px] flex flex-col items-center justify-center">
    <div class="relative w-16 h-16 mb-5">
      <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
      <div class="absolute inset-0 rounded-full border-4 border-t-spy-pink border-r-spy-orange border-b-spy-purple border-l-transparent animate-spin"></div>
    </div>
    {#if localError}
      <h1 class="text-lg font-bold text-slate-950">Atenção</h1>
      <p class="text-sm text-slate-600 mt-2 max-w-[260px]">{localError}</p>
      <button
        type="button"
        onclick={() => loadProfile()}
        class="mt-4 rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-5 py-2.5 text-sm font-bold text-white"
      >
        Tentar novamente
      </button>
    {:else if loading}
      <h1 class="text-lg font-bold text-slate-950">Preparando análise...</h1>
      <p class="text-sm text-slate-600 mt-2">@{username}</p>
    {:else}
      <h1 class="text-lg font-bold text-slate-950">Perfil encontrado</h1>
      <p class="text-sm text-slate-600 mt-2">Confirme para iniciar a análise</p>
    {/if}
  </div>

  <Footer />
</div>

{#if !finished && !showConfirm && !localError}
  <ProgressModal {username} onComplete={() => (showConfirm = true)} />
{/if}

{#if showConfirm}
  <ProfileConfirmModal {username} onConfirm={handleConfirm} onDecline={handleDecline} />
{/if}

{#if finished && !localError}
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="w-full max-w-[360px] rounded-3xl bg-white p-6 shadow-2xl text-center animate-fadeInUp">
      <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 class="text-base font-bold text-slate-950">Perfil confirmado</h2>
      <p class="text-sm text-slate-600 mt-1">Iniciando acesso ao relatório...</p>
    </div>
  </div>
{/if}
