<script lang="ts">
    import {
        saveSettings,
        settings,
        resetSettings,
    } from '../settings-store.svelte'
    import {
        Paintbrush,
        Plug,
        Clock,
        Sun,
        SquareCheck,
        Calendar,
        Link,
        StickyNote,
    } from 'lucide-svelte'
    import type { UnsplashBackground } from '../types'
    import SettingsDrawer from './settings/SettingsDrawer.svelte'

    // Import tab components
    import AppearanceSettings from './settings/AppearanceSettings.svelte'
    import IntegrationsSettings from './settings/IntegrationsSettings.svelte'
    import ClockSettings from './settings/ClockSettings.svelte'
    import WeatherSettings from './settings/WeatherSettings.svelte'
    import TasksSettings from './settings/TasksSettings.svelte'
    import CalendarSettings from './settings/CalendarSettings.svelte'
    import LinksSettings from './settings/LinksSettings.svelte'
    import NotesSettings from './settings/NotesSettings.svelte'

    interface Tab {
        id: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon: any
        title: string
    }

    let {
        showSettings = false,
        closeSettings,
        refreshBackground = null,
        background = null,
    }: {
        showSettings: boolean
        closeSettings: () => void
        refreshBackground: (() => Promise<void>) | null
        background: UnsplashBackground | null
    } = $props()

    const tabs: Tab[] = [
        { id: 'appearance', icon: Paintbrush, title: 'Appearance' },
        { id: 'integrations', icon: Plug, title: 'Integrations' },
        { id: 'clock', icon: Clock, title: 'Clock' },
        { id: 'weather', icon: Sun, title: 'Weather' },
        { id: 'tasks', icon: SquareCheck, title: 'Tasks' },
        { id: 'calendar', icon: Calendar, title: 'Calendar' },
        { id: 'links', icon: Link, title: 'Links' },
        { id: 'notes', icon: StickyNote, title: 'Notes' },
    ]
    let activeTab = $state('appearance')

    // Calendar settings reference for fetching calendars
    let calendarSettingsRef = $state<{
        fetchCalendars: () => void
    } | null>(null)

    // Fetch calendars when settings opens and user is signed in
    $effect(() => {
        if (
            showSettings &&
            settings.googleTasksSignedIn &&
            settings.showCalendar &&
            calendarSettingsRef
        ) {
            calendarSettingsRef.fetchCalendars()
        }
    })

    const version = __APP_VERSION__

    async function handleClose(): Promise<void> {
        await saveSettings(settings)
        closeSettings()
    }

    async function handleReset(): Promise<void> {
        if (
            confirm('are you sure you want to reset all settings to default?')
        ) {
            await resetSettings()
            await saveSettings(settings)
        }
    }
</script>

<SettingsDrawer
    open={showSettings}
    {tabs}
    bind:activeTab
    {version}
    onClose={handleClose}
    onReset={handleReset}
>
    {#if activeTab === 'appearance'}
        <AppearanceSettings {refreshBackground} {background} />
    {:else if activeTab === 'integrations'}
        <IntegrationsSettings />
    {:else if activeTab === 'clock'}
        <ClockSettings />
    {:else if activeTab === 'weather'}
        <WeatherSettings />
    {:else if activeTab === 'tasks'}
        <TasksSettings />
    {:else if activeTab === 'calendar'}
        <CalendarSettings bind:this={calendarSettingsRef} />
    {:else if activeTab === 'links'}
        <LinksSettings />
    {:else if activeTab === 'notes'}
        <NotesSettings />
    {/if}
</SettingsDrawer>
