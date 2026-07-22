import type { BuscaCompleta, InstagramProfile, InstagramPost } from './api'
import { proxiedPostMedia } from './config'

export const searchStore = $state({
  username: '',
  profile: null as InstagramProfile | null,
  buscaCompleta: null as BuscaCompleta | null,
  loading: false,
  error: '',
  blockedReason: '',
})

export function getProxiedPosts(): InstagramPost[] {
  return searchStore.buscaCompleta?.instagram_posts.map(proxiedPostMedia) ?? []
}

export function resetSearchStore() {
  searchStore.username = ''
  searchStore.profile = null
  searchStore.buscaCompleta = null
  searchStore.loading = false
  searchStore.error = ''
  searchStore.blockedReason = ''
}

export function setSearchUsername(username: string) {
  searchStore.username = username.replace(/^@/, '').trim().toLowerCase()
}

export function setSearchProfile(profile: InstagramProfile | null) {
  searchStore.profile = profile
}

export function setSearchBuscaCompleta(busca: BuscaCompleta | null) {
  searchStore.buscaCompleta = busca
}

export function setSearchLoading(loading: boolean) {
  searchStore.loading = loading
}

export function setSearchError(error: string, blockedReason = '') {
  searchStore.error = error
  searchStore.blockedReason = blockedReason
}

export function clearSearchError() {
  searchStore.error = ''
  searchStore.blockedReason = ''
}
