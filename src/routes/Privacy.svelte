<script lang="ts">
  import Logo from '../components/Logo.svelte'
  import Footer from '../components/Footer.svelte'

  const lastUpdated = '08 de julho de 2026'
</script>

<div class="page-shell">
  <div class="page-card text-left">
    <div class="flex justify-center mb-5">
      <Logo />
    </div>

    <h1 class="text-2xl font-bold text-slate-950">Política de Privacidade</h1>
    <p class="text-xs text-spy-muted mt-1">Última atualização: {lastUpdated}</p>

    <div class="mt-6 space-y-5 text-sm text-slate-600 leading-relaxed">
      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">1. Coleta de Informações</h2>
        <p>
          Coletamos apenas as informações necessárias para o funcionamento do serviço, como o nome de usuário inserido para análise, dados de navegação e informações de pagamento, quando aplicável.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">2. Uso das Informações</h2>
        <p>
          As informações são utilizadas exclusivamente para processar sua análise, gerar relatórios, melhorar nossos serviços e comunicar atualizações relevantes. Não vendemos seus dados para terceiros.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">3. Armazenamento e Segurança</h2>
        <p>
          Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados, perda ou vazamento. Os relatórios gerados são de acesso restrito e vinculados à sua sessão.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">4. Compartilhamento</h2>
        <p>
          Podemos compartilhar dados apenas com prestadores de serviço essenciais (processamento de pagamento, hospedagem, análise de tráfego), sempre sob contratos de confidencialidade e em conformidade com a LGPD.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">5. Cookies e Tecnologias Semelhantes</h2>
        <p>
          Utilizamos cookies para melhorar a experiência de navegação, personalizar conteúdo e entender como nossos visitantes interagem com o site. Você pode desativar cookies nas configurações do navegador.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">6. Seus Direitos</h2>
        <p>
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados pessoais a qualquer momento, entrando em contato com nosso suporte.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">7. Alterações nesta Política</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Recomendamos que você a revise com frequência para se manter informado sobre como protegemos suas informações.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">8. Contato</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, utilize o canal de suporte disponível na plataforma.
        </p>
      </section>
    </div>
  </div>

  <Footer />
</div>
