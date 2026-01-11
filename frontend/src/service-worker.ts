/**
 * Background service worker for re-start extension
 * Handles periodic background tasks like weather refresh
 *
 * IMPORTANT: Event listeners MUST be registered synchronously at top-level
 * for Manifest V3 service worker compatibility.
 */

import { createLogger } from './lib/logger'
import WeatherAPI from './lib/weather-api'
import { syncStorage } from './lib/storage-adapter'
import type { Settings } from './lib/types'

// Logger instance for service worker operations
const logger = createLogger('ServiceWorker')

// Weather API instance for background refresh
const weatherAPI = new WeatherAPI()

/**
 * Alarm names for scheduled tasks
 */
const ALARMS = {
    WEATHER_REFRESH: 'weatherRefresh',
} as const

/**
 * Alarm intervals (in minutes)
 */
const INTERVALS = {
    WEATHER_REFRESH: 15, // 15 minutes per spec
} as const

/**
 * Handle alarm events for scheduled background tasks
 * MUST be registered at top-level synchronously
 */
chrome.alarms.onAlarm.addListener((alarm) => {
    logger.log('Alarm triggered:', alarm.name)

    switch (alarm.name) {
        case ALARMS.WEATHER_REFRESH:
            handleWeatherRefresh().catch((error) => {
                logger.error('Weather refresh failed:', error)
            })
            break

        default:
            logger.warn('Unknown alarm:', alarm.name)
    }
})

/**
 * Handle extension installation and updates
 * Sets up initial alarms and performs one-time setup
 * MUST be registered at top-level synchronously
 */
chrome.runtime.onInstalled.addListener((details) => {
    logger.log('Extension installed/updated:', details.reason)

    // Set up periodic weather refresh alarm
    chrome.alarms.create(ALARMS.WEATHER_REFRESH, {
        periodInMinutes: INTERVALS.WEATHER_REFRESH,
    })

    logger.log(
        `Created ${ALARMS.WEATHER_REFRESH} alarm with ${INTERVALS.WEATHER_REFRESH}min interval`
    )

    // Log current alarms for debugging
    chrome.alarms.getAll().then((alarms) => {
        logger.log('Active alarms:', alarms.map((a) => a.name))
    })
})

/**
 * Handle weather data refresh in background
 * Fetches fresh weather data and updates chrome.storage.local cache
 */
async function handleWeatherRefresh(): Promise<void> {
    logger.log('Starting background weather refresh')

    try {
        // Load settings from chrome.storage.sync to get weather config
        const settings = await syncStorage.get<Settings>('settings', {} as Settings)

        // Check if weather is enabled and location is configured
        if (!settings.showWeather) {
            logger.log('Weather disabled in settings, skipping refresh')
            return
        }

        if (settings.latitude == null || settings.longitude == null) {
            logger.log('Weather location not configured, skipping refresh')
            return
        }

        // Check if cache is still fresh
        if (!weatherAPI.isCacheStale(settings.latitude, settings.longitude)) {
            logger.log('Weather cache still fresh, skipping refresh')
            return
        }

        // Fetch fresh weather data
        logger.log('Fetching fresh weather data:', {
            latitude: settings.latitude,
            longitude: settings.longitude,
            tempUnit: settings.tempUnit,
            speedUnit: settings.speedUnit,
        })

        await weatherAPI.sync(
            settings.latitude,
            settings.longitude,
            settings.tempUnit,
            settings.speedUnit
        )

        logger.log('Background weather refresh completed successfully')
    } catch (error) {
        logger.error('Weather refresh error:', error)
        throw error
    }
}

// Log service worker startup
logger.log('Service worker initialized')
