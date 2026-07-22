<script lang="ts">
  interface Props {
    title?: string
    description?: string
    username?: string
    onClose?: () => void
  }

  let {
    title = 'Imagem suspeita encontrada',
    description = 'Encontramos uma imagem que pode conter evidências importantes.',
    username = '',
    onClose,
  }: Props = $props()

  function handleClose() {
    onClose?.()
  }
</script>

<div
  class="flex w-full max-w-sm items-start gap-3 rounded-xl border border-spy-border bg-white/95 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-slate-900/95 dark:border-slate-700/50"
  role="status"
  aria-live="polite"
>
  <div
    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-spy-pink/10 text-spy-rose"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  </div>

  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold text-slate-900 dark:text-white">
      {title}
      {#if username}
        <span class="font-medium text-slate-500 dark:text-slate-400">de @{username}</span>
      {/if}
    </p>
    <p class="mt-0.5 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
      {description}
    </p>
  </div>

  {#if onClose}
    <button
      type="button"
      onclick={handleClose}
      class="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      aria-label="Fechar notificação"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  {/if}
</div>
