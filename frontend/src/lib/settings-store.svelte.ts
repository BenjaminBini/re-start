import type { Settings } from './types'
import { syncStorage } from './storage-adapter'
import { createLogger } from './logger'

const logger = createLogger('SettingsStore')

const defaultSettings: Settings = {
    font: 'Geist Mono Variable',
    currentTheme: 'default',
    tabTitle: '~',
    // Integrations
    todoistApiToken: '',
    googleTasksSignedIn: false,
    unsplashApiKey: '',
    // Clock
    timeFormat: '24hr',
    dateFormat: 'dmy',
    // Weather
    showWeather: true,
    locationMode: 'manual',
    latitude: null,
    longitude: null,
    tempUnit: 'celsius',
    speedUnit: 'kmh',
    // Tasks
    showTasks: true,
    taskBackend: 'local',
    // Calendar
    showCalendar: true,
    selectedCalendars: [],
    // Background
    showBackground: false,
    backgroundOpacity: 0.85,
    // Links
    showLinks: true,
    showFavicons: true,
    linksPerColumn: 4,
    linkTarget: '_self',
    links: [
        { title: 'gmail', url: 'https://mail.google.com' },
        { title: 'calendar', url: 'https://calendar.google.com' },
        { title: 'drive', url: 'https://drive.google.com' },
        { title: 'docs', url: 'https://docs.google.com' },
        { title: 'github', url: 'https://github.com' },
        { title: 'slack', url: 'https://slack.com' },
        { title: 'keep', url: 'https://keep.google.com' },
        { title: 'leetcode', url: 'https://leetcode.com/problemset' },
        { title: 'perplexity', url: 'https://perplexity.ai' },
        { title: 'claude', url: 'https://claude.ai' },
        { title: 'aistudio', url: 'https://aistudio.google.com' },
        { title: 'chatgpt', url: 'https://chat.openai.com' },
        { title: 'youtube', url: 'https://youtube.com' },
        { title: 'reddit', url: 'https://reddit.com' },
        { title: 'twitter', url: 'https://x.com' },
        { title: 'feedly', url: 'https://feedly.com' },
    ],
    customCSS: '',
}

/**
 * Load settings from chrome.storage.sync asynchronously
 * Merges stored settings with default settings to handle new fields
 */
async function loadSettings(): Promise<Settings> {
    try {
        const stored = await syncStorage.get<Partial<Settings>>('settings', {})
        return { ...defaultSettings, ...stored }
    } catch (error) {
        logger.error('Failed to load settings from chrome.storage.sync:', error)
        return defaultSettings
    }
}

/**
 * Save settings to chrome.storage.sync
 * Settings automatically sync across browser instances when using chrome.storage.sync
 */
export async function saveSettings(settingsToSave: Settings): Promise<void> {
    try {
        await syncStorage.set('settings', settingsToSave)
    } catch (error) {
        logger.error('Failed to save settings to chrome.storage.sync:', error)
        throw error
    }
}

/**
 * Reset settings to defaults
 * Removes settings from chrome.storage.sync and resets the reactive state
 */
export async function resetSettings(): Promise<boolean> {
    try {
        await syncStorage.remove('settings')
        // Reset the settings object to default
        Object.assign(settings, defaultSettings)
        return true
    } catch (error) {
        logger.error('Failed to reset settings:', error)
        return false
    }
}

/**
 * Initialize settings store
 * Reactive Svelte 5 state initialized with default settings
 * Actual settings loaded asynchronously via initSettings()
 */
export const settings: Settings = $state({ ...defaultSettings })

/**
 * Initialize settings from chrome.storage.sync
 * Must be called during app startup to load persisted settings
 *
 * Also sets up a listener for cross-device sync via chrome.storage.onChanged
 */
export async function initSettings(): Promise<void> {
    try {
        const loaded = await loadSettings()
        Object.assign(settings, loaded)
        logger.log('Settings loaded from chrome.storage.sync')

        // Listen for changes from other browser instances (cross-device sync)
        syncStorage.onChange((changes) => {
            if (changes.settings?.newValue) {
                logger.log('Settings updated from another device')
                Object.assign(settings, changes.settings.newValue)
            }
        })
    } catch (error) {
        logger.error('Failed to initialize settings:', error)
    }
}
