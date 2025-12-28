/**
 * Google OAuth module for Web Applications
 * Uses OAuth 2.0 implicit flow with silent refresh via hidden iframe
 * Shared by Google Tasks and Google Calendar backends
 */

// Storage keys
const TOKEN_KEY = 'google_oauth_token'
const TOKEN_EXPIRY_KEY = 'google_oauth_token_expiry'
const USER_EMAIL_KEY = 'google_user_email'

// OAuth configuration - Web application client
const CLIENT_ID = '317653837986-8hsogqkfab632ducq6k0jcpngn1iub6a.apps.googleusercontent.com'
const SCOPES = [
    'https://www.googleapis.com/auth/tasks',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.email'
]

// Token refresh buffer (5 minutes before expiry)
const REFRESH_BUFFER_MS = 5 * 60 * 1000

/**
 * Get the redirect URI based on current location
 */
function getRedirectUri() {
    const basePath = window.location.pathname.replace(/\/[^/]*$/, '')
    return `${window.location.origin}${basePath}/oauth-callback.html`
}

/**
 * Check if the current token is expired
 */
export function isTokenExpired() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiry) return true
    return Date.now() > parseInt(expiry, 10)
}

/**
 * Check if token needs refresh (expired or expiring soon)
 */
export function needsRefresh() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiry) return true
    return Date.now() > parseInt(expiry, 10) - REFRESH_BUFFER_MS
}

/**
 * Get the current access token
 */
export function getAccessToken() {
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * Get user email
 */
export function getUserEmail() {
    return localStorage.getItem(USER_EMAIL_KEY)
}

/**
 * Check if signed in (has valid token)
 */
export function isSignedIn() {
    const token = getAccessToken()
    return !!token && !isTokenExpired()
}

/**
 * Store tokens in localStorage
 */
function storeTokens(accessToken, expiresIn) {
    localStorage.setItem(TOKEN_KEY, accessToken)

    const expiresInMs = (parseInt(expiresIn, 10) || 3600) * 1000
    const expiryTime = Date.now() + expiresInMs
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
}

/**
 * Fetch and store user email
 */
async function fetchUserEmail(accessToken) {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        })

        if (!response.ok) {
            console.error('Failed to fetch user email:', response.status)
            return null
        }

        const data = await response.json()
        localStorage.setItem(USER_EMAIL_KEY, data.email)
        return data.email
    } catch (error) {
        console.error('Error fetching user email:', error)
        return null
    }
}

/**
 * Build OAuth URL for implicit flow
 */
function buildAuthUrl(prompt = 'consent') {
    const state = crypto.randomUUID()
    sessionStorage.setItem('oauth_state', state)

    const authURL = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authURL.searchParams.set('client_id', CLIENT_ID)
    authURL.searchParams.set('redirect_uri', getRedirectUri())
    authURL.searchParams.set('response_type', 'token')
    authURL.searchParams.set('scope', SCOPES.join(' '))
    authURL.searchParams.set('state', state)
    authURL.searchParams.set('include_granted_scopes', 'true')

    if (prompt) {
        authURL.searchParams.set('prompt', prompt)
    }

    return { url: authURL.href, state }
}

/**
 * Silent token refresh using hidden iframe with prompt=none
 */
