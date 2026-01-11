/**
 * Google OAuth token operations
 * Handles token validation, expiration checks, and token refresh
 */

import { TOKEN_EXPIRY_KEY, REFRESH_BUFFER_MS, SCOPES_KEY } from './constants'
import { log, logWarn, logError } from './logger'
import type { TokenInfo } from './types'
import { storeTokens, clearTokens, getUserEmail } from './storage'
import { setAuthenticated, setUnauthenticated } from './auth-state'
import { localStorage as storage } from '../../storage-adapter'

/**
 * Check if the current token is expired
 */
export async function isTokenExpired(): Promise<boolean> {
    const expiry = await storage.get<string | null>(TOKEN_EXPIRY_KEY, null)
    if (!expiry) return true
    return Date.now() > parseInt(expiry, 10)
}

/**
 * Check if token needs refresh (expired or expiring soon)
 */
export async function needsRefresh(): Promise<boolean> {
    const expiry = await storage.get<string | null>(TOKEN_EXPIRY_KEY, null)
    if (!expiry) return true
    return Date.now() > parseInt(expiry, 10) - REFRESH_BUFFER_MS
}

/**
 * Validate token by making a test API call to Google
 * Returns true if token is valid, false otherwise
 * Also stores granted scopes
 */
export async function validateToken(token: string): Promise<boolean> {
    if (!token) return false

    try {
        log('Validating token with Google API...')
        const response = await fetch(
            'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' +
                token
        )

        if (response.ok) {
            const data = (await response.json()) as TokenInfo
            // Store granted scopes
            if (data.scope) {
                await storage.set(SCOPES_KEY, data.scope)
                log('Token is valid, scopes:', data.scope)
            } else {
                log('Token is valid')
            }
            return true
        } else {
            const data = (await response.json()) as TokenInfo
            logWarn('Token validation failed:', data.error || response.status)
            return false
        }
    } catch (error) {
        logError('Token validation error:', (error as Error).message)
        return false
    }
}

/**
 * Refresh access token using chrome.identity
 */
export async function refreshToken(): Promise<string> {
    log('Refreshing token via chrome.identity')

    try {
        // Get token silently (non-interactive)
        const token = await chrome.identity.getAuthToken({ interactive: false })

        if (!token) {
            logError('No token returned from chrome.identity')
            await clearTokens()
            setUnauthenticated()
            throw new Error('Session expired. Please sign in again.')
        }

        log('Token refreshed successfully')

        // Validate token and get user email
        const email = await getUserEmail()

        // Store token with estimated expiry (chrome.identity tokens typically last 3600 seconds)
        await storeTokens(token, '3600', email)
        setAuthenticated(email)

        return token
    } catch (error) {
        logError('Token refresh failed:', error)
        await clearTokens()
        setUnauthenticated()
        throw new Error('Session expired. Please sign in again.')
    }
}

/**
 * Ensure we have a valid access token, refreshing if needed
 */
export async function ensureValidToken(): Promise<string> {
    // Try to get token from chrome.identity first
    try {
        const token = await chrome.identity.getAuthToken({ interactive: false })

        if (!token) {
            logError('No token available from chrome.identity')
            throw new Error('Not signed in')
        }

        const expired = await isTokenExpired()
        const needs = await needsRefresh()

        log('ensureValidToken check:', {
            hasToken: !!token,
            isExpired: expired,
            needsRefresh: needs,
        })

        // If token needs refresh, refresh it
        if (needs) {
            log('Token needs refresh, attempting refresh')
            try {
                return await refreshToken()
            } catch (error) {
                // If refresh fails but token is still valid, use it
                if (!expired) {
                    logWarn(
                        'Refresh failed but token still valid, using existing token'
                    )
                    return token
                }
                logError('Refresh failed and token expired')
                throw error
            }
        }

        log('Token is valid, no refresh needed')
        return token
    } catch (error) {
        logError('ensureValidToken failed:', error)
        throw new Error('Not signed in')
    }
}
