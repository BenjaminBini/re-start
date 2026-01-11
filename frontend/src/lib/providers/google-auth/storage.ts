/**
 * Google OAuth chrome.storage.local operations
 * Handles token storage, retrieval, and scope management
 */

import { generateUUID } from '../../uuid'
import { localStorage as storage } from '../../storage-adapter'
import {
    TOKEN_KEY,
    TOKEN_EXPIRY_KEY,
    USER_EMAIL_KEY,
    USER_ID_KEY,
    SCOPES_KEY,
    MEET_SCOPE,
} from './constants'
import { log } from './logger'

/**
 * Get or create a unique user ID for this browser
 */
export async function getUserId(): Promise<string> {
    let userId = await storage.get<string | null>(USER_ID_KEY, null)
    if (!userId) {
        userId = generateUUID()
        await storage.set(USER_ID_KEY, userId)
        log('Created new user ID:', userId)
    }
    return userId
}

/**
 * Get the current access token
 */
export async function getAccessToken(): Promise<string | null> {
    return await storage.get<string | null>(TOKEN_KEY, null)
}

/**
 * Get user email
 */
export async function getUserEmail(): Promise<string | null> {
    return await storage.get<string | null>(USER_EMAIL_KEY, null)
}

/**
 * Check if there's a stored user ID (indicates previous sign-in attempt)
 */
export async function hasStoredUserId(): Promise<boolean> {
    const userId = await storage.get<string | null>(USER_ID_KEY, null)
    return !!userId
}

/**
 * Store tokens in chrome.storage.local
 * Note: Caller is responsible for updating auth state
 */
export async function storeTokens(
    accessToken: string,
    expiresIn: string | null,
    email: string | null = null
): Promise<void> {
    await storage.set(TOKEN_KEY, accessToken)

    const expiresInMs = (parseInt(expiresIn || '3600', 10) || 3600) * 1000
    const expiryTime = Date.now() + expiresInMs
    await storage.set(TOKEN_EXPIRY_KEY, expiryTime.toString())

    if (email) {
        await storage.set(USER_EMAIL_KEY, email)
    }

    const expiresInMin = Math.round(expiresInMs / 60000)
    log('Tokens stored', {
        email,
        expiresIn: `${expiresInMin} minutes`,
        expiryTime: new Date(expiryTime).toISOString(),
    })
}

/**
 * Clear all stored tokens
 * Note: Caller is responsible for updating auth state
 */
export async function clearTokens(): Promise<void> {
    log('Clearing all tokens from chrome.storage.local')
    await storage.remove(TOKEN_KEY)
    await storage.remove(TOKEN_EXPIRY_KEY)
    await storage.remove(USER_EMAIL_KEY)
    await storage.remove(SCOPES_KEY)
}

/**
 * Check if a specific scope is granted
 */
export async function hasScope(scope: string): Promise<boolean> {
    const scopes = await storage.get<string>(SCOPES_KEY, '')
    return scopes.split(' ').includes(scope)
}

/**
 * Check if Meet scope is granted
 */
export async function hasMeetScope(): Promise<boolean> {
    return await hasScope(MEET_SCOPE)
}

/**
 * Migrate from old storage keys to new ones
 */
export async function migrateStorageKeys(): Promise<void> {
    const oldTokenKey = 'google_tasks_token'
    const oldExpiryKey = 'google_tasks_token_expiry'

    const oldToken = await storage.get<string | null>(oldTokenKey, null)
    const currentToken = await storage.get<string | null>(TOKEN_KEY, null)
    if (oldToken && !currentToken) {
        await storage.set(TOKEN_KEY, oldToken)
        await storage.remove(oldTokenKey)
    }

    const oldExpiry = await storage.get<string | null>(oldExpiryKey, null)
    const currentExpiry = await storage.get<string | null>(TOKEN_EXPIRY_KEY, null)
    if (oldExpiry && !currentExpiry) {
        await storage.set(TOKEN_EXPIRY_KEY, oldExpiry)
        await storage.remove(oldExpiryKey)
    }
}
