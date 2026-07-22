<script lang="ts">
  interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => void
  }

  let { open, onClose, onConfirm }: Props = $props()
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
    <div class="w-full max-w-[380px] rounded-3xl bg-[#141418] border border-white/10 p-6 shadow-2xl animate-fadeInScale">
      <h2 class="text-center text-lg font-bold text-white mb-3">
        ⏰ Acesso expirado
      </h2>

      <p class="text-[13px] text-slate-300 text-center leading-relaxed mb-6">
        O acesso ao relatório prévio expirou. Libere agora para garantir o acesso vitalício.
      </p>

      <div class="space-y-3">
        <button
          type="button"
          onclick={onConfirm}
          class="w-full min-h-[52px] rounded-2xl bg-emerald-500 px-5 font-bold text-[15px] text-white shadow-[0_12px_28px_rgba(16,185,129,0.28)] transition-all hover:bg-emerald-400 hover:shadow-[0_16px_34px_rgba(16,185,129,0.36)] active:scale-[0.98]"
        >
          DESBLOQUEAR AGORA — R$ 48,90
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
