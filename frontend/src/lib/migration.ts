/**
 * Data migration utility for localStorage to chrome.storage transition
 * Handles one-time migration of existing user data to extension storage
 */

import { createLogger } from './logger'
import { syncStorage, localStorage as chromeLocalStorage } from './storage-adapter'
import { ValidationError } from './errors'

const logger = createLogger('Migration')

/**
 * Migration flag key in chrome.storage.local
 * Used to track whether migration has already been completed
 */
const MIGRATION_COMPLETED_KEY = 'migration_completed'

/**
 * Migration metadata stored in chrome.storage.local
 */
interface MigrationMetadata {
    completed: boolean
    version: string
    timestamp: number
    migratedKeys: string[]
}

/**
 * localStorage keys that should be migrated to chrome.storage.sync
 * These are settings and preferences that should sync across devices
 */
const SYNC_STORAGE_KEYS = ['settings']

/**
 * localStorage keys that should be migrated to chrome.storage.local
 * These are larger data items that should remain device-specific
 */
const LOCAL_STORAGE_KEYS = [
    'local_tasks',
    'weather_data',
    'unsplash_background',
    'google_oauth_token',
    'google_oauth_token_expiry',
    'google_user_email',
    'google_user_id',
    'google_oauth_scopes',
]

/**
 * Check if migration has already been completed
 * @returns Promise resolving to true if migration was already done
 */
export async function isMigrationCompleted(): Promise<boolean> {
    try {
        const metadata = await chromeLocalStorage.get<MigrationMetadata | null>(
            MIGRATION_COMPLETED_KEY,
            null
        )
        return metadata?.completed ?? false
    } catch (error) {
        logger.error('Failed to check migration status:', error)
        // If we can't check, assume not completed to be safe
        return false
    }
}

/**
 * Migrate data from localStorage to chrome.storage
 * This is a one-time operation that runs on first extension load
 *
 * **Migration Strategy:**
 * - Settings → chrome.storage.sync (cross-device sync)
 * - Tasks, cache, auth data → chrome.storage.local (device-specific)
 * - Handles missing keys gracefully (no data to migrate)
 * - Handles parse errors gracefully (logs error, continues)
 * - Sets migration flag to prevent re-runs
 *
 * @returns Promise resolving to migration metadata
 * @throws ValidationError if migration fails critically
 *
 * @example
 * ```ts
 * // In main.ts or App.svelte initialization
 * if (!(await isMigrationCompleted())) {
 *   await migrateLocalStorageToChrome()
 * }
 * ```
 */
