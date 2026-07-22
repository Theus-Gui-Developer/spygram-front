<script lang="ts">
  import ReportCtaButton from './ReportCtaButton.svelte'

  interface ChatMessage {
    from: 'sent' | 'received'
    type: 'text' | 'audio' | 'location'
    text?: string
    duration?: string
    time?: string
  }

  export interface ReportChat {
    avatar: string
    blurHandle: string
    script: ChatMessage[]
  }

  interface Props {
    chat: ReportChat
    onUnlock: () => void
    onClose: () => void
  }

  let { chat, onUnlock, onClose }: Props = $props()
</script>

<div
  class="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3"
  onclick={onClose}
  role="presentation"
>
  <div
    class="w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#0f1013]"
    onclick={(e) => e.stopPropagation()}
    role="presentation"
  >
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-[#833AB4]/40 to-[#E1306C]/30 p-3">
      <img
        src={chat.avatar}
        alt=""
        class="h-9 w-9 rounded-full object-cover"
        style="filter: blur(6px); user-select: none; pointer-events: none;"
        draggable="false"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline text-[13px] font-semibold text-white">
          <span>@</span><span class="username-blur" aria-hidden="true">{chat.blurHandle}</span>
        </div>
        <div class="text-[10px] text-emerald-300">visto há 2 min</div>
      </div>
      <button
        type="button"
        onclick={onClose}
        class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg leading-none text-white"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>

    <!-- Messages -->
    <div class="flex max-h-[50vh] flex-col gap-1.5 overflow-y-auto bg-[#0a0a0d] p-3">
      {#each chat.script as msg}
        {@const sent = msg.from === 'sent'}
        {@const bubble = sent
          ? 'bg-gradient-to-br from-[#3797f0] to-[#0095f6] text-white rounded-br-md'
          : 'bg-[#262628] text-white rounded-bl-md'}

        {#if msg.type === 'audio'}
          <div class="flex {sent ? 'justify-end' : 'justify-start'}">
            <div class="{bubble} max-w-[85%] min-w-[220px] rounded-2xl px-3 py-2">
              <div class="flex items-center">
                <div class="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-gray-900">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div class="flex h-4 flex-1 items-center space-x-1">
                  {#each Array(14) as _, i}
                    <span class="w-0.5 rounded-full bg-white/80" style="height: {5 + (i % 4) * 4}px"></span>
                  {/each}
                </div>
                <span class="ml-3 shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] tabular-nums text-white/90">
                  {msg.duration}
                </span>
              </div>
              {#if msg.time}
                <div class="mt-1 text-right text-[9px] opacity-70">{msg.time}</div>
              {/if}
            </div>
          </div>
        {:else if msg.type === 'location'}
          <div class="flex {sent ? 'justify-end' : 'justify-start'}">
            <div class="relative w-56 max-w-[85%] overflow-hidden rounded-2xl border border-red-500/40 bg-[#1a1a1f] p-3">
              <div class="flex flex-col items-center text-center">
                <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                </div>
                <span class="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">Alerta de Local</span>
                <span class="text-xs text-white">Localização compartilhada</span>
              </div>
              <div class="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[1.5px]">
                <div class="flex flex-col items-center gap-1">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/70">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                      <path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6z" />
                    </svg>
                  </div>
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-white">Conteúdo bloqueado</span>
                </div>
              </div>
              {#if msg.time}
                <div class="relative mt-2 text-right text-[9px] text-slate-500">{msg.time}</div>
              {/if}
            </div>
          </div>
        {:else}
          <div class="flex {sent ? 'justify-end' : 'justify-start'}">
            <div class="{bubble} max-w-[80%] rounded-2xl px-3 py-1.5 text-[13px]">
              <div>{msg.text}</div>
              {#if msg.time}
                <div class="mt-0.5 text-right text-[9px] opacity-70">{msg.time}</div>
              {/if}
            </div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Footer -->
    <div class="border-t border-white/10 bg-[#0f1013] p-3">
      <div class="mb-2 text-center text-[11px] text-slate-400">
        Desbloqueie o acesso para visualizar a conversa completa.
      </div>
      <ReportCtaButton icon="🔒" onclick={onUnlock}>DESBLOQUEAR CONVERSAS COMPLETAS</ReportCtaButton>
    </div>
  </div>
</div>
