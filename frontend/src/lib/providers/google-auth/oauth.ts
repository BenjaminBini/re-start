/**
 * Google OAuth flow management using chrome.identity API
 * Handles sign in, sign out, and session restoration
 */

import { SCOPES_KEY } from './constants'
import { log, logWarn, logError } from './logger'
import type { AuthCallbackResult } from './types'
import { getUserEmail, storeTokens, clearTokens } from './storage'
import { setAuthenticated, setUnauthenticated } from './auth-state'
import { validateToken } from './token'
import { localStorage as storage } from '../../storage-adapter'

// OAuth scopes from manifest.json
const OAUTH_SCOPES = [
    'https://www.googleapis.com/auth/tasks',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
]

/**
 * Handle OAuth callback parameters from URL
 * Note: With chrome.identity, this is no longer needed but kept for backward compatibility
 * @deprecated No longer used with chrome.identity API
 */
export function handleAuthCallback(): AuthCallbackResult | null {
    log('handleAuthCallback called (no-op with chrome.identity)')
    return null
}

/**
 * Sign in using chrome.identity.getAuthToken()
 */
export async function signIn(): Promise<void> {
    log('Starting sign in flow with chrome.identity')

    try {
        // Request auth token from Chrome
        const token = await chrome.identity.getAuthToken({
            interactive: true,
            scopes: OAUTH_SCOPES,
        })

        if (!token) {
            throw new Error('No token returned from chrome.identity')
        }

        log('Successfully obtained token from chrome.identity')

        // Validate token and get user email
        const tokenInfo = await fetch(
            'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' +
                token
        )

        if (!tokenInfo.ok) {
            throw new Error('Failed to validate token')
        }

        const data = await tokenInfo.json()

        // Store granted scopes
        if (data.scope) {
            await storage.set(SCOPES_KEY, data.scope)
            log('Token is valid, scopes:', data.scope)
        }

        // Get user email
        let email = null
        try {
            const userInfoResponse = await fetch(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            if (userInfoResponse.ok) {
                const userInfo = await userInfoResponse.json()
                email = userInfo.email
            }
        } catch (e) {
            logWarn('Failed to fetch user email:', e)
        }

        // Store tokens (expires_in estimated at 3600 seconds for chrome.identity tokens)
        await storeTokens(token, '3600', email)
        setAuthenticated(email)
        log('Sign in complete, user:', email)
    } catch (error) {
        logError('Sign in failed:', error)
        setUnauthenticated()
        throw error
    }
}

/**
 * Sign out - revoke tokens using chrome.identity.removeCachedAuthToken()
 */
export async function signOut(): Promise<void> {
    log('Signing out user')

    try {
        // Get current token to revoke
        const token = await chrome.identity.getAuthToken({ interactive: false })

        if (token) {
            // Remove cached token
            await chrome.identity.removeCachedAuthToken({ token })
            log('Token removed from chrome.identity cache')

            // Optionally clear all cached tokens
            try {
                await chrome.identity.clearAllCachedAuthTokens()
                log('All cached tokens cleared')
            } catch (e) {
                logWarn('Failed to clear all cached tokens:', e)
            }
        }
    } catch (e) {
        logWarn('Failed to get/revoke token from chrome.identity:', e)
    }

    // Clear local storage
    await clearTokens()
    setUnauthenticated()
    log('Sign out complete')
}

/**
 * Try to restore a previous session using chrome.identity
 * Call this on page load when settings indicate user was signed in
 * Returns true if session was restored, false otherwise
 */
export async function tryRestoreSession(): Promise<boolean> {
    log('Attempting to restore session...')

    try {
        // Try to get token silently (non-interactive)
        const token = await chrome.identity.getAuthToken({ interactive: false })

        if (!token) {
            log('No token available from chrome.identity')
            setUnauthenticated()
            return false
        }

        log('Token obtained from chrome.identity')

        // Validate token with Google
        const tokenValid = await validateToken(token)

        if (!tokenValid) {
            log('Token validation failed')
            setUnauthenticated()
            return false
        }

        // Get user email
        const email = await getUserEmail()

        // Store token with estimated expiry
        await storeTokens(token, '3600', email)
        setAuthenticated(email)

        log('Session restored successfully')
        return true
    } catch (error) {
        logError('Session restore failed:', error)
        setUnauthenticated()
        return false
    }
}