export async function migrateLocalStorageToChrome(): Promise<MigrationMetadata> {
    logger.log('Starting data migration from localStorage to chrome.storage...')

    const migratedKeys: string[] = []
    const errors: { key: string; error: string }[] = []

    try {
        // Check if window.localStorage is available
        if (typeof localStorage === 'undefined') {
            logger.warn('localStorage not available, skipping migration')
            return createMigrationMetadata(migratedKeys)
        }

        // Migrate sync storage keys (settings)
        logger.log('Migrating sync storage keys:', SYNC_STORAGE_KEYS)
        for (const key of SYNC_STORAGE_KEYS) {
            try {
                const value = localStorage.getItem(key)
                if (value !== null) {
                    // Parse and validate JSON before storing
                    const parsed = JSON.parse(value)
                    await syncStorage.set(key, parsed)
                    migratedKeys.push(key)
                    logger.log(`✓ Migrated ${key} to chrome.storage.sync`)
                } else {
                    logger.log(`- Skipped ${key} (not found in localStorage)`)
                }
            } catch (error) {
                const errorMsg =
                    error instanceof Error ? error.message : String(error)
                logger.error(`✗ Failed to migrate ${key}:`, error)
                errors.push({ key, error: errorMsg })
                // Continue with other keys even if one fails
            }
        }

        // Migrate local storage keys (tasks, cache, auth data)
        logger.log('Migrating local storage keys:', LOCAL_STORAGE_KEYS)
        for (const key of LOCAL_STORAGE_KEYS) {
            try {
                const value = localStorage.getItem(key)
                if (value !== null) {
                    // For non-JSON values (like plain strings), store as-is
                    // For JSON values, parse and store
                    let parsed: unknown
                    try {
                        parsed = JSON.parse(value)
                    } catch {
                        // If parse fails, store as string
                        parsed = value
                    }
                    await chromeLocalStorage.set(key, parsed)
                    migratedKeys.push(key)
                    logger.log(`✓ Migrated ${key} to chrome.storage.local`)
                } else {
                    logger.log(`- Skipped ${key} (not found in localStorage)`)
                }
            } catch (error) {
                const errorMsg =
                    error instanceof Error ? error.message : String(error)
                logger.error(`✗ Failed to migrate ${key}:`, error)
                errors.push({ key, error: errorMsg })
                // Continue with other keys even if one fails
            }
        }

        // Log migration summary
        logger.log(`Migration summary:`)
        logger.log(`- Successfully migrated: ${migratedKeys.length} keys`)
        logger.log(`- Failed: ${errors.length} keys`)
        if (errors.length > 0) {
            logger.warn('Migration errors:', errors)
        }

        // Mark migration as completed
        const metadata = createMigrationMetadata(migratedKeys)
        await chromeLocalStorage.set(MIGRATION_COMPLETED_KEY, metadata)
        logger.log('Migration completed successfully')

        return metadata
    } catch (error) {
        logger.error('Critical migration failure:', error)
        throw ValidationError.parseError(
            'Data migration failed',
            error instanceof Error ? error : undefined
        )
    }
}

/**
 * Create migration metadata object
 * @param migratedKeys - List of keys that were successfully migrated
 * @returns Migration metadata object
 */
function createMigrationMetadata(migratedKeys: string[]): MigrationMetadata {
    return {
        completed: true,
        version: '2.0.0', // Extension version
        timestamp: Date.now(),
        migratedKeys,
    }
}

/**
 * Clear localStorage after successful migration (optional)
 * This is useful to free up localStorage space after migration
 * Only call this after verifying migration was successful
 *
 * @warning This will delete ALL data from localStorage
 * @returns Promise resolving when localStorage is cleared
 *
 * @example
 * ```ts
 * // After successful migration and verification
 * await migrateLocalStorageToChrome()
 * // Verify data in chrome.storage
 * await clearLocalStorageAfterMigration()
 * ```
 */
export async function clearLocalStorageAfterMigration(): Promise<void> {
    try {
        // Verify migration was completed before clearing
        const isCompleted = await isMigrationCompleted()
        if (!isCompleted) {
            logger.warn(
                'Migration not completed, skipping localStorage clear'
            )
            return
        }

        logger.log('Clearing localStorage after successful migration...')

        // Clear all migrated keys from localStorage
        const allKeys = [...SYNC_STORAGE_KEYS, ...LOCAL_STORAGE_KEYS]
        for (const key of allKeys) {
            try {
                localStorage.removeItem(key)
                logger.log(`✓ Cleared ${key} from localStorage`)
            } catch (error) {
                logger.warn(`Failed to clear ${key}:`, error)
                // Continue even if one clear fails
            }
        }

        logger.log('localStorage cleanup completed')
    } catch (error) {
        logger.error('Failed to clear localStorage:', error)
        // Don't throw - clearing is optional cleanup
    }
}

/**
 * Reset migration flag (for testing only)
 * This allows re-running migration for testing purposes
 *
 * @warning DO NOT use in production code
 */
export async function resetMigrationFlag(): Promise<void> {
    try {
        await chromeLocalStorage.remove(MIGRATION_COMPLETED_KEY)
        logger.log('Migration flag reset')
    } catch (error) {
        logger.error('Failed to reset migration flag:', error)
    }
}
