import TaskProvider from './task-provider'
import type {
    TaskProviderConfig,
    EnrichedTask,
    RawTask,
    TaskDue,
} from '../types'
import { generateUUID } from '../uuid'
import { createLogger } from '../logger'
import { ValidationError } from '../errors'
import { localStorage as storageAdapter } from '../storage-adapter'

interface LocalTaskData {
    items: RawTask[]
    [key: string]: unknown
}

// Logger instance for LocalStorage operations
const logger = createLogger('LocalStorage')

/**
 * LocalStorage-based task backend for offline task management
 */
class LocalStorageProvider extends TaskProvider {
    private dataKey: string
    protected override data: LocalTaskData
    private initPromise: Promise<void>

    constructor(config: TaskProviderConfig) {
        super(config)
        this.dataKey = 'local_tasks'
        this.data = { items: [] }
        // Initialize data asynchronously and cache the promise
        this.initPromise = this.loadData()
    }

    /**
     * Load tasks from chrome.storage.local
     * Returns empty data if parsing fails (graceful degradation)
     */
    private async loadData(): Promise<void> {
        try {
            const stored = await storageAdapter.get<LocalTaskData>(this.dataKey, { items: [] })
            this.data = stored
        } catch (error) {
            // Log the storage error with structured warning
            // Use ValidationError for structured error information, but set empty data for graceful recovery
            const parseError = ValidationError.parseError(
                'Failed to load local tasks from storage',
                error instanceof Error ? error : undefined
            )
            logger.error('Error loading local tasks:', {
                error: parseError.message,
                code: parseError.code,
                userMessage: parseError.userMessage,
                originalError: error,
            })
            // Set empty data to allow the app to continue functioning
            // This is preferable to throwing since storage is the source of truth
            // and corrupted data should not break the entire app
            this.data = { items: [] }
        }
    }

    /**
     * Ensure data is loaded before proceeding
     */
    private async ensureInitialized(): Promise<void> {
        await this.initPromise
    }

    /**
     * Save tasks to chrome.storage.local
     */
    private async saveData(): Promise<void> {
        await storageAdapter.set(this.dataKey, this.data)
    }

    /**
     * Check if cache is stale (always false for localStorage - it's the source of truth)
     */
    override isCacheStale(): boolean {
        return false
    }

    /**
     * Invalidate cache (no-op for localStorage - it's the source of truth)
     */
    override invalidateCache(): void {}

    /**
     * Sync method (ensures data is loaded)
     */
    async sync(_resourceTypes?: string[]): Promise<void> {
        // Ensure data is loaded from storage
        await this.ensureInitialized()
    }

    /**
     * Get upcoming tasks and recently completed tasks
     * Note: This is a synchronous method but relies on data loaded in constructor.
     * Callers should await sync() or other async methods first to ensure data is loaded.
     */
    getTasks(): EnrichedTask[] {
        if (!this.data.items) return []

        const mappedTasks = this.data.items
            .filter((item) => {
                if (item.is_deleted) return false
                if (!item.checked) return true
                return TaskProvider.isRecentlyCompleted(item.completed_at)
            })
            .map((item): EnrichedTask => {
                let dueDate: Date | null = null
                let hasTime = false

                if (item.due) {
                    if (item.due.date.includes('T')) {
                        dueDate = new Date(item.due.date)
                        hasTime = true
                    } else {
                        // offset to 23:59:59 if no time is provided
                        dueDate = new Date(item.due.date + 'T23:59:59')
                    }
                }

                return {
                    ...item,
                    project_name: '',
                    label_names: [],
                    due_date: dueDate,
                    has_time: hasTime,
                }
            })

        return TaskProvider.sortTasks(mappedTasks)
    }

    /**
     * Complete a task
     */
    async completeTask(taskId: string): Promise<void> {
        await this.ensureInitialized()
        const task = this.data.items.find((item) => item.id === taskId)
        if (task) {
            task.checked = true
            task.completed_at = new Date().toISOString()
            await this.saveData()
        }
    }

    /**
     * Uncomplete a task (undo completion)
     */
    async uncompleteTask(taskId: string): Promise<void> {
        await this.ensureInitialized()
        const task = this.data.items.find((item) => item.id === taskId)
        if (task) {
            task.checked = false
            task.completed_at = null
            await this.saveData()
        }
    }

    /**
     * Delete a task
     */
    async deleteTask(taskId: string): Promise<void> {
        await this.ensureInitialized()
        const idx = this.data.items.findIndex((item) => item.id === taskId)
        if (idx !== -1) {
            this.data.items.splice(idx, 1)
            await this.saveData()
        }
    }

    /**
     * Add a new task
     */
    async addTask(content: string, due: string | null): Promise<void> {
        await this.ensureInitialized()
        const newDue: TaskDue | null = due ? { date: due } : null
        const newTask: RawTask = {
            id: generateUUID(),
            content: content,
            checked: false,
            completed_at: null,
            due: newDue,
            project_id: null,
            labels: [],
            child_order: this.data.items.length,
            is_deleted: false,
        }

        this.data.items.push(newTask)
        await this.saveData()
    }

    /**
     * Clear local cache (no-op for localStorage backend)
     * Note: Unlike Todoist which clears cache, LocalStorage IS the source of truth.
     * Clearing it would permanently delete user tasks, which is not equivalent behavior.
     * Task deletion should be done explicitly through a separate UI action if needed.
     */
    clearLocalData(): void {}

    /**
     * Get project name by ID (always empty for localStorage)
     */
    override getProjectName(_projectId: string): string {
        return ''
    }

    /**
     * Get label names by IDs (always empty for localStorage)
     */
    override getLabelNames(_labelIds: string[]): string[] {
        return []
    }
}

export default LocalStorageProvider
