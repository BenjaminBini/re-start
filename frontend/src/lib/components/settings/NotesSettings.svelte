<script lang="ts">
    import { settings } from '../../settings-store.svelte'
    import { Checkbox, FormGroup, Button } from '../ui'

    function handleClearNotes(): void {
        if (confirm('are you sure you want to clear all notes?')) {
            settings.notesContent = ''
        }
    }
</script>

<FormGroup>
    <Checkbox bind:checked={settings.showNotes}>enabled</Checkbox>
</FormGroup>

{#if settings.showNotes}
    <FormGroup>
        <Button variant="text" onclick={handleClearNotes}>
            clear notes
        </Button>
    </FormGroup>
{/if}
