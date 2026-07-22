<script lang="ts">
  import ReportCtaButton from './ReportCtaButton.svelte'

  interface Props {
    onUnlock: () => void
    onClose: () => void
  }

  let { onUnlock, onClose }: Props = $props()
</script>

<div
  class="fixed inset-0 z-[75] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
  onclick={onClose}
  role="presentation"
>
  <div
    class="w-full max-w-[340px] rounded-2xl border border-[#E1306C]/15 bg-white p-6 text-center shadow-2xl"
    onclick={(e) => e.stopPropagation()}
    role="presentation"
  >
    <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b">
        <path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6z" />
      </svg>
    </div>
    <h3 class="mb-1 text-base font-bold text-slate-950">Áudio criptografado</h3>
    <p class="mb-1 text-[12px] leading-relaxed text-slate-500">
      Libere o relatório completo para ouvir a gravação completa desse áudio.
    </p>
    <p class="mb-4 text-[12px] text-slate-500">
      Desbloqueio único por apenas <strong class="text-[15px] text-slate-950">R$ 48,90</strong>.
    </p>
    <ReportCtaButton variant="green" icon="🔓" onclick={onUnlock}>
      LIBERAR RELATÓRIO COMPLETO
    </ReportCtaButton>
    <button type="button" onclick={onClose} class="mt-3 text-[11px] text-slate-500 hover:text-slate-300">
      Fechar
    </button>
  </div>
</div>
