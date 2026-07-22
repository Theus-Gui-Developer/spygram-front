<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title: string
    icon?: Snippet
    children: Snippet
    class?: string
  }

  let { title, icon, children, class: className = '' }: Props = $props()
</script>

<div class="bg-[#141418] border border-white/10 rounded-xl p-4 {className}">
  <div class="flex items-center gap-2 mb-3">
    {#if icon}
      {@render icon()}
    {/if}
    <div class="text-sm font-bold text-white">{title}</div>
  </div>
  {@render children()}
</div>