export function refreshAccessToken() {
    return new Promise((resolve, reject) => {
        const { url, state } = buildAuthUrl('none')

        // Create hidden iframe
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts')

        let timeoutId
        let resolved = false

        const cleanup = () => {
            if (resolved) return
            resolved = true
            clearTimeout(timeoutId)
            window.removeEventListener('message', handleMessage)
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe)
            }
        }

        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return
            if (event.data?.type !== 'oauth-callback') return

            cleanup()

            if (event.data.error) {
                // Silent refresh failed - user needs to sign in again
                reject(new Error(event.data.error_description || event.data.error))
                return
            }

            const { access_token, expires_in, state: returnedState } = event.data
            const savedState = sessionStorage.getItem('oauth_state')
            sessionStorage.removeItem('oauth_state')

            if (returnedState !== savedState) {
                reject(new Error('State mismatch'))
                return
            }

            if (!access_token) {
                reject(new Error('No access token received'))
                return
            }

            storeTokens(access_token, expires_in)
            resolve(access_token)
        }

        window.addEventListener('message', handleMessage)

        // Timeout after 10 seconds
        timeoutId = setTimeout(() => {
            cleanup()
            reject(new Error('Silent refresh timed out'))
        }, 10000)

        document.body.appendChild(iframe)
        iframe.src = url
    })
}

/**
 * Ensure we have a valid access token, refreshing if needed
 */
export async function ensureValidToken() {
    if (!getAccessToken()) {
        throw new Error('Not signed in')
    }

    if (needsRefresh()) {
        try {
            return await refreshAccessToken()
        } catch (error) {
            // Silent refresh failed, token is still valid for a bit
            if (!isTokenExpired()) {
                return getAccessToken()
            }
            throw new Error('Session expired. Please sign in again.')
        }
    }

    return getAccessToken()
}

/**
 * Sign in using popup-based OAuth implicit flow
 */
export async function signIn() {
    const { url, state } = buildAuthUrl('consent')

    return new Promise((resolve, reject) => {
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(
            url,
            'Google Sign In',
            `width=${width},height=${height},left=${left},top=${top},popup=1`
        )

        if (!popup) {
            sessionStorage.removeItem('oauth_state')
            reject(new Error('Popup blocked. Please allow popups for this site.'))
            return
        }

        let checkClosed

        const handleMessage = async (event) => {
            if (event.origin !== window.location.origin) return

            if (event.data?.type === 'oauth-callback') {
                clearInterval(checkClosed)
                window.removeEventListener('message', handleMessage)
                popup.close()

                if (event.data.error) {
                    sessionStorage.removeItem('oauth_state')
                    reject(new Error(event.data.error_description || event.data.error))
                    return
                }

                const { access_token, expires_in, state: returnedState } = event.data
                const savedState = sessionStorage.getItem('oauth_state')
                sessionStorage.removeItem('oauth_state')

                if (returnedState !== savedState) {
                    reject(new Error('State mismatch - possible CSRF attack'))
                    return
                }

                if (!access_token) {
                    reject(new Error('No access token received'))
                    return
                }

                storeTokens(access_token, expires_in)

                // Fetch user email
                await fetchUserEmail(access_token)

                resolve(access_token)
            }
        }

        window.addEventListener('message', handleMessage)

        checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed)
                window.removeEventListener('message', handleMessage)
                sessionStorage.removeItem('oauth_state')
                reject(new Error('Sign in cancelled'))
            }
        }, 500)
    })
}

/**
 * Sign out - clear all tokens
 */
export function signOut() {
    clearTokens()
}

/**
 * Clear all stored tokens
 */
function clearTokens() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    localStorage.removeItem(USER_EMAIL_KEY)
}

/**
 * Migrate from old storage keys (google_tasks_*) to new ones (google_oauth_*)
 */
export function migrateStorageKeys() {
    const oldTokenKey = 'google_tasks_token'
    const oldExpiryKey = 'google_tasks_token_expiry'

    const oldToken = localStorage.getItem(oldTokenKey)
    if (oldToken && !localStorage.getItem(TOKEN_KEY)) {
        localStorage.setItem(TOKEN_KEY, oldToken)
        localStorage.removeItem(oldTokenKey)
    }

    const oldExpiry = localStorage.getItem(oldExpiryKey)
    if (oldExpiry && !localStorage.getItem(TOKEN_EXPIRY_KEY)) {
        localStorage.setItem(TOKEN_EXPIRY_KEY, oldExpiry)
        localStorage.removeItem(oldExpiryKey)
    }
}
