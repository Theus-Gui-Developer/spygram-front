<script lang="ts">
  interface Message {
    from: 'sent' | 'received'
    text?: string
    time: string
    blocked?: boolean
  }

  const messages: Message[] = [
    { from: 'received', text: 'Oi, sumido(a)', time: '14:20' },
    { from: 'sent', text: 'Oi! Desculpa, correria', time: '14:22' },
    { from: 'received', text: 'Saudade...', time: '14:23' },
    { from: 'sent', text: 'Também tô com saudade', time: '14:25', blocked: true },
    { from: 'received', text: 'Conteúdo bloqueado', time: '14:28', blocked: true },
    { from: 'sent', text: 'Imagem bloqueada', time: '14:30', blocked: true },
    { from: 'received', text: 'Esta mensagem foi apagada', time: '14:35', blocked: true },
  ]
</script>

<div class="bg-[#141418] border border-white/10 rounded-xl p-4">
  <div class="text-sm font-bold text-white mb-1">Análise de Conversas do Direct</div>
  <p class="text-[12px] text-slate-400 mb-3">
    <span class="text-red-400 font-semibold">7 conversas suspeitas</span> foram encontradas. O sistema recuperou
    <span class="text-amber-600 font-bold">mensagens apagadas</span>.
  </p>

  <div class="space-y-2 max-h-[280px] overflow-y-auto pr-1">
    {#each messages as msg}
      <div class="flex {msg.from === 'sent' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[80%] rounded-2xl px-3.5 py-2 text-[12px] leading-snug {msg.from === 'sent' ? 'bg-gradient-to-br from-spy-pink to-spy-purple text-white rounded-br-md' : 'bg-[#1a1a22] text-slate-200 rounded-bl-md border border-white/5'}">
          {#if msg.blocked}
            <div class="flex items-center gap-1.5 text-white/70">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{msg.text}</span>
            </div>
          {:else}
            {msg.text}
          {/if}
          <div class="text-[9px] opacity-60 mt-1 text-right">{msg.time}</div>
        </div>
      </div>
    {/each}
  </div>

  <button type="button" class="w-full mt-3 rounded-xl bg-white text-spy-rose font-black uppercase text-[12px] tracking-wide py-3 hover:bg-slate-100 transition-colors">
    Ler conversas completas
  </button>
</div>
