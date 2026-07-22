<script lang="ts">
  interface Props {
    variant?: 'dark' | 'light'
    class?: string
  }

  let { variant = 'dark', class: className = '' }: Props = $props()

  const src = $derived(variant === 'dark' ? '/v4/logo.webp' : '/v4/logo-white.webp')
</script>

<a href="#/" class="inline-flex items-center justify-center {className}">
  <img {src} alt="SpyGram" class="h-10 w-auto object-contain" />
</a>
