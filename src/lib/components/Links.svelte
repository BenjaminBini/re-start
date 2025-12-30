<script lang="ts">
    import { settings } from '../settings-store.svelte'
    import type { Link } from '../types'

    const columns = $derived.by(() => {
        const result: Link[][] = []
        const linksPerColumn = Math.max(
            1,
            settings.linksPerColumn || 1
        )
        for (let i = 0; i < settings.links.length; i += linksPerColumn) {
            result.push(settings.links.slice(i, i + linksPerColumn))
        }
        return result
    })

    const FAVICON_OVERRIDES: Record<string, string> = {
        'mail.google.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
        'calendar.google.com': 'https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31.ico',
        'drive.google.com': 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
        'docs.google.com': 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
        'keep.google.com': 'https://ssl.gstatic.com/keep/icon_2020q4v2_128.png',
    }

    function getFaviconUrl(url: string): string {
        try {
            const domain = new URL(url).hostname
            if (FAVICON_OVERRIDES[domain]) {
                return FAVICON_OVERRIDES[domain]
            }
            return `https://icons.duckduckgo.com/ip3/${domain}.ico`
        } catch {
            return ''
        }
    }
</script>

<div class="panel-wrapper">
    <div class="panel-label">links</div>
    <div class="panel">
        {#each columns as column}
            <div class="column">
                {#each column as link}
                    <a
                        href={link.url}
                        target={settings.linkTarget}
                        rel="noopener noreferrer"
                        class="link"
                    >
                        {#if settings.showFavicons && link.url}
                            <img
                                src={getFaviconUrl(link.url)}
                                alt=""
                                class="favicon"
                            />
                        {:else}
                            <span class="bullet">></span>
                        {/if}
                        {link.title}
                    </a>
                    <br />
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .panel-wrapper {
        grid-column: span 3;
    }
    .panel {
        display: flex;
        padding-bottom: 1.5rem;
        mask-image: none !important;
        -weebkit-mask-image: none !important;
    }
    .link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
    }
    .link:hover .bullet {
        color: var(--txt-2);
    }
    .bullet {
        color: var(--txt-3);
    }
    .favicon {
        width: 16px;
        height: 16px;
        opacity: 0.7;
    }
    .link:hover .favicon {
        opacity: 1;
    }
    .column {
        width: 100%;
    }
</style>
