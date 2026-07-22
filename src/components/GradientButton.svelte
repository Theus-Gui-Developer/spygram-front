<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
    onclick?: () => void
    type?: 'button' | 'submit'
    variant?: 'gradient' | 'outline' | 'white'
    class?: string
    disabled?: boolean
    icon?: Snippet
  }

  let {
    children,
    onclick,
    type = 'button',
    variant = 'gradient',
    class: className = '',
    disabled = false,
    icon,
  }: Props = $props()

  const base =
    'w-full min-h-[52px] rounded-2xl px-5 font-bold text-[15px] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'

  const styles = {
    gradient: 'spy-gradient text-white shadow-[0_12px_28px_rgba(255,0,105,0.28)] hover:shadow-[0_16px_34px_rgba(255,0,105,0.36)] hover:-translate-y-0.5',
    outline:
      'border border-slate-200 bg-white text-slate-700 hover:border-spy-pink/40 hover:text-spy-rose',
    white: 'bg-white text-slate-800 border border-slate-100 shadow-sm hover:bg-slate-50',
  }
</script>

<button {type} {disabled} class="{base} {styles[variant]} {className}" onclick={onclick}>
  {#if icon}
    {@render icon()}
  {/if}
  {@render children()}
</button>
