<script lang="ts">
  import { onMount } from 'svelte'

  /**
   * Port da rota /acessando-instagram da referência:
   * tela estilo login do Instagram com animação de "quebra de senha" (7s)
   * e redirecionamento automático para /InstaView (~8.5s).
   */
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const username = params.get('usuario') ?? 'usuario'

  const CRACK_DURATION_MS = 7000
  const REDIRECT_DELAY_MS = 1500

  const statusTexts = [
    'Testando senha...',
    'Analisando hash...',
    'Tentando combinações...',
    'Forçando acesso...',
  ]

  let password = $state('')
  let status = $state(statusTexts[0])
  let done = $state(false)

  onMount(() => {
    window.scrollTo(0, 0)
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

    // Animação dos " caracteres da senha sendo testados
    const scramble = setInterval(() => {
      const len = 14 + Math.floor(Math.random() * 6)
      const last = chars[Math.floor(Math.random() * chars.length)]
      password = '•'.repeat(len - 1) + last
    }, 180)

    // Textos de status rotativos
    let statusIndex = 0
    const statusTimer = setInterval(() => {
      statusIndex = (statusIndex + 1) % statusTexts.length
      status = statusTexts[statusIndex]
    }, 1400)

    // Fim da "quebra"
    const crackTimeout = setTimeout(() => {
      clearInterval(scramble)
      clearInterval(statusTimer)
      password = '•'.repeat(18)
      done = true
    }, CRACK_DURATION_MS)

    // Redirect para o InstaView
    const redirectTimeout = setTimeout(() => {
      window.location.hash = `#/InstaView?usuario=${encodeURIComponent(username)}`
    }, CRACK_DURATION_MS + REDIRECT_DELAY_MS)

    return () => {
      clearInterval(scramble)
      clearInterval(statusTimer)
      clearTimeout(crackTimeout)
      clearTimeout(redirectTimeout)
    }
  })
</script>

<div class="v4-report-shell flex min-h-screen w-full flex-col items-center px-6 pt-16 pb-8 text-slate-950">
  <div class="flex w-full max-w-[320px] flex-col items-center">
    <!-- Logo -->
    <div class="mb-10 flex items-center justify-center">
      <img src="/v4/logo.webp" alt="SpyGram" class="h-12 w-auto object-contain" />
    </div>

    <!-- Campo usuário (readonly) -->
    <div class="mb-2 w-full">
      <div class="relative">
        <input
          id="ig-username"
          type="text"
          value={username}
          readonly
          class="w-full rounded-[10px] border border-[#E1306C]/15 bg-white/90 px-3 pt-4 pb-1 text-[13px] text-slate-950 shadow-[0_10px_26px_rgba(107,29,84,0.08)] outline-none"
        />
        <label for="ig-username" class="pointer-events-none absolute left-3 top-[5px] text-[10px] text-gray-400">
          Telefone, nome de usuário ou e-mail
        </label>
      </div>
    </div>

    <!-- Campo senha (animado) -->
    <div class="mb-1.5 w-full">
      <div class="relative">
        <input
          id="ig-password"
          type="text"
          value={password}
          readonly
          class="w-full rounded-[10px] border border-[#E1306C]/15 bg-white/90 px-3 pt-4 pb-1 text-[13px] tracking-wider text-slate-950 shadow-[0_10px_26px_rgba(107,29,84,0.08)] outline-none"
        />
        <label for="ig-password" class="pointer-events-none absolute left-3 top-[5px] text-[10px] text-gray-400">
          Senha
        </label>
      </div>
    </div>

    <!-- Erro fake -->
    <div class="mb-3 w-full text-[11px] leading-tight text-[#ed4956]">
      A senha que você inseriu está incorreta.
    </div>

    <!-- Card de quebra de criptografia -->
    <div class="mb-3 flex w-full items-center gap-3 rounded-[14px] border border-[#E1306C]/15 bg-white/90 px-3 py-2.5 shadow-[0_12px_30px_rgba(107,29,84,0.08)]">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#7638FA] to-[#5851DB]">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-[13px] font-semibold leading-tight text-slate-950">
          Quebrando criptografia da conta
        </div>
        <div class="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          {#if done}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span class="font-semibold text-emerald-600">Acesso concedido!</span>
          {:else}
            <span class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></span>
            <span>{status}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Botão entrar (fake) -->
    <button
      type="button"
      class="mb-4 w-full cursor-default rounded-[8px] bg-[#0095F6] py-2 text-[14px] font-semibold text-white opacity-80"
    >
      Entrar
    </button>

    <div class="mb-6 text-[12px] text-[#1877F2]">Esqueceu a senha?</div>

    <!-- Divisor -->
    <div class="mb-6 flex w-full items-center gap-4">
      <div class="h-px flex-1 bg-gray-300"></div>
      <span class="text-[12px] font-semibold text-gray-500">OU</span>
      <div class="h-px flex-1 bg-gray-300"></div>
    </div>

    <div class="text-[12px] text-slate-600">
      Não tem uma conta? <span class="font-semibold text-[#1877F2]">Cadastre-se</span>
    </div>
  </div>
</div>
