<script lang="ts">
  import { onMount } from 'svelte'

  interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => void
  }

  let { open = false, onClose, onConfirm }: Props = $props()

  let visible = $state(false)
  let hasTriggered = $state(false)

  $effect.pre(() => {
    visible = open
  })

  onMount(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const handleMouseLeave = (event: MouseEvent) => {
      if (hasTriggered) return
      if (event.clientY <= 0) {
        hasTriggered = true
        visible = true
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  })
</script>

{#if visible}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
    <div class="w-full max-w-[380px] rounded-3xl bg-[#141418] border border-white/10 p-6 shadow-2xl animate-fadeInScale">
      <h2 class="text-center text-lg font-bold text-white mb-3">
        Espere!
      </h2>

      <p class="text-[13px] text-slate-300 text-center leading-relaxed mb-6">
        Não perca as evidências encontradas. Libere o relatório completo com 50% de desconto.
      </p>

      <div class="space-y-3">
        <button
          type="button"
          onclick={onConfirm}
          class="w-full min-h-[52px] rounded-2xl bg-emerald-500 px-5 font-bold text-[15px] text-white shadow-[0_12px_28px_rgba(16,185,129,0.28)] transition-all hover:bg-emerald-400 hover:shadow-[0_16px_34px_rgba(16,185,129,0.36)] active:scale-[0.98]"
        >
          LIBERAR AGORA
        </button>

        <button
          type="button"
          onclick={onClose}
          class="w-full min-h-[52px] rounded-2xl border border-white/10 bg-transparent font-bold text-[15px] text-white/70 transition-colors hover:bg-white/5"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
{/if}
