<script lang="ts">
    import type { Link } from '../../types'
    import { DraggableList, TextInput, Button, Row } from '../ui'

    let {
        links = $bindable(),
    }: {
        links: Link[]
    } = $props()

    // DraggableList requires items with id property - use $state for two-way binding
    let items = $state(links.map((link, i) => ({ ...link, id: i })))

    // Sync items back to links whenever items changes (reorder, edit, add, remove)
    $effect(() => {
        links = items.map(({ title, url }) => ({ title, url }))
    })

    function addLink(): void {
        items = [...items, { title: '', url: '', id: Date.now() }]
    }
</script>

<DraggableList bind:items label="edit links" onAdd={addLink}>
    {#snippet itemContent(_item, index, removeItem)}
        {@const item = items[index]}
        {#if item}
            <Row gap="sm">
                <TextInput
                    bind:value={item.title}
                    placeholder="title"
                    width="md"
                />
                <TextInput
                    bind:value={item.url}
                    placeholder="https://example.com"
                    type="url"
                />
                <Button
                    variant="delete"
                    onclick={() => removeItem(index)}
                    title="remove">x</Button
                >
            </Row>
        {/if}
    {/snippet}
</DraggableList>
