<script lang="ts">
  interface Props {
    username: string
    onAction?: () => void
  }

  let { username, onAction }: Props = $props()

  function handleClick() {
    onAction?.()
  }
</script>

<div
  class="w-full rounded-2xl border border-spy-border bg-white/95 p-5 shadow-sm backdrop-blur-sm dark:bg-slate-900/95 dark:border-slate-700/50"
  role="alert"
  aria-live="polite"
>
  <div class="mb-4 flex items-center gap-2.5">
    <span class="relative flex h-3 w-3">
      <span
        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-spy-pink/75"
        aria-hidden="true"
      ></span>
      <span
        class="relative inline-flex h-3 w-3 rounded-full bg-spy-rose"
        aria-hidden="true"
      ></span>
    </span>
    <h2 class="text-sm font-extrabold uppercase tracking-wide text-spy-rose">
      CONTEÚDO SUSPEITO IDENTIFICADO
    </h2>
  </div>

  <p class="mb-5 text-[13px] leading-relaxed text-slate-700 dark:text-slate-200">
    A análise de <span class="font-semibold text-slate-900 dark:text-white">@{username}</span> foi
    concluída. Foram encontradas conversas, fotos e localizações suspeitas que exigem sua atenção
    imediata.
  </p>

  <button
    type="button"
    onclick={handleClick}
    class="spy-gradient group flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl px-5 py-3.5 text-white shadow-[0_12px_28px_rgba(255,0,105,0.28)] transition-all duration-200 active:scale-[0.98]"
  >
    <span class="flex items-center gap-2 text-[15px] font-bold">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="transition-transform duration-200 group-hover:scale-110"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      CLIQUE AQUI PARA VER TUDO
    </span>
    <span class="text-[11px] font-medium text-white/90">
      Acesse todo o conteúdo monitorado de @{username}
    </span>
  </button>
</div>
