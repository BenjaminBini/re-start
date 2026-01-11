import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { initSettings } from './lib/settings-store.svelte'
import { isMigrationCompleted, migrateLocalStorageToChrome } from './lib/migration'

const target = document.getElementById('app')
if (!target) {
    throw new Error('Could not find app mount target')
}

/**
 * Initialize the application with data migration support
 * 1. Check if migration from localStorage to chrome.storage has been completed
 * 2. If not, run one-time migration
 * 3. Initialize settings from chrome.storage.sync
 * 4. Mount the app
 */
async function initializeApp() {
    try {
        // Check if migration is needed
        const migrationCompleted = await isMigrationCompleted()

        if (!migrationCompleted) {
            console.log('[re-start] First-time load detected, migrating data from localStorage to chrome.storage...')
            await migrateLocalStorageToChrome()
            console.log('[re-start] Migration completed successfully')
        } else {
            console.log('[re-start] Migration already completed, skipping')
        }

        // Initialize settings from chrome.storage.sync
        await initSettings()

        // Mount the app
        const app = mount(App, { target })

        // Export app for hot module replacement
        if (import.meta.hot) {
            import.meta.hot.accept()
        }

        return app
    } catch (error) {
        console.error('[re-start] Failed to initialize app:', error)
        // Show error to user
        if (target) {
            target.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    font-family: monospace;
                    color: #ff4444;
                    padding: 2rem;
                    text-align: center;
                ">
                    <div>
                        <h1>Initialization Error</h1>
                        <p>Failed to initialize re-start extension.</p>
                        <p style="color: #888; font-size: 0.9em; margin-top: 1rem;">
                            Check the console for details.
                        </p>
                    </div>
                </div>
            `
        }
        throw error
    }
}

// Start the application
initializeApp()
