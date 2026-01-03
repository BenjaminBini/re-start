<script lang="ts">
    import type { Snippet } from 'svelte'

    type Item = { id: string | number } & Record<string, unknown>

    let {
        items = $bindable([]),
        label = '',
        addLabel = '+ add',
        onAdd,
        itemContent,
    }: {
        items: Item[]
        label?: string
        addLabel?: string
        onAdd?: () => void
        itemContent: Snippet<[Item, number, (index: number) => void]>
    } = $props()

    let draggedIndex = $state<number | null>(null)
    let dragOverIndex = $state<number | null>(null)
    let dragHandles = $state<HTMLSpanElement[]>([])

    function handleDragStart(event: DragEvent, index: number): void {
        draggedIndex = index
        event.dataTransfer!.effectAllowed = 'move'
        event.dataTransfer!.setData(
            'text/html',
            (event.currentTarget as HTMLElement).outerHTML
        )
    }

    function handleDragOver(event: DragEvent, index: number): void {
        event.preventDefault()
        event.dataTransfer!.dropEffect = 'move'
        dragOverIndex = index
    }

    function handleDragLeave(): void {
        dragOverIndex = null
    }

    function handleDrop(event: DragEvent, dropIndex: number): void {
        event.preventDefault()

        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            const newItems = [...items]
            const draggedItem = newItems[draggedIndex]
            if (draggedItem) {
                newItems.splice(draggedIndex, 1)
                newItems.splice(dropIndex, 0, draggedItem)
                items = newItems
            }
        }

        draggedIndex = null
        dragOverIndex = null
    }

    function handleDragEnd(): void {
        draggedIndex = null
        dragOverIndex = null
    }

    function removeItem(index: number): void {
        items = items.filter((_, i) => i !== index)
    }

    function moveItem(fromIndex: number, toIndex: number): void {
        if (toIndex < 0 || toIndex >= items.length) return

        const newItems = [...items]
        const item = newItems[fromIndex]
        if (item) {
            newItems.splice(fromIndex, 1)
            newItems.splice(toIndex, 0, item)
            items = newItems

            // Focus the drag handle at the new position after DOM updates
            requestAnimationFrame(() => {
                dragHandles[toIndex]?.focus()
            })
        }
    }

    function handleKeyDown(event: KeyboardEvent, index: number): void {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault()
                moveItem(index, index - 1)
                break
            case 'ArrowDown':
                event.preventDefault()
                moveItem(index, index + 1)
                break
            case ' ':
            case 'Enter':
                // Announce current position for screen readers
                event.preventDefault()
                break
        }
    }
</script>

<div class="draggable-list">
    {#if label || onAdd}
        <div class="header">
            {#if label}
                <span class="label">{label}</span>
            {/if}
            {#if onAdd}
                <button class="add-btn" onclick={onAdd}>{addLabel}</button>
            {/if}
        </div>
    {/if}
    <div class="items" role="list" aria-label={label || 'Reorderable list'}>
        {#each items as item, index (item.id)}
            <div
                class="item"
                class:dragging={draggedIndex === index}
                class:drag-over={dragOverIndex === index}
                ondragover={(e) => handleDragOver(e, index)}
                ondragleave={handleDragLeave}
                ondrop={(e) => handleDrop(e, index)}
                role="listitem"
            >
                <span
                    class="drag-handle"
                    title="Drag to reorder, or use arrow keys"
                    draggable="true"
                    ondragstart={(e) => handleDragStart(e, index)}
                    ondragend={handleDragEnd}
                    onkeydown={(e) => handleKeyDown(e, index)}
                    role="button"
                    tabindex="0"
                    aria-label={`Reorder item ${index + 1} of ${items.length}. Use arrow keys to move.`}
                    bind:this={dragHandles[index]}>=</span
                >
                {@render itemContent(item, index, removeItem)}
            </div>
        {/each}
    </div>
</div>

<style>
    .draggable-list {
        width: 100%;
        margin-bottom: 1.5rem;
    }

    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .add-btn {
        height: 1.5rem;
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        color: var(--txt-3);
        cursor: pointer;
    }

    .add-btn:hover {
        color: var(--txt-2);
    }

    .item {
        display: flex;
        align-items: center;
        margin-bottom: calc(0.5rem - 2px);
        border: 2px solid transparent;
    }

    .item.dragging {
        opacity: 0.5;
        border: 2px dashed var(--txt-3);
    }

    .item.drag-over {
        border: 2px solid var(--txt-2);
    }

    .drag-handle {
        cursor: grab;
        padding: 0 0.5rem 0 0.25rem;
        color: var(--txt-3);
        user-select: none;
        font-size: 1.125rem;
        touch-action: none;
    }

    .drag-handle:active {
        cursor: grabbing;
    }
</style>
