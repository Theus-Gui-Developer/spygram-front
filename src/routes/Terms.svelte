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

    <h1 class="text-2xl font-bold text-slate-950">Termos de Uso</h1>
    <p class="text-xs text-spy-muted mt-1">Última atualização: {lastUpdated}</p>

    <div class="mt-6 space-y-5 text-sm text-slate-600 leading-relaxed">
      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e utilizar este site, você concorda integralmente com estes Termos de Uso. Se não concordar com qualquer parte destes termos, recomendamos que não utilize nossos serviços.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">2. Descrição do Serviço</h2>
        <p>
          A SpyGram oferece uma ferramenta de análise de dados públicos e comportamentais para fins de consulta pessoal. O serviço é destinado exclusivamente a maiores de 18 anos e deve ser utilizado de forma consciente e dentro da legalidade.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">3. Uso Permitido</h2>
        <p>
          O usuário se compromete a utilizar a plataforma apenas para consultas em perfis e contas de sua própria titularidade ou com autorização expressa do titular. É expressamente proibido o uso para fins de perseguição, assédio, extorsão, invasão de privacidade ou qualquer atividade ilegal.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">4. Responsabilidades do Usuário</h2>
        <p>
          Você é o único responsável pelas informações inseridas na plataforma e pelas ações tomadas a partir dos relatórios gerados. A SpyGram não se responsabiliza pelo uso indevido dos dados apresentados.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">5. Limitação de Responsabilidade</h2>
        <p>
          Os relatórios são gerados com base em dados disponíveis publicamente e algoritmos internos. Não garantimos a precisão absoluta, disponibilidade ininterrupta ou resultados específicos. O serviço é fornecido "como está".
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">6. Pagamentos e Reembolso</h2>
        <p>
          Os valores e condições de pagamento são apresentados antes da conclusão da compra. Oferecemos garantia de reembolso dentro do prazo legal, conforme a legislação brasileira de proteção ao consumidor.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">7. Alterações nos Termos</h2>
        <p>
          Podemos atualizar estes Termos de Uso a qualquer momento. A continuidade do uso do site após alterações implica na aceitação dos novos termos.
        </p>
      </section>

      <section>
        <h2 class="text-base font-bold text-slate-950 mb-2">8. Contato</h2>
        <p>
          Em caso de dúvidas sobre estes termos, entre em contato pelo canal de suporte disponível na plataforma.
        </p>
      </section>
    </div>
  </div>

  <Footer />
</div>
