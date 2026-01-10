<script lang="ts">
    import type { Snippet, Component } from 'svelte'
    import { fade, fly } from 'svelte/transition'

    interface Tab {
        id: string
        icon: Component
        title: string
    }

    let {
        open = false,
        title = '',
        tabs = [],
        activeTab = $bindable(''),
        width = '40rem',
        onClose,
        children,
        footer,
    }: {
        open?: boolean
        title?: string
        tabs?: Tab[]
        activeTab?: string
        width?: string
        onClose?: () => void
        children: Snippet
        footer?: Snippet
    } = $props()

    let tabElements = $state<Record<string, HTMLButtonElement>>({})
    let indicatorStyle = $state('')
    let drawerElement = $state<HTMLDivElement | null>(null)
    let previouslyFocused = $state<HTMLElement | null>(null)

    $effect(() => {
        const el = tabElements[activeTab]
        if (el) {
            indicatorStyle = `left: ${el.offsetLeft}px; width: ${el.offsetWidth}px`
        }
    })

    // Focus trap and auto-focus when drawer opens
    $effect(() => {
        if (open && drawerElement) {
            // Store previously focused element
            previouslyFocused = document.activeElement as HTMLElement | null
            // Focus the first focusable element in the drawer
            const firstFocusable = drawerElement.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            firstFocusable?.focus()
        } else if (!open && previouslyFocused) {
            // Restore focus when closing
            previouslyFocused.focus()
            previouslyFocused = null
        }
    })

    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            onClose?.()
            return
        }

        // Arrow key navigation for tabs
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && tabs.length > 0) {
            // Check if focus is on a tab button
            const activeElement = document.activeElement as HTMLElement
            const isTabFocused = activeElement?.getAttribute('role') === 'tab'

            if (isTabFocused) {
                event.preventDefault()
                const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)

                let newIndex: number
                if (event.key === 'ArrowRight') {
                    // Move to next tab, wrap to first if at end
                    newIndex = currentIndex + 1 >= tabs.length ? 0 : currentIndex + 1
                } else {
                    // Move to previous tab, wrap to last if at beginning
                    newIndex = currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1
                }

                const newTab = tabs[newIndex]
                activeTab = newTab.id
                // Focus the new tab element
                tabElements[newTab.id]?.focus()
            }
        }

        // Home/End key navigation for tabs
        if ((event.key === 'Home' || event.key === 'End') && tabs.length > 0) {
            // Check if focus is on a tab button
            const activeElement = document.activeElement as HTMLElement
            const isTabFocused = activeElement?.getAttribute('role') === 'tab'

            if (isTabFocused) {
                event.preventDefault()

                let newIndex: number
                if (event.key === 'Home') {
                    // Jump to first tab
                    newIndex = 0
                } else {
                    // Jump to last tab
                    newIndex = tabs.length - 1
                }

                const newTab = tabs[newIndex]
                activeTab = newTab.id
                // Focus the new tab element
                tabElements[newTab.id]?.focus()
            }
        }

        // Focus trap: handle Tab key
        if (event.key === 'Tab' && drawerElement) {
            const focusableElements = drawerElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (!firstElement) return

            if (event.shiftKey) {
                // Shift+Tab: if on first element, wrap to last
                if (document.activeElement === firstElement) {
                    event.preventDefault()
                    lastElement?.focus()
                }
            } else {
                // Tab: if on last element, wrap to first
                if (document.activeElement === lastElement) {
                    event.preventDefault()
                    firstElement.focus()
                }
            }
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <div
        class="backdrop"
        onclick={onClose}
        onkeydown={(e) => e.key === 'Enter' && onClose?.()}
        role="button"
        tabindex="0"
        transition:fade={{ duration: 200 }}
    ></div>

    <div
        class="drawer"
        bind:this={drawerElement}
        style:width
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabindex="-1"
        onkeydown={handleKeydown}
        transition:fly={{ x: 640, duration: 200 }}
    >
        <div class="header">
            <h2>{title}</h2>
            <button class="close-btn" onclick={onClose}>x</button>
        </div>

        {#if tabs.length > 0}
            <nav class="tabs" role="tablist">
                {#each tabs as tab (tab.id)}
                    <button
                        id="tab-{tab.id}"
                        class="tab"
                        class:active={activeTab === tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id ? 'true' : 'false'}
                        aria-controls="tabpanel-{tab.id}"
                        tabindex={activeTab === tab.id ? 0 : -1}
                        onclick={() => (activeTab = tab.id)}
                        title={tab.title}
                        bind:this={tabElements[tab.id]}
                    >
                        <tab.icon size={18} strokeWidth={2} />
                    </button>
                {/each}
                <div class="tab-indicator" style={indicatorStyle}></div>
            </nav>
        {/if}

        <div
            class="content"
            role="tabpanel"
            id="tabpanel-{activeTab}"
            aria-labelledby="tab-{activeTab}"
            tabindex="0"
        >
            {@render children()}

            {#if footer}
                <div class="footer">
                    {@render footer()}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
    }

    .drawer {
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        background: var(--bg-1);
        border-left: 2px solid var(--bg-3);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }

    .header {
        padding: 0.75rem 1rem 0.75rem 1.5rem;
        border-bottom: 2px solid var(--bg-3);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header h2 {
        margin: 0;
    }

    .close-btn {
        padding: 0 0.5rem;
        font-size: 1.5rem;
        line-height: 2.25rem;
        font-weight: 300;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
    }

    .close-btn:hover {
        color: var(--txt-1);
    }

    .tabs {
        position: relative;
        display: flex;
        border-bottom: 2px solid var(--bg-3);
        padding: 0 1rem;
    }

    .tab {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        color: var(--txt-3);
        background: none;
        border: none;
        cursor: pointer;
        transition: color 0.15s ease;
    }

    .tab:hover {
        color: var(--txt-2);
    }

    .tab.active {
        color: var(--txt-1);
    }

    .tab-indicator {
        position: absolute;
        bottom: -2px;
        height: 2px;
        background: var(--txt-2);
        transition:
            left 0.2s ease,
            width 0.2s ease;
    }

    .content {
        flex: 1;
        width: 100%;
        padding: 1.5rem;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--bg-3) var(--bg-1);
        box-sizing: border-box;
    }

    .footer {
        color: var(--txt-3);
    }

    .footer :global(a) {
        color: var(--txt-2);
    }

    .footer :global(a:hover) {
        color: var(--txt-1);
    }

    .footer :global(button) {
        background: none;
        border: none;
        color: var(--txt-2);
        cursor: pointer;
        padding: 0;
        font-size: inherit;
        font-family: inherit;
    }

    .footer :global(button:hover) {
        color: var(--txt-1);
    }
</style>
