<script lang="ts">
  import { fade } from 'svelte/transition'
  import Pre from './routes/Pre.svelte'
  import Username from './routes/Username.svelte'
  import Analise from './routes/Analise.svelte'
  import VSL from './routes/VSL.svelte'
  import BackVSL from './routes/BackVSL.svelte'
  import BackPre from './routes/BackPre.svelte'
  import BackCheckout from './routes/BackCheckout.svelte'
  import RelatorioPreview from './routes/RelatorioPreview.svelte'
  import AcessandoInstagram from './routes/AcessandoInstagram.svelte'
  import InstaView from './routes/InstaView.svelte'
  import Terms from './routes/Terms.svelte'
  import Privacy from './routes/Privacy.svelte'
  import AnimatedBackground from './components/AnimatedBackground.svelte'

  /**
   * Estrutura de rotas espelhando a referência (lá: history routing com basename /v4;
   * aqui: hash routing para funcionar em qualquer path do servidor sem rewrite).
   *
   * Referência → aqui:
   *   /pre                  → #/pre
   *   /inicio               → #/inicio (input de @)
   *   /vsl                  → #/vsl
   *   /relatorio            → #/relatorio
   *   /acessando-instagram  → #/acessando-instagram
   *   /InstaView            → #/InstaView
   *   /back/pre             → #/back/pre
   *   /back/vsl             → #/back/vsl
   *   /back/checkout        → #/back/checkout
   *   /termos-de-uso        → #/termos-de-uso
   *   /politica-privacidade → #/politica-privacidade
   *   /home                 → redirect #/inicio
   *   /login, /recovery     → redirect #/vsl
   */
  type Route =
    | 'pre'
    | 'inicio'
    | 'analise'
    | 'vsl'
    | 'relatorio'
    | 'acessando-instagram'
    | 'InstaView'
    | 'back/pre'
    | 'back/vsl'
    | 'back/checkout'
    | 'termos-de-uso'
    | 'politica-privacidade'

  const redirects: Record<string, string> = {
    home: '#/inicio',
    login: '#/vsl',
    recovery: '#/vsl',
    // aliases antigos (links já distribuídos não quebram)
    usuario: '#/inicio',
    'relatorio-preview': '#/relatorio',
    back: '#/back/vsl',
  }

  function parseRoute(): { route: Route; query: string } {
    const raw = window.location.hash.replace(/^#\/?/, '')
    const [path, query = ''] = raw.split('?')
    const normalized = path || 'pre'

    const validRoutes: Route[] = [
      'pre',
      'inicio',
      'analise',
      'vsl',
      'relatorio',
      'acessando-instagram',
      'InstaView',
      'back/pre',
      'back/vsl',
      'back/checkout',
      'termos-de-uso',
      'politica-privacidade',
    ]

    return {
      route: validRoutes.includes(normalized as Route) ? (normalized as Route) : 'pre',
      query,
    }
  }

  let route = $state(parseRoute().route)
  let backRedirectSet = $state(false)

  function syncRoute() {
    const raw = window.location.hash.replace(/^#\/?/, '')
    const [path] = raw.split('?')
    const target = redirects[path]
    if (target) {
      const query = raw.split('?')[1]
      window.location.replace(`${target}${query ? '?' + query : ''}`)
      return
    }
    route = parseRoute().route
  }

  // Back redirect: quando entra na VSL, empurra um estado extra no history
  // para que o botão voltar vá para /back/vsl em vez de sair do funil.
  $effect(() => {
    if (route === 'vsl' && !backRedirectSet) {
      backRedirectSet = true
      window.history.pushState({ backRedirect: true }, '', window.location.href)
    }
  })

  function handlePopState(event: PopStateEvent) {
    if (event.state?.backRedirect && route === 'vsl') {
      event.preventDefault()
      const params = parseRoute().query
      window.location.hash = `#/back/vsl${params ? '?' + params : ''}`
    }
  }
</script>

<svelte:window onhashchange={syncRoute} onpopstate={handlePopState} />

<AnimatedBackground />

{#key route}
  <div in:fade={{ duration: 220, delay: 60 }} class="relative z-10">
    {#if route === 'pre'}
      <Pre />
    {:else if route === 'inicio'}
      <Username />
    {:else if route === 'analise'}
      <Analise />
    {:else if route === 'vsl'}
      <VSL />
    {:else if route === 'relatorio'}
      <RelatorioPreview />
    {:else if route === 'acessando-instagram'}
      <AcessandoInstagram />
    {:else if route === 'InstaView'}
      <InstaView />
    {:else if route === 'back/pre'}
      <BackPre />
    {:else if route === 'back/vsl'}
      <BackVSL />
    {:else if route === 'back/checkout'}
      <BackCheckout />
    {:else if route === 'termos-de-uso'}
      <Terms />
    {:else if route === 'politica-privacidade'}
      <Privacy />
    {:else}
      <Pre />
    {/if}
  </div>
{/key}
