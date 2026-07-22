<script lang="ts">
  import Logo from '../components/Logo.svelte'
  import Footer from '../components/Footer.svelte'

  type Target = 'homem' | 'mulher' | null

  let step = $state(1)
  let features = $state([
    { id: 'messages', label: 'Mensagens apagadas e DMs do Insta', checked: true },
    { id: 'media', label: 'Fotos e vídeos ocultos na galeria', checked: true },
    { id: 'location', label: 'Localização exata em tempo real', checked: true },
    { id: 'feed', label: 'Feed, Stories e quem a pessoa curtiu', checked: true },
  ])
  let target: Target = $state(null)

  function toggleFeature(id: string) {
    features = features.map((f) => (f.id === id ? { ...f, checked: !f.checked } : f))
  }

  function selectTarget(value: Target) {
    target = value
    step = 3
  }

  function selectInvisible(value: 'sim' | 'nao') {
    const gender = target ?? 'homem'
    window.location.hash = `#/inicio?genero=${gender}&modo=${value}`
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 spy-soft-gradient-bg">
  <div class="w-full max-w-[420px] bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-[0_24px_60px_rgba(225,48,108,0.12)] border border-white/60 animate-fadeInScale">
    <div class="flex justify-center mb-2">
      <Logo />
    </div>

    <!-- Step indicator -->
    <div class="flex items-center justify-center gap-2 mb-3">
      {#each [1, 2, 3] as s}
        <span
          class="h-1.5 rounded-full transition-all duration-300 {s === step ? 'w-8 spy-gradient' : s < step ? 'w-1.5 bg-spy-orange' : 'w-1.5 bg-slate-200'}"
        ></span>
      {/each}
    </div>
    <p class="text-center text-[11px] font-semibold uppercase tracking-wider text-spy-muted mb-6">
      Etapa {step} de 3
    </p>

    {#if step === 1}
      <div class="animate-fadeInUp">
        <h1 class="text-[1.6rem] sm:text-[1.8rem] font-bold text-center text-slate-950 leading-tight">
          O que você quer descobrir?
        </h1>
        <p class="text-center text-[15px] text-slate-500 mt-4 leading-snug px-1">
          O sistema já marcou tudo por padrão. Escolha o que você quer acessar no celular dessa pessoa.
          <span class="spy-gradient-text font-bold">Nada vai escapar.</span>
        </p>

        <div class="mt-6 space-y-3">
          {#each features as feature, i (feature.id)}
            <button
              type="button"
              class="w-full flex items-center gap-3.5 rounded-2xl border px-4 py-4 text-left text-[15px] font-medium transition-all duration-200 {feature.checked
                ? 'border-spy-pink/25 bg-gradient-to-r from-rose-50/80 to-violet-50/80 text-slate-900'
                : 'border-slate-200 bg-white text-slate-700 hover:border-spy-pink/20'}"
              style="animation-delay: {i * 75}ms"
              onclick={() => toggleFeature(feature.id)}
            >
              <span class="spy-checkbox-simple {feature.checked ? 'checked' : ''}"></span>
              {feature.label}
            </button>
          {/each}
        </div>

        <button
          type="button"
          onclick={() => (step = 2)}
          class="mt-6 w-full min-h-[54px] rounded-2xl spy-gradient text-white font-bold text-[16px] shadow-[0_12px_28px_rgba(255,0,105,0.28)] hover:shadow-[0_16px_34px_rgba(255,0,105,0.36)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Confirmar e avançar
        </button>
      </div>
    {/if}

    {#if step === 2}
      <div class="animate-fadeInUp">
        <h1 class="text-[1.6rem] sm:text-[1.8rem] font-bold text-center text-slate-950 leading-tight">
          Quem você vai monitorar?
        </h1>
        <p class="text-center text-[15px] text-slate-500 mt-4 leading-snug px-1">
          Precisamos saber isso para ajustar o rastreador e buscar exatamente
          <span class="spy-gradient-text font-bold">os segredos que essa pessoa esconde.</span>
        </p>

        <div class="mt-7 space-y-3">
          <button
            type="button"
            onclick={() => selectTarget('homem')}
            class="w-full min-h-[58px] rounded-2xl spy-gradient text-white font-bold text-[17px] shadow-[0_12px_28px_rgba(255,0,105,0.28)] hover:shadow-[0_16px_34px_rgba(255,0,105,0.36)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Homem
          </button>

          <button
            type="button"
            onclick={() => selectTarget('mulher')}
            class="w-full min-h-[58px] rounded-2xl spy-gradient text-white font-bold text-[17px] shadow-[0_12px_28px_rgba(255,0,105,0.28)] hover:shadow-[0_16px_34px_rgba(255,0,105,0.36)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Mulher
          </button>
        </div>
      </div>
    {/if}

    {#if step === 3}
      <div class="animate-fadeInUp">
        <h1 class="text-[1.6rem] sm:text-[1.8rem] font-bold text-center text-slate-950 leading-tight">
          Ativar modo invisível?
        </h1>

        <div class="mt-5 rounded-2xl p-4 bg-gradient-to-r from-rose-50 via-violet-50 to-indigo-50 border border-spy-pink/10">
          <div class="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span class="text-[11px] font-bold uppercase tracking-wide text-[#8d2b58]">O que é o modo invisível?</span>
          </div>
          <p class="text-[13px] text-slate-600 leading-relaxed">
            O modo Invisível esconde todas as <strong class="text-slate-950">notificações do nosso app de monitoramento</strong>
            no celular desejado. Com esse modo, você permanecerá <span class="spy-gradient-text font-bold">despercebido</span>.
          </p>
        </div>

        <div class="mt-6 space-y-3">
          <button
            type="button"
            onclick={() => selectInvisible('sim')}
            class="w-full min-h-[54px] rounded-2xl spy-gradient text-white font-bold text-[16px] shadow-[0_12px_28px_rgba(255,0,105,0.28)] hover:shadow-[0_16px_34px_rgba(255,0,105,0.36)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Sim, quero ficar 100% invisível
          </button>

          <button
            type="button"
            onclick={() => selectInvisible('nao')}
            class="w-full min-h-[54px] rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-[16px] hover:border-spy-pink/40 hover:text-spy-rose active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
            Não precisa
          </button>
        </div>
      </div>
    {/if}
  </div>

  <Footer />
</div>
