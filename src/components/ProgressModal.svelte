<script lang="ts">
  interface Props {
    username: string
    onComplete?: () => void
  }

  let { username, onComplete }: Props = $props()

  const STEP_DURATION_MS = 1200
  const STEP_INTERVAL_MS = 16
  const STEP_INCREMENT = 100 / (STEP_DURATION_MS / STEP_INTERVAL_MS)

  let currentStep = $state(0)
  let stepProgress = $state(0)
  let completed = $state(false)

  const steps = $derived(
    [
      'Conectando ao Insta',
      `Encontrando @${username}`,
      'Carregando informações',
      'Finalizando',
    ].map((label, index) => {
      if (index < currentStep || currentStep >= 4) {
        return { label, status: 'done' as const }
      }
      if (index === currentStep) {
        return { label, status: 'active' as const }
      }
      return { label, status: 'pending' as const }
    })
  )

  $effect(() => {
    if (completed) return

    const interval = setInterval(() => {
      stepProgress += STEP_INCREMENT

      if (stepProgress >= 100) {
        currentStep += 1
        stepProgress = 0
      }
    }, STEP_INTERVAL_MS)

    return () => clearInterval(interval)
  })

  $effect(() => {
    if (currentStep >= steps.length && !completed) {
      completed = true
      onComplete?.()
    }
  })
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
  <div class="w-full max-w-[360px] animate-fadeInUp rounded-3xl bg-white p-6 shadow-2xl">
    <div class="mb-5 flex items-center gap-2">
      <span class="h-2 w-2 animate-pulse rounded-full bg-spy-rose"></span>
      <h2 class="text-base font-bold text-slate-950">Acessando perfil</h2>
    </div>

    <div class="space-y-4">
      {#each steps as step}
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              {#if step.status === 'done'}
                <svg
                  class="h-4 w-4 text-emerald-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              {:else if step.status === 'active'}
                <svg
                  class="h-4 w-4 animate-spin text-spy-rose"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              {:else}
                <span class="h-4 w-4 rounded-full border-2 border-slate-200"></span>
              {/if}
              <span
                class={step.status === 'done'
                  ? 'text-slate-500'
                  : step.status === 'active'
                    ? 'font-semibold text-slate-950'
                    : 'text-slate-400'}
              >
                {step.label}
              </span>
            </div>

            {#if step.status === 'done'}
              <span class="text-xs font-bold text-emerald-500">100%</span>
            {:else if step.status === 'active'}
              <span class="text-xs font-bold text-spy-rose">{Math.floor(stepProgress)}%</span>
            {:else}
              <span class="text-xs font-bold text-slate-300">0%</span>
            {/if}
          </div>

          <div class="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full transition-all duration-300 {step.status === 'done'
                ? 'bg-emerald-500'
                : step.status === 'active'
                  ? 'spy-gradient'
                  : 'bg-transparent'}"
              style="width: {step.status === 'done'
                ? 100
                : step.status === 'active'
                  ? Math.min(stepProgress, 100)
                  : 0}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
