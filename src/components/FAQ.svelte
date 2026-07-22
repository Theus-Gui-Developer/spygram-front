<script lang="ts">
  interface Item {
    question: string
    answer: string
  }

  const items: Item[] = [
    {
      question: 'Como descubro o @ certo da pessoa?',
      answer: `1. Abra o app do Insta e vá no perfil dela.<br>
2. Toque no nome grande no topo do perfil.<br>
3. Cuidado: o nome que aparece embaixo da foto é o nome completo da pessoa (ex: "Maria Silva"), NÃO é o @.<br>
4. Memorize o @ certinho (ele pode ter ponto, número ou outros símbolos).<br><br>
Obs: o Insta não deixa copiar e colar o @, você precisa digitar igualzinho ao que aparece no perfil.`,
    },
    {
      question: 'Por que é melhor sair do navegador do Insta?',
      answer: `Aqui você está vendo essa página dentro do app do Insta. Pra confirmar o @ certo da pessoa, você teria que sair daqui, ir no perfil dela, voltar... e às vezes essa página fecha no caminho.<br><br>
No navegador padrão do celular (Chrome ou Safari) é mais fácil: você troca rapidinho entre o Insta e essa página sem perder nada. Use o botão amarelo acima pra abrir lá.`,
    },
    {
      question: 'Estou no Insta, como abro em outro navegador?',
      answer: `O botão amarelo "Abrir em outro navegador" nesta tela faz isso pra você sem perder o progresso.<br><br>
Se não funcionar, dá pra fazer manualmente:<br>
• Android: toque nos 3 pontinhos no topo direito da tela → "Abrir no navegador"<br>
• iPhone: toque nos 3 pontinhos no topo direito da tela → "Abrir no navegador externo"`,
    },
    {
      question: 'Tenho que digitar o @ certinho mesmo?',
      answer: `Sim. Qualquer letra trocada cai num perfil diferente. Por exemplo, se a pessoa que você quer ver é "maria.silva" e você digitar "mariasilva" sem o ponto, vai cair num perfil errado.<br><br>
Por isso, antes de clicar Continuar, confere o @ direto no Insta pra ter certeza.`,
    },
    {
      question: 'Posso fechar e voltar depois?',
      answer: `Sim. Abrindo o mesmo link no mesmo navegador, seu progresso volta. Se você precisar mudar de navegador, use o botão amarelo "Abrir em outro navegador" — ele preserva tudo (gênero do alvo, etapas que você já fez).`,
    },
  ]

  let openIndex = $state<number | null>(1)

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index
  }
</script>

<div class="w-full">
  <h3 class="text-base font-bold text-slate-950 mb-3">Precisa de ajuda? 🙋</h3>
  <div class="space-y-2.5">
    {#each items as item, i}
      <div class="rounded-xl bg-white border border-slate-100 overflow-hidden transition-all {openIndex === i ? 'shadow-sm' : ''}">
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-3.5 text-left"
          onclick={() => toggle(i)}
          aria-expanded={openIndex === i}
        >
          <span class="text-sm font-semibold text-slate-900 pr-4">{item.question}</span>
          <span class="text-spy-rose text-xl font-light leading-none shrink-0">
            {openIndex === i ? '×' : '+'}
          </span>
        </button>
        {#if openIndex === i}
          <div class="px-4 pb-4 text-[13px] text-slate-600 leading-relaxed animate-fadeInUp">
            {@html item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
