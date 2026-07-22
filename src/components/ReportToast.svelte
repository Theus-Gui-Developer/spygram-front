<script lang="ts">
  import { onMount } from 'svelte'

  const messages = [
    'Mais <strong>3 arquivos ocultos</strong> acabaram de ser descriptografados...',
    'Nova <strong>localização suspeita</strong> encontrada nos registros...',
    '<strong>2 áudios apagados</strong> foram recuperados com sucesso...',
    'Análise detectou <strong>5 novas mensagens</strong> com palavras-chave suspeitas...',
    '<strong>Imagens apagadas</strong> estão sendo restauradas pelo sistema...',
    'Encontramos <strong>1 novo contato</strong> com interações frequentes...',
    'Mais <strong>4 fotos</strong> foram encontradas no arquivo de stories...',
    'Detectamos <strong>mensagens do Direct</strong> excluídas recentemente...',
  ]

  let visible = $state(false)
  let html = $state('')

  onMount(() => {
    let index = 0
    let hideTimer: ReturnType<typeof setTimeout> | null = null

    const show = () => {
      html = messages[index % messages.length]
      index += 1
      visible = true
      hideTimer = setTimeout(() => (visible = false), 4000)
    }

    const first = setTimeout(show, 8000)
    const interval = setInterval(show, 14000)

    return () => {
      clearTimeout(first)
      clearInterval(interval)
      if (hideTimer) clearTimeout(hideTimer)
    }
  })
</script>

<div
  class="fixed top-[48px] left-1/2 z-[60] w-[90%] max-w-[340px] -translate-x-1/2 rounded-[10px] border-l-4 border-[#E1306C] bg-white px-4 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex items-center gap-3 transition-all duration-300 {visible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-4 pointer-events-none'}"
>
  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  </div>
  <div class="text-[12px] font-medium leading-snug text-slate-900">
    {@html html}
  </div>
</div>
