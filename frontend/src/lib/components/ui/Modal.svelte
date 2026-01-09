<script lang="ts">
    import type { Snippet } from 'svelte'
    import { X } from 'lucide-svelte'

    let {
        open = false,
        onClose,
        children,
    }: {
        open?: boolean
        onClose?: () => void
        children: Snippet
    } = $props()

    let modalElement = $state<HTMLDivElement | null>(null)
    let previouslyFocused = $state<HTMLElement | null>(null)

    // Focus trap and auto-focus when modal opens
    $effect(() => {
        if (open && modalElement) {
            // Store previously focused element
            previouslyFocused = document.activeElement as HTMLElement | null
            // Focus the modal container
            modalElement.focus()
        } else if (!open && previouslyFocused) {
            // Restore focus when closing
            previouslyFocused.focus()
            previouslyFocused = null
        }
    })

    function handleOverlayClick() {
        onClose?.()
    }

    function handleContentClick(e: MouseEvent) {
        e.stopPropagation()
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            onClose?.()
            return
        }

        // Focus trap: handle Tab key
        if (e.key === 'Tab' && modalElement) {
            const focusableElements = modalElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (!firstElement) return

            if (e.shiftKey) {
                // Shift+Tab: if on first element, wrap to last
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement?.focus()
                }
            } else {
                // Tab: if on last element, wrap to first
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        }
    }
</script>

{#if open}
    <div
        class="overlay"
        onclick={handleOverlayClick}
        onkeydown={handleKeyDown}
        role="presentation"
    >
        <div
            class="modal"
            bind:this={modalElement}
            onclick={handleContentClick}
            onkeydown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <button class="close-btn" onclick={onClose} aria-label="Close">
                <X size={16} />
            </button>
            <div class="content">
                {@render children()}
            </div>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .modal {
        position: relative;
        background: var(--bg-1);
        border: 1px solid var(--txt-4);
        border-radius: 8px;
        padding: 1.5rem 2rem;
        min-width: 340px;
        max-width: 90vw;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .close-btn {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        background: transparent;
        border: none;
        color: var(--txt-3);
        cursor: pointer;
        padding: 0.25rem;
    }

    .close-btn:hover {
        color: var(--txt-1);
    }

    .content {
        text-align: center;
    }
</style>
