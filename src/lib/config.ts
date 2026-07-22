import type { InstagramPost } from './api'

/**
 * Configurações globais do funil.
 *
 * CHECKOUT_URL: link de checkout externo para onde todos os CTAs levam
 * (na referência: https://rdt.detetive-spygram.com/click/1).
 * Troque aqui quando o checkout real estiver disponível.
 */
export const CHECKOUT_URL = 'https://SEU-CHECKOUT-AQUI.com/click/1'

/** Base URL do backend NestJS. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

/** Abre o checkout externo em nova aba (comportamento da referência). */
export function openCheckout() {
  window.open(CHECKOUT_URL, '_blank', 'noopener,noreferrer')
}

/** Gera URL para o proxy de imagem do backend. */
export function proxiedImageUrl(originalUrl: string | null | undefined): string {
  if (!originalUrl) return '/v4/profile.webp'
  // _t força revalidação e evita cache com headers antigos sem CORS.
  return `${API_BASE_URL}/api/image-proxy?url=${encodeURIComponent(originalUrl)}&_t=${Date.now()}`
}

/** Aplica o proxy de mídia do backend às URLs de um post do Instagram. */
export function proxiedPostMedia(post: InstagramPost): InstagramPost {
  return {
    ...post,
    thumbnail_url: proxiedImageUrl(post.thumbnail_url),
    image_url: proxiedImageUrl(post.image_url),
    video_url: proxiedImageUrl(post.video_url),
    de_usuario: post.de_usuario
      ? {
          ...post.de_usuario,
          profile_pic_url: proxiedImageUrl(post.de_usuario.profile_pic_url),
        }
      : undefined,
  }
}
