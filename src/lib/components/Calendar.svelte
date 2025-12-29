<script>
    import { onMount, onDestroy } from 'svelte'
    import { createCalendarBackend } from '../backends/index.js'
    import { settings } from '../settings-store.svelte.js'
    import { authState } from '../backends/google-auth.js'
    import { RefreshCw, Video, MapPin } from 'lucide-svelte'

    function getVideoProvider(url) {
        if (!url) return null
        if (url.includes('meet.google.com') || url.includes('hangouts.google.com')) return 'meet'
        if (url.includes('teams.microsoft.com') || url.includes('teams.live.com')) return 'teams'
        if (url.includes('zoom.us') || url.includes('zoom.com')) return 'zoom'
        return 'other'
    }

    let api = null
    let events = $state([])
    let syncing = $state(true)
    let error = $state('')
    let eventCount = $derived(events.length)
    let syncInProgress = false
    let googleAuthStatus = $state(authState.status)
    let unsubscribeAuth = null

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible' && api) {
            loadEvents()
        }
    }

    $effect(() => {
        const authStatus = googleAuthStatus
        console.log('[Calendar] Effect triggered:', { authStatus })
        initializeAPI(authStatus)
    })

    async function initializeAPI(authStatus) {
        if (authStatus === 'unauthenticated') {
            api = null
            events = []
            syncing = false
            error = 'not signed in to google'
            return
        }

        error = ''

        try {
            api = createCalendarBackend()

            // Load cached data immediately (works for 'unknown' and 'authenticated')
            const cachedEvents = api.getEvents()
            if (cachedEvents.length > 0) {
                events = cachedEvents
                syncing = false
            }

            // Sync in background if authenticated and cache is stale
            if (authStatus === 'authenticated' && (api.isCacheStale() || cachedEvents.length === 0)) {
                loadEvents(cachedEvents.length === 0)
            } else if (authStatus === 'unknown') {
                syncing = false
            }
        } catch (err) {
            error = 'failed to initialize calendar'
            console.error(err)
            syncing = false
        }
    }

    async function loadEvents(showSyncing = false) {
        if (syncInProgress) return
        syncInProgress = true
        try {
            if (showSyncing) syncing = true
            error = ''
            const calendars = settings.selectedCalendars
            await api.sync(calendars)
            events = api.getEvents()
        } catch (err) {
            error = 'failed to sync calendar'
            console.error(err)
        } finally {
            syncing = false
            syncInProgress = false
        }
    }

    function formatEventTime(event) {
        if (event.isAllDay) {
            return 'all day'
        }

        const formatTime = (date) => {
            if (settings.timeFormat === '12hr') {
                return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }).toLowerCase()
            } else {
                return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false,
                })
            }
        }

        return formatTime(event.startTime)
    }

    onMount(() => {
        unsubscribeAuth = authState.subscribe((state) => {
            console.log('[Calendar] Auth state update:', state.status)
            googleAuthStatus = state.status
        })
        document.addEventListener('visibilitychange', handleVisibilityChange)
    })

    onDestroy(() => {
        if (unsubscribeAuth) unsubscribeAuth()
        document.removeEventListener('visibilitychange', handleVisibilityChange)
    })
</script>

