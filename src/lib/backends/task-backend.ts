// Base class for task backend implementations
// Defines the interface that all backends must implement

import type { TaskBackendConfig, EnrichedTask } from '../types'

export interface TaskData {
    timestamp?: number
    [key: string]: unknown
}

abstract class TaskBackend {
    protected config: TaskBackendConfig
    protected data: TaskData = {}
    protected cacheExpiry = 0

    constructor(config: TaskBackendConfig) {
        if (new.target === TaskBackend) {
            throw new Error('TaskBackend is an abstract class')
        }
        this.config = config
    }

    /**
     * Synchronize tasks with the backend
     */
    abstract sync(resourceTypes?: string[]): Promise<void>

    /**
     * Get all tasks, filtered and sorted
     */
    abstract getTasks(): EnrichedTask[]

    /**
     * Add a new task
     */
    abstract addTask(content: string, due: string | null): Promise<void>

    /**
     * Mark a task as complete
     */
    abstract completeTask(taskId: string): Promise<void>

    /**
     * Mark a task as incomplete
     */
    abstract uncompleteTask(taskId: string): Promise<void>

    /**
     * Delete a task
     */
    abstract deleteTask(taskId: string): Promise<void>

    /**
     * Clear all local data/cache
     */
    abstract clearLocalData(): void

    /**
     * Sort tasks: unchecked first, then by completion time, due date, project
     */
    static sortTasks(tasks: EnrichedTask[]): EnrichedTask[] {
        return tasks.sort((a, b) => {
            // Unchecked tasks first
            if (a.checked !== b.checked) return a.checked ? 1 : -1

            // Checked tasks: sort by completed_at (recent first)
            if (a.checked) {
                if (a.completed_at && b.completed_at) {
                    const diff =
                        new Date(b.completed_at).getTime() -
                        new Date(a.completed_at).getTime()
                    if (diff !== 0) return diff
                }
            }

            // Tasks with due dates first
            if (!a.due_date && b.due_date) return 1
            if (a.due_date && !b.due_date) return -1

            // Sort by due date (earliest first)
            if (a.due_date && b.due_date) {
                const diff = a.due_date.getTime() - b.due_date.getTime()
                if (diff !== 0) return diff
            }

            // If both have no due dates, non-project tasks come first
            if (!a.due_date && !b.due_date) {
                const aHasProject = a.project_id && a.project_name !== 'Inbox'
                const bHasProject = b.project_id && b.project_name !== 'Inbox'

                if (aHasProject !== bHasProject) {
                    return aHasProject ? 1 : -1
                }
            }

            return a.child_order - b.child_order
        })
    }

    /**
     * Check if cache is stale (default implementation)
     * Subclasses should set this.data.timestamp and this.cacheExpiry
     */
    isCacheStale(): boolean {
        if (!this.data?.timestamp) return true
        return Date.now() - this.data.timestamp >= (this.cacheExpiry || 0)
    }

    /**
     * Invalidate cache to force fresh sync
     */
    invalidateCache(): void {
        if (this.data) {
            this.data.timestamp = 0
        }
    }

    /**
     * Get project name by ID
     */
    getProjectName(_projectId: string): string {
        return ''
    }

    /**
     * Get label names by IDs
     */
    getLabelNames(_labelIds: string[]): string[] {
        return []
    }
}

export default TaskBackend
