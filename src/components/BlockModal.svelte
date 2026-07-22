<script lang="ts">
  import GradientButton from './GradientButton.svelte'

  interface Props {
    open: boolean
    title: string
    description: string
    price: string
    onClose: () => void
    onConfirm: () => void
  }

  let { open, title, description, price, onClose, onConfirm }: Props = $props()
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="w-full max-w-[360px] rounded-3xl bg-[#141418] border border-white/10 p-6 shadow-2xl animate-fadeInScale">
      <div class="flex items-center justify-center gap-2 mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-spy-rose">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h2 class="text-base font-bold text-white">{title}</h2>
      </div>

      <p class="text-[13px] text-slate-300 text-center leading-relaxed mb-4">
        {description}
      </p>

      <div class="text-center mb-5">
        <span class="text-[12px] text-slate-400 uppercase tracking-wide">Acesso vitalício por</span>
        <div class="text-3xl font-black text-white mt-1">{price}</div>
      </div>

      <div class="space-y-3">
        <GradientButton onclick={onConfirm} class="bg-gradient-to-r from-emerald-500 to-emerald-400 !shadow-[0_12px_28px_rgba(16,185,129,0.28)]">
          LIBERAR RELATÓRIO COMPLETO
        </GradientButton>

        <button
          type="button"
          onclick={onClose}
          class="w-full min-h-[52px] rounded-2xl border border-white/10 bg-transparent text-white/70 font-bold text-[15px] hover:bg-white/5 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
{/if}
