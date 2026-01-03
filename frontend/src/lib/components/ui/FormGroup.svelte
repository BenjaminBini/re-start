<script lang="ts">
    import type { Snippet } from 'svelte'

    let {
        label = '',
        labelFor = '',
        autoWidth = false,
        children,
    }: {
        label?: string
        labelFor?: string
        autoWidth?: boolean
        children: Snippet
    } = $props()
</script>

<div class="group" class:auto-width={autoWidth}>
    {#if label}
        {#if labelFor}
            <label class="label" for={labelFor}>{label}</label>
        {:else}
            <span class="label">{label}</span>
        {/if}
    {/if}
    {@render children()}
</div>

<style>
    .group {
        width: 100%;
        margin-bottom: 1.5rem;
    }

    .group.auto-width {
        flex: 0 0 auto;
    }

    .label {
        display: block;
        margin-bottom: 0.5rem;
    }
</style>
