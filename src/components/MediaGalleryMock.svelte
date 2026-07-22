<script lang="ts">
  const images = [
    { id: 1, color: 'bg-rose-200' },
    { id: 2, color: 'bg-orange-200' },
    { id: 3, color: 'bg-purple-200' },
    { id: 4, color: 'bg-pink-200' },
    { id: 5, color: 'bg-amber-200' },
    { id: 6, color: 'bg-violet-200' },
  ]
</script>

<div class="bg-[#141418] border border-white/10 rounded-xl p-4">
  <div class="text-sm font-bold text-white mb-1">Fotos e vídeos privados</div>
  <p class="text-[12px] text-slate-400 mb-3">
    <span class="text-red-400 font-semibold">6 mídias</span> enviadas em conversas privadas foram detectadas. Todas estão bloqueadas.
  </p>

  <div class="grid grid-cols-3 gap-2 mb-3">
    {#each images as img}
      <div class="relative aspect-square rounded-lg overflow-hidden {img.color} animate-pulse">
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span class="text-[9px] text-white font-semibold uppercase mt-1">Bloqueado</span>
        </div>
      </div>
    {/each}
  </div>

  <button type="button" class="w-full rounded-xl spy-gradient text-white font-black uppercase text-[12px] tracking-wide py-3 shadow-lg hover:shadow-xl transition-shadow">
    Ver fotos suspeitas
  </button>
</div>
