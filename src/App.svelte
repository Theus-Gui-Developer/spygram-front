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
  import { getSearchCache, getCachedEntryUrl, TRACKED_SEARCH_ROUTES, saveSearchCache } from './lib/search-cache'
  import { hydrateSearchStore } from './lib/search-store.svelte'

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

  /**
   * Back redirect por etapa, espelhando a referência:
   * - antes do relatório (input / análise / vsl): voltar cai em /back/pre
   * - a partir do relatório: voltar cai em /back/vsl
   */
  const BACK_REDIRECT_PRE_ROUTES: Route[] = ['inicio', 'analise', 'vsl']
  const BACK_REDIRECT_VSL_ROUTES: Route[] = ['relatorio', 'acessando-instagram', 'InstaView']

  hydrateSearchStore()

  function currentUsernameFromHash(): string | null {
    return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('usuario')
  }

  function enforceSearchCache() {
    const cache = getSearchCache()
    if (!cache) return

    const currentUsername = currentUsernameFromHash()

    if (route === 'pre' || route === 'inicio') {
      window.location.replace(getCachedEntryUrl(cache))
      return
    }

    if (
      (TRACKED_SEARCH_ROUTES as readonly string[]).includes(route) &&
      currentUsername &&
      currentUsername !== cache.username
    ) {
      window.location.replace(getCachedEntryUrl(cache))
      return
    }

    if (
      (TRACKED_SEARCH_ROUTES as readonly string[]).includes(route) &&
      currentUsername === cache.username &&
      cache.lastRoute !== route
    ) {
      saveSearchCache({ ...cache, lastRoute: route })
    }
  }

  const initialRoute = parseRoute()
  if (typeof window !== 'undefined') {
    const cache = getSearchCache()
    if (cache) {
      if (initialRoute.route === 'pre' || initialRoute.route === 'inicio') {
        window.location.replace(getCachedEntryUrl(cache))
      } else if (
        (TRACKED_SEARCH_ROUTES as readonly string[]).includes(initialRoute.route) &&
        new URLSearchParams(initialRoute.query).get('usuario') !== cache.username
      ) {
        window.location.replace(getCachedEntryUrl(cache))
      }
    }
  }

  let route = $state(parseRoute().route)
  let backRedirectMarked = $state<Set<string>>(new Set())

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
    enforceSearchCache()
  }

  // Back redirect: rotas do funil que, ao pressionar voltar, devem cair em
  // /back/pre (antes do relatório) ou /back/vsl (a partir do relatório).
  // Usamos replaceState para marcar a entrada atual sem empilhar entradas
  // duplicadas no histórico.
  $effect(() => {
    if (
      !BACK_REDIRECT_PRE_ROUTES.includes(route) &&
      !BACK_REDIRECT_VSL_ROUTES.includes(route)
    )
      return
    if (backRedirectMarked.has(route)) return

    backRedirectMarked = new Set([...backRedirectMarked, route])

    window.history.replaceState({ backRedirect: true }, '', window.location.href)
  })

  function handlePopState(event: PopStateEvent) {
    // Só intercepta se a entrada anterior foi explicitamente marcada como back redirect.
    if (!event.state?.backRedirect) return

    const params = parseRoute().query

    if (BACK_REDIRECT_VSL_ROUTES.includes(route)) {
      event.preventDefault()
      window.location.hash = `#/back/vsl${params ? '?' + params : ''}`
      return
    }

    if (BACK_REDIRECT_PRE_ROUTES.includes(route)) {
      event.preventDefault()
      window.location.hash = `#/back/pre${params ? '?' + params : ''}`
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
