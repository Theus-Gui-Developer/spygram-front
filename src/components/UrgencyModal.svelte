<script lang="ts">
  import { onMount } from 'svelte'

  interface Props {
    username: string
    images: string[]
    onUnlock: () => void
    onContinue: () => void
  }

  let { username, images, onUnlock, onContinue }: Props = $props()

  let timeLeft = $state(299)
  const minutes = $derived(Math.floor(timeLeft / 60))
  const seconds = $derived(String(timeLeft % 60).padStart(2, '0'))

  onMount(() => {
    const id = setInterval(() => {
      timeLeft = timeLeft > 0 ? timeLeft - 1 : 0
    }, 1000)
    return () => clearInterval(id)
  })
</script>

<div class="fixed inset-0 z-[85] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
  <div class="w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(225,48,108,0.3)]">
    <!-- Header vermelho -->
    <div class="bg-red-600 p-4 text-center">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff" class="mx-auto mb-1">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
      <h3 class="text-base font-bold text-white">ACESSO EXPIRANDO</h3>
    </div>

    <div class="p-5 text-center">
      <div class="mb-3 inline-block rounded-full bg-red-600 px-3 py-0.5 text-[12px] font-bold tabular-nums text-white">
        Expira em {minutes}:{seconds}
      </div>

      <p class="mb-3 text-sm leading-relaxed text-slate-800">
        <strong class="text-red-600">Conteúdo suspeito detectado!</strong><br />
        Foram encontradas fotos, stories e mensagens do Direct comprometedoras no perfil
        <strong>@{username}</strong>. Libere antes que o acesso expire.
      </p>

      <div class="mb-4 rounded-xl bg-[#1a1a2e] p-3">
        <div class="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-400">
          Imagens apagadas suspeitas
        </div>
        <div class="flex justify-center gap-2">
          {#each images.slice(0, 3) as src}
            <img
              {src}
              alt=""
              class="h-20 w-20 rounded-lg border-2 border-red-500 object-cover"
              style="filter: blur(4px);"
            />
          {/each}
        </div>
      </div>

      <button
        type="button"
        onclick={onUnlock}
        class="animate-crack-pulse block w-full rounded-xl bg-[#25D366] py-4 text-base font-bold uppercase tracking-wide text-white"
      >
        DESBLOQUEAR AGORA — R$ 48,90
      </button>

      <button
        type="button"
        onclick={onContinue}
        class="mt-3 block w-full rounded-xl bg-red-600 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-red-700"
      >
        Continuar vendo o relatório
      </button>
    </div>
  </div>
</div>