<div class="panel-wrapper">
    <button
        class="widget-label"
        onclick={() => loadEvents(true)}
        disabled={syncing}
    >
        {syncing ? 'syncing...' : 'calendar'}
    </button>
    <div class="panel">
        {#if error}
            <div class="error">{error}</div>
        {:else}
            <div class="widget-header">
                <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span class="bright">{eventCount}</span>
                    event{eventCount === 1 ? '' : 's'} today
                </a>
            </div>

            <br />
            <div class="events">
                <div class="events-list">
                    {#each events as event}
                        {@const videoProvider = getVideoProvider(event.hangoutLink)}
                        <div
                            class="event"
                            class:past={event.isPast}
                            class:ongoing={event.isOngoing}
                        >
                            <span class="event-time">{formatEventTime(event)}</span>
                            <div class="event-details">
                                <a
                                    href={event.htmlLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="event-title"
                                >
                                    {event.title}
                                </a>
                                {#if event.location || videoProvider}
                                    <div class="event-meta">
                                        {#if event.location}
                                            <span class="event-location">
                                                <MapPin size={12} />
                                                {event.location}
                                            </span>
                                        {/if}
                                        {#if videoProvider}
                                            <a
                                                href={event.hangoutLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="event-video"
                                                title="Join video call"
                                            >
                                                {#if videoProvider === 'meet'}
                                                    <svg class="video-icon" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                    </svg>
                                                {:else if videoProvider === 'teams'}
                                                    <svg class="video-icon" viewBox="0 0 50 50" fill="currentColor">
                                                        <path d="M 27.5 5 C 24.08 5 21.269531 7.64 21.019531 11 L 24 11 C 26.76 11 29 13.24 29 16 L 29 17.820312 C 31.87 17.150312 34 14.57 34 11.5 C 34 7.91 31.09 5 27.5 5 z M 42.5 9 A 4.5 4.5 0 0 0 42.5 18 A 4.5 4.5 0 0 0 42.5 9 z M 6 13 C 4.346 13 3 14.346 3 16 L 3 34 C 3 35.654 4.346 37 6 37 L 24 37 C 25.654 37 27 35.654 27 34 L 27 16 C 27 14.346 25.654 13 24 13 L 6 13 z M 10 19 L 20 19 L 20 21 L 16 21 L 16 31 L 14 31 L 14 21 L 10 21 L 10 19 z M 29 21 L 29 34 C 29 36.76 26.76 39 24 39 L 18.199219 39 C 18.599219 40.96 19.569688 42.710313 20.929688 44.070312 C 22.739688 45.880312 25.24 47 28 47 C 33.52 47 38 42.52 38 37 L 38 21 L 29 21 z M 40 21 L 40 37 C 40 37.82 39.919531 38.620625 39.769531 39.390625 C 40.599531 39.780625 41.52 40 42.5 40 C 46.09 40 49 37.09 49 33.5 L 49 21 L 40 21 z"/>
                                                    </svg>
                                                {:else if videoProvider === 'zoom'}
                                                    <svg class="video-icon" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M4 4h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm14 3l4-2v10l-4-2V7z"/>
                                                    </svg>
                                                {:else}
                                                    <Video size={12} />
                                                {/if}
                                            </a>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                    {#if events.length === 0 && !syncing}
                        <div class="no-events">no events today</div>
                    {/if}
                </div>
            </div>
            <button
                class="sync-btn"
                onclick={() => loadEvents(true)}
                disabled={syncing}
                title="sync"
            >
                <RefreshCw size={14} class={syncing ? 'spinning' : ''} />
            </button>
        {/if}
    </div>
</div>

<style>
    .panel-wrapper {
        flex: 1;
    }
    .events {
        max-height: 15rem;
        overflow: auto;
        scrollbar-width: none;
        scroll-snap-type: y proximity;
    }
    .event {
        display: flex;
        align-items: flex-start;
        gap: 1ch;
        max-width: 40rem;
        scroll-snap-align: start;
        margin-bottom: 0.25rem;
    }
    .event-time {
        color: var(--txt-2);
        min-width: 7ch;
        flex-shrink: 0;
    }
    .event-details {
        flex: 1 1 auto;
        min-width: 0;
    }
    .event-title:hover {
        color: var(--txt-1);
    }
    .event-meta {
        display: flex;
        align-items: center;
        gap: 1ch;
        font-size: 0.8rem;
        color: var(--txt-3);
    }
    .event-location {
        display: inline-flex;
        align-items: center;
        gap: 0.25ch;
    }
    .event-video {
        display: inline-flex;
        align-items: center;
        color: var(--txt-3);
    }
    .event-video:hover {
        color: var(--txt-1);
    }
    .video-icon {
        width: 14px;
        height: 14px;
    }
    .event.past {
        opacity: 0.5;
    }
    .event.ongoing .event-time {
        color: var(--txt-accent);
    }
    .no-events {
        color: var(--txt-3);
    }
    a:hover {
        color: var(--txt-1);
    }
</style>
