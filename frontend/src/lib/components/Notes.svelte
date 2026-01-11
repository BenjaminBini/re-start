<script lang="ts">
    import { settings, saveSettings } from '../settings-store.svelte'
    import { Panel, TextArea } from './ui'

    // Local state for the notes content
    let notes = $state(settings.notesContent)

    // Debounce timeout reference
    let saveTimeout: number | null = null

    // Auto-save effect with debounce
    $effect(() => {
        // Watch the notes state
        void notes

        // Clear any existing timeout
        if (saveTimeout !== null) {
            clearTimeout(saveTimeout)
        }

        // Set up new debounced save
        saveTimeout = setTimeout(() => {
            if (notes !== settings.notesContent) {
                settings.notesContent = notes
                saveSettings(settings)
            }
        }, 300) as unknown as number

        // Cleanup: clear timeout when effect is destroyed
        return () => {
            if (saveTimeout !== null) {
                clearTimeout(saveTimeout)
            }
        }
    })
</script>

<Panel label="notes" flex={1}>
    <TextArea bind:value={notes} placeholder="quick notes..." rows={10} />
</Panel>
