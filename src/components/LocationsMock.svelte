<script lang="ts">
  const locations = [
    { name: 'Motel Central', freq: '3 visitas' },
    { name: 'Casa de Massagem', freq: '2 visitas' },
    { name: 'Bairro Jardins', freq: '5 visitas' },
  ]
</script>

<div class="bg-[#141418] border border-white/10 rounded-xl p-4">
  <div class="text-sm font-bold text-white mb-1">Localizações suspeitas</div>
  <p class="text-[12px] text-slate-400 mb-3">
    <span class="text-red-400 font-semibold">{locations.length} localizações</span> detectadas nos últimos 14 dias.
  </p>

  <div class="space-y-2 mb-3">
    {#each locations as loc}
      <div class="flex items-center gap-3 bg-[#1a1a22] rounded-lg p-3 border border-white/5">
        <div class="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-white truncate">{loc.name}</div>
          <div class="text-[10px] text-slate-400">{loc.freq} nos últimos 30 dias</div>
        </div>
        <span class="text-[10px] font-bold text-red-400 shrink-0">Suspeito</span>
      </div>
    {/each}
  </div>

  <button type="button" class="w-full rounded-xl bg-white text-spy-rose font-black uppercase text-[12px] tracking-wide py-3 hover:bg-slate-100 transition-colors">
    Ver localizações suspeitas
  </button>
</div>
