<script lang="ts">
  import { onMount } from 'svelte'
  import type { NotificationItem } from '../lib/notifications'

  interface Props {
    items: NotificationItem[]
  }

  let { items }: Props = $props()

  let visible = $state<NotificationItem[]>([])
  const hideTimers = new Map<string, ReturnType<typeof setTimeout>>()

  function dismiss(id: string) {
    const timer = hideTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      hideTimers.delete(id)
    }
    visible = visible.filter((item) => item.id !== id)
  }

  onMount(() => {
    if (!items.length) return

    let elapsed = 0
    const showTimers: ReturnType<typeof setTimeout>[] = []

    items.forEach((item) => {
      elapsed += item.delayMs

      const showTimer = setTimeout(() => {
        visible = [...visible, item]

        const hideTimer = setTimeout(() => dismiss(item.id), 5_000)
        hideTimers.set(item.id, hideTimer)
      }, elapsed)

      showTimers.push(showTimer)
    })

    return () => {
      showTimers.forEach(clearTimeout)
      hideTimers.forEach(clearTimeout)
    }
  })
</script>

{#if visible.length > 0}
  <div
    class="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3 p-4 pointer-events-none"
    role="region"
    aria-label="Notificações"
  >
    {#each visible as item (item.id)}
      <div
        class="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-spy-border bg-white/95 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm animate-fadeInUp"
        role="status"
        aria-live="polite"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-spy-pink/10 text-spy-rose"
          aria-hidden="true"
        >
          {#if item.type === 'image'}
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
          {:else if item.type === 'chat'}
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          {:else if item.type === 'location'}
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
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          {:else if item.type === 'audio'}
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
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          {/if}
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-spy-rose">
            {item.title}
          </p>
          <p class="mt-0.5 text-[12px] leading-relaxed text-slate-500">
            {item.description}
          </p>
        </div>

        <button
          type="button"
          onclick={() => dismiss(item.id)}
          class="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
      </div>
    {/each}
  </div>
{/if}
