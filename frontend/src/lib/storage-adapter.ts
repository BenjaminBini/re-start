/**
 * Chrome storage adapter for browser extension storage APIs
 * Provides abstraction over chrome.storage.sync and chrome.storage.local
 * with type-safe operations, error handling, and change listeners
 */

import { createLogger } from './logger'
import { ValidationError } from './errors'

const logger = createLogger('StorageAdapter')

/**
 * Callback function for storage change events
 * @param changes - Object mapping storage keys to their old/new values
 * @param areaName - Storage area that changed ('sync' or 'local')
 */
export type StorageChangeCallback = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
) => void

/**
 * Error thrown when storage quota is exceeded
 * Chrome storage limits:
 * - chrome.storage.sync: 100KB total, 8KB per item, 512 items max
 * - chrome.storage.local: 10MB default (unlimitedStorage permission for more)
 */
export class StorageQuotaError extends Error {
    constructor(message: string, public readonly areaName: 'sync' | 'local') {
        super(message)
        this.name = 'StorageQuotaError'
    }
}

/**
 * Storage adapter interface for chrome.storage operations
 * Provides type-safe, async access to extension storage with error handling
 */
export interface StorageAdapter {
    /**
     * Get a value from storage with type safety and default fallback
     * @param key - Storage key to retrieve
     * @param defaultValue - Value to return if key doesn't exist
     * @returns Promise resolving to stored value or default
     *
     * @example
     * ```ts
     * const settings = await storage.get('settings', {})
     * const tasks = await storage.get<Task[]>('tasks', [])
     * ```
     */
    get<T>(key: string, defaultValue: T): Promise<T>

    /**
     * Set a value in storage
     * @param key - Storage key to set
     * @param value - Value to store (must be JSON-serializable)
     * @throws StorageQuotaError if quota exceeded
     *
     * @example
     * ```ts
     * await storage.set('settings', { theme: 'dark' })
     * await storage.set('tasks', taskList)
     * ```
     */
    set(key: string, value: unknown): Promise<void>

    /**
     * Remove a key from storage
     * @param key - Storage key to remove
     *
     * @example
     * ```ts
     * await storage.remove('cache')
     * ```
     */
    remove(key: string): Promise<void>

    /**
     * Clear all data from this storage area
     * @warning This will delete ALL data in the storage area
     *
     * @example
     * ```ts
     * await storage.clear()
     * ```
     */
    clear(): Promise<void>

    /**
     * Register a listener for storage changes
     * @param callback - Function called when storage changes
     * @returns Cleanup function to remove the listener
     *
     * @example
     * ```ts
     * const unsubscribe = storage.onChange((changes, areaName) => {
     *   if (changes.settings) {
     *     console.log('Settings changed:', changes.settings.newValue)
     *   }
     * })
     *
     * // Later: unsubscribe()
     * ```
     */
    onChange(callback: StorageChangeCallback): () => void
}

/**
 * Create a storage adapter for the specified chrome.storage area
 * @param areaName - Storage area to use ('sync' or 'local')
 * @returns StorageAdapter instance for the specified area
 *
 * **Storage Area Guidelines:**
 * - **sync**: Use for settings and preferences (syncs across devices, 100KB limit)
 * - **local**: Use for large data like tasks and cache (10MB default, device-specific)
 *
 * **Storage Limits:**
 * - **chrome.storage.sync**: 100KB total, 8KB per item, 512 items max
 * - **chrome.storage.local**: 10MB default (request unlimitedStorage for more)
 *
 * @example
 * ```ts
 * // For settings (cross-device sync)
 * const settingsStorage = createStorageAdapter('sync')
 * await settingsStorage.set('theme', 'dark')
 *
 * // For task data (device-specific, larger storage)
 * const taskStorage = createStorageAdapter('local')
 * await taskStorage.set('tasks', taskList)
 * ```
 */
export function createStorageAdapter(
    areaName: 'sync' | 'local'
): StorageAdapter {
    const storageArea =
        areaName === 'sync' ? chrome.storage.sync : chrome.storage.local

    /**
     * Handle storage errors and convert to appropriate error types
     */
    function handleStorageError(error: unknown, operation: string): never {
        logger.error(`${operation} failed:`, error)

        // Check if it's a quota error
        if (error instanceof Error) {
            if (
                error.message.includes('QUOTA_BYTES') ||
                error.message.includes('quota')
            ) {
                const quotaLimit =
                    areaName === 'sync' ? '100KB' : '10MB (default)'
                throw new StorageQuotaError(
                    `Storage quota exceeded for chrome.storage.${areaName}. Limit: ${quotaLimit}`,
                    areaName
                )
            }

            // Re-throw validation errors as-is
            if (error instanceof ValidationError) {
                throw error
            }
        }

        // Wrap unknown errors
        throw ValidationError.parseError(
            `Storage operation failed: ${operation}`,
            error instanceof Error ? error : undefined
        )
    }

    return {
        async get<T>(key: string, defaultValue: T): Promise<T> {
            try {
                const result = await storageArea.get(key)
                return result[key] !== undefined ? result[key] : defaultValue
            } catch (error) {
                handleStorageError(error, `get(${key})`)
            }
        },

        async set(key: string, value: unknown): Promise<void> {
            try {
                await storageArea.set({ [key]: value })
            } catch (error) {
                handleStorageError(error, `set(${key})`)
            }
        },

        async remove(key: string): Promise<void> {
            try {
                await storageArea.remove(key)
            } catch (error) {
                handleStorageError(error, `remove(${key})`)
            }
        },

        async clear(): Promise<void> {
            try {
                logger.warn(`Clearing all data from chrome.storage.${areaName}`)
                await storageArea.clear()
            } catch (error) {
                handleStorageError(error, 'clear()')
            }
        },

        onChange(callback: StorageChangeCallback): () => void {
            const listener = (
                changes: { [key: string]: chrome.storage.StorageChange },
                changedAreaName: string
            ) => {
                // Only trigger callback for changes in this storage area
                if (changedAreaName === areaName) {
                    callback(changes, changedAreaName)
                }
            }

            chrome.storage.onChanged.addListener(listener)

            // Return cleanup function
            return () => {
                chrome.storage.onChanged.removeListener(listener)
            }
        },
    }
}

/**
 * Pre-configured storage adapter for settings (chrome.storage.sync)
 * Use this for user preferences that should sync across devices
 *
 * **Storage limits:** 100KB total, 8KB per item, 512 items max
 *
 * @example
 * ```ts
 * import { syncStorage } from './storage-adapter'
 *
 * const settings = await syncStorage.get('settings', {})
 * await syncStorage.set('settings', updatedSettings)
 * ```
 */
export const syncStorage = createStorageAdapter('sync')

/**
 * Pre-configured storage adapter for local data (chrome.storage.local)
 * Use this for large data like tasks, cache, and temporary data
 *
 * **Storage limits:** 10MB default (unlimitedStorage permission for more)
 *
 * @example
 * ```ts
 * import { localStorage } from './storage-adapter'
 *
 * const tasks = await localStorage.get('tasks', [])
 * await localStorage.set('tasks', updatedTasks)
 * ```
 */
export const localStorage = createStorageAdapter('local')
