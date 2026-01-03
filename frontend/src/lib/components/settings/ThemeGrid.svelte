<script lang="ts">
    import { RadioButton, GridGroup, ColorSwatch, Text } from '../ui'
    import type { Theme } from '../../types'

    let {
        themes,
        themeNames,
        selected = $bindable(),
    }: {
        themes: Record<string, Theme>
        themeNames: string[]
        selected: string
    } = $props()
</script>

<GridGroup columns={2} gap="sm" noMargin>
    {#each themeNames as themeName (themeName)}
        {@const theme = themes[themeName]}
        {#if theme}
            <RadioButton bind:group={selected} value={themeName}>
                <ColorSwatch
                    colors={[
                        theme.colors['--bg-1'],
                        theme.colors['--txt-4'],
                        theme.colors['--txt-2'],
                    ]}
                />
                <Text size="sm" flex>{theme.displayName}</Text>
            </RadioButton>
        {/if}
    {/each}
</GridGroup>
