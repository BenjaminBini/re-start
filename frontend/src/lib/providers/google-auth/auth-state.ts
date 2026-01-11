/**
 * Google OAuth auth state management
 * Handles authentication status tracking and state updates
 */

import { get } from 'svelte/store'
import { authStore, AuthStatus } from '../../stores/auth-store'
import { USER_EMAIL_KEY } from './constants'
import { log } from './logger'
import { localStorage as storageAdapter } from '../../storage-adapter'

/**
 * Set authenticated state with user email
 */
export function setAuthenticated(email: string | null): void {
    log('Auth state: authenticated', { email })
    authStore.setAuthenticated(email)
}

/**
 * Set unauthenticated state
 */
export function setUnauthenticated(): void {
    log('Auth state: unauthenticated')
    authStore.setUnauthenticated()
}

/**
 * Initialize auth state on module load
 * Status stays 'unknown' until tryRestoreSession runs
 */
export async function initAuthState(): Promise<void> {
    const email = await storageAdapter.get(USER_EMAIL_KEY, null)
    authStore.setEmail(email)
    log('Initial auth state: unknown', { email })
}

/**
 * Check if authenticated (based on authStore status)
 */
export function isSignedIn(): boolean {
    return get(authStore).status === AuthStatus.Authenticated
}

// Initialize auth state on module load (async, no await needed here)
initAuthState()
