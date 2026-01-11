// Unsplash API module for daily background images
// Topics: abstract, nature, city scenery
// Images update daily with lazy refresh

import type { UnsplashBackground, UnsplashPhotographer } from './types'
import { localStorage as storageAdapter } from './storage-adapter'
import { createLogger } from './logger'

const logger = createLogger('UnsplashAPI')

const API_URL = 'https://api.unsplash.com/photos/random'
const STORAGE_KEY = 'unsplash_background'

// Topics to randomly select from for variety
const TOPICS = ['abstract', 'nature', 'city', 'architecture', 'landscape']

interface UnsplashApiResponse {
    id: string
    urls: {
        regular: string
        full: string
        small: string
    }
    blur_hash: string
    color: string
    description: string | null
    alt_description: string | null
    user: {
        name: string
        username: string
        links: {
            html: string
        }
    }
    links: {
        html: string
        download_location: string
    }
}

/**
 * Get today's date as YYYY-MM-DD string
 */
function getTodayDate(): string {
    return new Date().toISOString().split('T')[0] ?? ''
}

/**
 * Get a random topic from the list
 */
function getRandomTopic(): string {
    return TOPICS[Math.floor(Math.random() * TOPICS.length)] ?? 'nature'
}

/**
 * Load cached background data from chrome.storage.local
 */
export async function loadCachedBackground(): Promise<UnsplashBackground | null> {
    try {
        return await storageAdapter.get<UnsplashBackground | null>(STORAGE_KEY, null)
    } catch (error) {
        logger.error('Failed to load cached background:', error)
        return null
    }
}

/**
 * Save background data to chrome.storage.local
 */
async function saveBackground(data: UnsplashBackground): Promise<void> {
    try {
        await storageAdapter.set(STORAGE_KEY, data)
    } catch (error) {
        logger.error('Failed to save background:', error)
    }
}

/**
 * Fetch a random background image from Unsplash
 */
async function fetchFromUnsplash(
    apiKey: string,
    topic?: string
): Promise<UnsplashBackground> {
    if (!apiKey) {
        throw new Error('Unsplash API key is required')
    }

    const query = topic || getRandomTopic()

    const params = new URLSearchParams({
        query,
        orientation: 'landscape',
        content_filter: 'high',
    })

    const response = await fetch(`${API_URL}?${params}`, {
        headers: {
            Authorization: `Client-ID ${apiKey}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`)
    }

    const photo = (await response.json()) as UnsplashApiResponse

    const photographer: UnsplashPhotographer = {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html,
    }

    return {
        id: photo.id,
        url: photo.urls.regular, // Good quality, reasonable size (~1080px)
        fullUrl: photo.urls.full, // Full resolution if needed
        thumbUrl: photo.urls.small, // For quick preview/preload
        blurHash: photo.blur_hash,
        color: photo.color, // Dominant color for placeholder
        description: photo.description || photo.alt_description,
        photographer,
        unsplashUrl: photo.links.html,
        downloadLocation: photo.links.download_location, // For triggering download count
        fetchDate: getTodayDate(),
        topic: query,
    }
}

/**
 * Trigger download tracking on Unsplash (required by API guidelines)
 */
async function triggerDownloadTracking(
    apiKey: string,
    downloadLocation: string
): Promise<void> {
    if (!downloadLocation || !apiKey) return

    try {
        await fetch(downloadLocation, {
            headers: {
                Authorization: `Client-ID ${apiKey}`,
            },
        })
    } catch (error) {
        // Non-critical, just for Unsplash analytics
        logger.warn('Failed to trigger download tracking:', error)
    }
}

/**
 * Get background image, fetching new one if needed (lazy update)
 * Returns cached version if still valid for today
 */
export async function getBackground(
    apiKey: string
): Promise<UnsplashBackground> {
    const cached = await loadCachedBackground()

    // Return cached if valid for today
    if (cached && cached.fetchDate === getTodayDate()) {
        return cached
    }

    // If no API key and no cache, throw
    if (!apiKey) {
        if (cached) {
            return { ...cached, stale: true }
        }
        throw new Error('Unsplash API key is required')
    }

    // Fetch new background
    try {
        const background = await fetchFromUnsplash(apiKey)
        await saveBackground(background)

        // Trigger download tracking (fire and forget)
        triggerDownloadTracking(apiKey, background.downloadLocation)

        return background
    } catch (error) {
        logger.error('Failed to fetch background:', error)

        // Return stale cache if available, better than nothing
        if (cached) {
            return { ...cached, stale: true }
        }

        throw error
    }
}

/**
 * Force refresh the background image (user requested)
 */
export async function forceRefreshBackground(
    apiKey: string,
    topic?: string
): Promise<UnsplashBackground> {
    const background = await fetchFromUnsplash(apiKey, topic)
    await saveBackground(background)

    // Trigger download tracking
    triggerDownloadTracking(apiKey, background.downloadLocation)

    return background
}
