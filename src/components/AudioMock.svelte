<script lang="ts">
  const audios = [
    { duration: '0:47', time: '14:22' },
    { duration: '0:32', time: '14:45' },
    { duration: '0:18', time: '15:01' },
    { duration: '0:55', time: '15:20' },
  ]
</script>

<div class="bg-[#141418] border border-white/10 rounded-xl p-4">
  <div class="text-sm font-bold text-white mb-1">Áudios do Direct</div>
  <p class="text-[12px] text-slate-400 mb-3">
    <span class="text-red-400 font-semibold">4 áudios comprometedores</span> encontrados. Toque para ouvir a prévia.
  </p>

  <div class="space-y-2 bg-[#1a1a22] rounded-xl p-3 border border-white/5">
    {#each audios as audio, i}
      <button type="button" class="w-full flex items-center gap-3 group">
        <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </span>
        <div class="flex-1">
          <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div class="h-full w-1/3 rounded-full bg-spy-rose"></div>
          </div>
        </div>
        <span class="text-[10px] text-slate-400">{audio.duration}</span>
      </button>
      <div class="text-[9px] text-slate-500 text-right">{audio.time}</div>
    {/each}
  </div>

  <button type="button" class="w-full mt-3 rounded-xl bg-white text-spy-rose font-black uppercase text-[12px] tracking-wide py-3 hover:bg-slate-100 transition-colors">
    Ouvir áudios completos
  </button>
</div>
