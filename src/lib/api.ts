import { API_BASE_URL } from './config'

export interface InstagramProfile {
  pk: string
  username: string
  full_name: string
  profile_pic_url: string
  follower_count: number
  following_count: number
  media_count: number
  is_private: boolean
  biography: string
  is_verified: boolean
}

export interface InstagramFollower {
  pk?: string
  id?: string
  username: string
  full_name: string
  profile_pic_url: string
  is_private?: boolean
}

export interface InstagramPost {
  de_usuario?: {
    username: string
    full_name: string
    profile_pic_url: string
  }
  post: {
    id: string
    shortcode?: string
    image_url?: string | null
    video_url?: string | null
    is_video?: boolean
    caption?: string
    like_count?: number
    comment_count?: number
    taken_at?: number | null
  }
  is_mock: boolean
}

export interface BuscaCompleta {
  instagram_profile: InstagramProfile
  instagram_followers: InstagramFollower[]
  followers: InstagramFollower[]
  instagram_posts: InstagramPost[]
  feed_stories_order: string[]
  meta: { source: 'hikerapi'; cached: boolean; generated_at: string }
}

export interface SearchStatus {
  canSearch: boolean
  reason?: string
  searchCount?: number
  gracePeriodExpired?: boolean
  windowActive?: boolean
}

export interface ApiError {
  statusCode: number
  message: string
  status?: SearchStatus
}

export class InstagramApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: ApiError,
  ) {
    super(message)
    this.name = 'InstagramApiError'
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  })

  const text = await response.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as Record<string, unknown>).message)
        : `Erro ${response.status}`
    throw new InstagramApiError(message, response.status, data as ApiError | undefined)
  }

  return data as T
}

export function fetchProfile(username: string): Promise<InstagramProfile> {
  const clean = username.replace(/^@/, '').trim().toLowerCase()
  return request<InstagramProfile>(`/api/instagram?tipo=perfil&username=${encodeURIComponent(clean)}`)
}

export function fetchBuscaCompleta(username: string, fingerprint: string): Promise<BuscaCompleta> {
  const clean = username.replace(/^@/, '').trim().toLowerCase()
  return request<BuscaCompleta>(
    `/api/instagram?tipo=busca_completa&username=${encodeURIComponent(clean)}&fingerprint=${encodeURIComponent(fingerprint)}`,
  )
}

export function fetchPosts(username: string): Promise<InstagramPost[]> {
  const clean = username.replace(/^@/, '').trim().toLowerCase()
  return request<InstagramPost[]>(
    `/api/instagram?tipo=posts&username=${encodeURIComponent(clean)}`,
  )
}
