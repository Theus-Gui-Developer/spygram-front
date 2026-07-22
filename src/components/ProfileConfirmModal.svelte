<script lang="ts">
  import { onMount } from 'svelte'
  import GradientButton from './GradientButton.svelte'
  import { searchStore } from '../lib/search-store.svelte'
  import { fetchPosts, type InstagramPost } from '../lib/api'
  import { proxiedImageUrl, proxiedPostMedia } from '../lib/config'

  interface Props {
    username: string
    onConfirm: () => void
    onDecline: () => void
  }

  let { username, onConfirm, onDecline }: Props = $props()

  const profile = $derived(searchStore.profile)
  const fullName = $derived(profile?.full_name ?? username.replace(/\./g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
  const avatar = $derived(proxiedImageUrl(profile?.profile_pic_url))
  const postsCount = $derived(profile?.media_count ?? 0)
  const followers = $derived(profile?.follower_count ?? 0)
  const following = $derived(profile?.following_count ?? 0)
  const bio = $derived(profile?.biography ?? '')
  const isPrivate = $derived(profile?.is_private ?? false)

  let previewPosts = $state<InstagramPost[]>([])
  let postsLoading = $state(false)

  onMount(() => {
    if (isPrivate) return
    postsLoading = true
    fetchPosts(username)
      .then((posts) => {
        previewPosts = posts.slice(0, 3).map(proxiedPostMedia)
      })
      .catch(() => {
        previewPosts = []
      })
      .finally(() => {
        postsLoading = false
      })
  })
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
  <div class="w-full max-w-[360px] rounded-3xl bg-white p-5 shadow-2xl animate-fadeInUp">
    <div class="flex items-center justify-center gap-1 mb-4">
      <span class="text-base font-bold text-slate-950">{username}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="text-slate-950">
        <path d="M12 17.502a1 1 0 0 1-.707-.293l-9-9.004a1 1 0 0 1 1.414-1.414L12 14.088l8.293-8.297a1 1 0 0 1 1.414 1.414l-9 9.004a1 1 0 0 1-.707.293z"/>
      </svg>
    </div>

    <div class="flex gap-4 mb-4">
      <div class="shrink-0">
        <div class="w-20 h-20 rounded-full p-[3px]">
          <img
            src={avatar}
            alt={fullName}
            class="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      <div class="flex-1">
        <h3 class="text-base font-bold text-slate-950">{fullName}</h3>
        <div class="flex justify-between mt-2 text-center">
          <div>
            <div class="text-sm font-bold text-slate-950">{postsCount.toLocaleString('pt-BR')}</div>
            <div class="text-[10px] text-slate-500 uppercase">Posts</div>
          </div>
          <div>
            <div class="text-sm font-bold text-slate-950">{followers.toLocaleString('pt-BR')}</div>
            <div class="text-[10px] text-slate-500 uppercase">Segs</div>
          </div>
          <div>
            <div class="text-sm font-bold text-slate-950">{following.toLocaleString('pt-BR')}</div>
            <div class="text-[10px] text-slate-500 uppercase">Seg</div>
          </div>
        </div>
      </div>
    </div>

    <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line mb-4">{bio}</p>
    {#if isPrivate}
      <div class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
        Perfil privado — a análise ainda é possível.
      </div>
    {/if}

    {#if !isPrivate}
      <div class="grid grid-cols-3 gap-1 mb-4">
        {#if postsLoading}
          {#each [1, 2, 3] as _}
            <div class="aspect-square bg-slate-200 rounded-md animate-pulse"></div>
          {/each}
        {:else}
          {#each previewPosts as post}
            <div class="aspect-square rounded-md overflow-hidden bg-slate-100">
              {#if post.post?.video_url}
                <video
                  src={post.post.video_url}
                  poster={post.post.image_url || undefined}
                  class="w-full h-full object-cover"
                  muted
                  playsinline
                  preload="metadata"
                ></video>
              {:else if post.post?.image_url}
                <img
                  src={post.post.image_url}
                  alt="Post"
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="w-full h-full bg-slate-200"></div>
              {/if}
            </div>
          {/each}
          {#if previewPosts.length === 0}
            {#each [1, 2, 3] as _}
              <div class="aspect-square bg-slate-200 rounded-md animate-pulse"></div>
            {/each}
          {/if}
        {/if}
      </div>
    {/if}

    <div class="rounded-xl bg-amber-50 border border-amber-100 p-3 mb-5">
      <p class="text-[11px] text-amber-700 text-center leading-snug">
        ⚠️ Confirme com cuidado — esta é sua única análise gratuita.
      </p>
    </div>

    <h4 class="text-center text-base font-bold text-slate-950 mb-4">Este é o perfil certo?</h4>

    <div class="flex gap-3">
      <GradientButton onclick={onConfirm} class="flex-1">
        SIM, CONFIRMAR
      </GradientButton>
      <button
        type="button"
        onclick={onDecline}
        class="flex-1 min-h-[52px] rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-[15px] hover:border-slate-300 transition-colors"
      >
        Não
      </button>
    </div>
  </div>
</div>
