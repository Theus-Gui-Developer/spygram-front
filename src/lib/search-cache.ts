import type { BuscaCompleta, InstagramProfile } from './api'

const STORAGE_KEY = 'spygram:search'

export const SEARCH_CACHE_TTL_MS = 24 * 60 * 60 * 1000

export const TRACKED_SEARCH_ROUTES = [
  'analise',
  'vsl',
  'relatorio',
  'acessando-instagram',
  'InstaView',
] as const

export type TrackedSearchRoute = (typeof TRACKED_SEARCH_ROUTES)[number]

export interface SearchCache {
  username: string
  genero: string
  profile: InstagramProfile | null
  buscaCompleta: BuscaCompleta | null
  lastRoute: TrackedSearchRoute | string
  vslProgress?: number
  instagramAccessGranted?: boolean
  createdAt: number
}

function isTrackedSearchRoute(route: string): route is TrackedSearchRoute {
  return (TRACKED_SEARCH_ROUTES as readonly string[]).includes(route)
}

export function getSearchCache(): SearchCache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<SearchCache>
    if (!parsed.username || !parsed.createdAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    if (Date.now() - parsed.createdAt > SEARCH_CACHE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return {
      username: parsed.username,
      genero: parsed.genero ?? 'homem',
      profile: parsed.profile ?? null,
      buscaCompleta: parsed.buscaCompleta ?? null,
      lastRoute: isTrackedSearchRoute(parsed.lastRoute ?? '')
        ? (parsed.lastRoute as TrackedSearchRoute)
        : 'vsl',
      vslProgress: typeof parsed.vslProgress === 'number' ? parsed.vslProgress : undefined,
      instagramAccessGranted: parsed.instagramAccessGranted ?? undefined,
      createdAt: parsed.createdAt,
    }
  } catch {
    return null
  }
}

export function setSearchCache(cache: SearchCache): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // ignore
  }
}

export function clearSearchCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function saveSearchCache(
  patch: Partial<Omit<SearchCache, 'createdAt'>> & { username: string; genero: string },
): void {
  const existing = getSearchCache()
  const next: SearchCache = {
    username: patch.username,
    genero: patch.genero,
    profile: patch.profile ?? existing?.profile ?? null,
    buscaCompleta: patch.buscaCompleta ?? existing?.buscaCompleta ?? null,
    lastRoute: patch.lastRoute ?? existing?.lastRoute ?? 'vsl',
    vslProgress:
      typeof patch.vslProgress === 'number'
        ? patch.vslProgress
        : existing?.vslProgress ?? undefined,
    instagramAccessGranted:
      typeof patch.instagramAccessGranted === 'boolean'
        ? patch.instagramAccessGranted
        : existing?.instagramAccessGranted ?? undefined,
    createdAt: existing?.createdAt ?? Date.now(),
  }
  setSearchCache(next)
}

export function getCachedEntryUrl(cache: SearchCache): string {
  let route = isTrackedSearchRoute(cache.lastRoute) ? cache.lastRoute : 'vsl'

  // Nunca reabrir o funil numa tela de backredirect.
  if (route.startsWith('back/')) route = 'vsl'

  return `#/${route}?usuario=${encodeURIComponent(cache.username)}&genero=${encodeURIComponent(cache.genero)}`
}
