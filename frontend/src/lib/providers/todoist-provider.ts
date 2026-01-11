import TaskProvider from './task-provider'
import type { TaskProviderConfig, EnrichedTask, TaskDue } from '../types'
import { createLogger } from '../logger'
import { NetworkError, AuthError, RateLimitError, ValidationError } from '../errors'
import { localStorage as storageAdapter } from '../storage-adapter'

interface TodoistTask {
    id: string
    content: string
    is_completed: boolean
    completed_at: string | null
    due: TaskDue | null
    project_id: string | null
    labels: string[]
    order: number
}

interface TodoistLabel {
    id: string
    name: string
}

interface TodoistProject {
    id: string
    name: string
}

interface TodoistData {
    tasks: TodoistTask[]
    labels: TodoistLabel[]
    projects: TodoistProject[]
    timestamp?: number
    [key: string]: unknown
}

// Logger instance for Todoist operations
const logger = createLogger('Todoist')

/**
 * Todoist API client using REST API v2
 */
class TodoistProvider extends TaskProvider {
    private token: string
    private baseUrl: string
    private dataKey: string
    protected override data: TodoistData
    protected override cacheExpiry: number
    private dataLoaded: boolean

    constructor(config: TaskProviderConfig) {
        super(config)
        this.token = config.apiToken || ''
        this.baseUrl = 'https://api.todoist.com/rest/v2'
        this.dataKey = 'todoist_data'
        this.cacheExpiry = 5 * 60 * 1000 // 5 minutes

        this.data = { tasks: [], labels: [], projects: [] }
        this.dataLoaded = false
    }

    /**
     * Load stored data from storage
     */
    private async loadStoredData(): Promise<void> {
        if (this.dataLoaded) return

        try {
            // Load cached data
            const stored = await storageAdapter.get<TodoistData | null>(
                this.dataKey,
                null
            )
            if (stored) {
                this.data = {
                    tasks: stored.tasks || [],
                    labels: stored.labels || [],
                    projects: stored.projects || [],
                    timestamp: stored.timestamp,
                }
            }

            this.dataLoaded = true
            logger.log('Loaded Todoist data from storage')
        } catch (error) {
            logger.warn('Failed to load stored Todoist data, using empty state:', error)
            this.data = { tasks: [], labels: [], projects: [] }
            this.dataLoaded = true
        }
    }

    /**
     * Fetch tasks and related data from REST API v2
     */
    async sync(): Promise<void> {
        // Load stored data on first sync
        await this.loadStoredData()

        try {
            logger.log('Syncing with Todoist REST API v2')

            // Fetch all resources in parallel
            const [tasksResponse, projectsResponse, labelsResponse] = await Promise.all([
                this.fetchWithAuth('/tasks'),
                this.fetchWithAuth('/projects'),
                this.fetchWithAuth('/labels'),
            ])

            // Parse all responses
            const tasks = (await tasksResponse.json()) as TodoistTask[]
            const projects = (await projectsResponse.json()) as TodoistProject[]
            const labels = (await labelsResponse.json()) as TodoistLabel[]

            // Update local data
            this.data = {
                tasks,
                labels,
                projects,
                timestamp: Date.now(),
            }

            // Save to storage
            await storageAdapter.set(this.dataKey, this.data)

            logger.log('Todoist sync successful:', {
                tasks: tasks.length,
                labels: labels.length,
                projects: projects.length,
            })
        } catch (error) {
            // Re-throw BackendError instances as-is
            if (
                error instanceof AuthError ||
                error instanceof RateLimitError ||
                error instanceof NetworkError ||
                error instanceof ValidationError
            ) {
                throw error
            }

            // Wrap unknown errors
            logger.error('Todoist sync failed:', error)
            throw this.wrapError(error, 'Todoist sync')
        }
    }

    /**
     * Helper method to perform authenticated fetch requests
     */
    private async fetchWithAuth(endpoint: string, options?: RequestInit): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            })

            if (!response.ok) {
                // Classify HTTP errors properly
                if (response.status === 401 || response.status === 403) {
                    logger.error('Todoist authentication failed:', response.status)
                    throw AuthError.unauthorized(
                        `Todoist API authentication failed: ${response.status}`
                    )
                }

                if (response.status === 429) {
                    logger.warn('Todoist rate limit exceeded')
                    const retryAfter = response.headers.get('Retry-After')
                    throw RateLimitError.fromHeader(
                        retryAfter,
                        'Todoist rate limit exceeded'
                    )
                }

                // Validation errors (4xx)
                if (response.status >= 400 && response.status < 500) {
                    logger.error('Todoist request failed:', {
                        status: response.status,
                        statusText: response.statusText,
                    })
                    throw ValidationError.invalidResponse(
                        `Todoist API request failed: ${response.status} ${response.statusText}`
                    )
                }

                // Network/server errors (5xx)
                logger.error('Todoist request failed:', {
                    status: response.status,
                    statusText: response.statusText,
                })
                throw NetworkError.fromResponse(response)
            }

            return response
        } catch (error) {
            // Re-throw BackendError instances
            if (error instanceof AuthError || error instanceof RateLimitError ||
                error instanceof NetworkError || error instanceof ValidationError) {
                throw error
            }

            // Wrap other fetch errors
            logger.error('Todoist fetch failed:', error)
            throw this.wrapError(error, 'Todoist fetch')
        }
    }

    /**
     * Get active tasks and recently completed tasks
     */
    getTasks(): EnrichedTask[] {
        if (!this.data.tasks) return []

        const mappedTasks = this.data.tasks
            .filter((task) => {
                // Show active tasks and recently completed tasks
                if (!task.is_completed) return true
                return TaskProvider.isRecentlyCompleted(task.completed_at)
            })
            .map((task): EnrichedTask => {
                let dueDate: Date | null = null
                let hasTime = false

                if (task.due) {
                    if (task.due.date.includes('T')) {
                        dueDate = new Date(task.due.date)
                        hasTime = true
                    } else {
                        // offset to 23:59:59 if no time is provided
                        dueDate = new Date(task.due.date + 'T23:59:59')
                    }
                }

                return {
                    id: task.id,
                    content: task.content,
                    checked: task.is_completed,
                    completed_at: task.completed_at,
                    due: task.due,
                    project_id: task.project_id,
                    labels: task.labels,
                    child_order: task.order,
                    project_name: this.getProjectName(task.project_id || ''),
                    label_names: this.getLabelNames(task.labels),
                    due_date: dueDate,
                    has_time: hasTime,
                }
            })

        return TaskProvider.sortTasks(mappedTasks)
    }

    /**
     * Get project name by ID
     */
    override getProjectName(projectId: string): string {
        return this.data.projects?.find((p) => p.id === projectId)?.name || ''
    }

    /**
     * Get label names by label IDs
     */
    override getLabelNames(labelIds: string[]): string[] {
        if (!labelIds || !this.data.labels) return []
        return labelIds
            .map((id) => this.data.labels.find((l) => l.id === id)?.name)
            .filter((name): name is string => Boolean(name))
    }

    /**
     * Complete a task
     */
    async completeTask(taskId: string): Promise<void> {
        try {
            logger.log('Completing task:', taskId)
            await this.fetchWithAuth(`/tasks/${taskId}/close`, {
                method: 'POST',
            })
            logger.log('Task completed successfully')
        } catch (error) {
            // Re-throw BackendError instances as-is
            if (
                error instanceof AuthError ||
                error instanceof RateLimitError ||
                error instanceof NetworkError ||
                error instanceof ValidationError
            ) {
                throw error
            }

            // Wrap unknown errors
            logger.error('Complete task failed:', error)
            throw this.wrapError(error, 'Complete task')
        }
    }

    /**
     * Uncomplete a task (reopen)
     */
    async uncompleteTask(taskId: string): Promise<void> {
        try {
            logger.log('Uncompleting task:', taskId)
            await this.fetchWithAuth(`/tasks/${taskId}/reopen`, {
                method: 'POST',
            })
            logger.log('Task reopened successfully')
        } catch (error) {
            // Re-throw BackendError instances as-is
            if (
                error instanceof AuthError ||
                error instanceof RateLimitError ||
                error instanceof NetworkError ||
                error instanceof ValidationError
            ) {
                throw error
            }

            // Wrap unknown errors
            logger.error('Uncomplete task failed:', error)
            throw this.wrapError(error, 'Uncomplete task')
        }
    }

    /**
     * Delete a task
     */
    async deleteTask(taskId: string): Promise<void> {
        try {
            logger.log('Deleting task:', taskId)
            await this.fetchWithAuth(`/tasks/${taskId}`, {
                method: 'DELETE',
            })
            logger.log('Task deleted successfully')
        } catch (error) {
            // Re-throw BackendError instances as-is
            if (
                error instanceof AuthError ||
                error instanceof RateLimitError ||
                error instanceof NetworkError ||
                error instanceof ValidationError
            ) {
                throw error
            }

            // Wrap unknown errors
            logger.error('Delete task failed:', error)
            throw this.wrapError(error, 'Delete task')
        }
    }

    /**
     * Add a new task
     */
    async addTask(content: string, due: string | null): Promise<void> {
        try {
            logger.log('Adding task:', { content, due })

            const body: Record<string, unknown> = { content }
            if (due) {
                body.due_string = due
            }

            await this.fetchWithAuth('/tasks', {
                method: 'POST',
                body: JSON.stringify(body),
            })

            logger.log('Task added successfully')
        } catch (error) {
            // Re-throw BackendError instances as-is
            if (
                error instanceof AuthError ||
                error instanceof RateLimitError ||
                error instanceof NetworkError ||
                error instanceof ValidationError
            ) {
                throw error
            }

            // Wrap unknown errors
            logger.error('Add task failed:', error)
            throw this.wrapError(error, 'Add task')
        }
    }

    /**
     * Clear local storage when the API token changes
     */
    async clearLocalData(): Promise<void> {
        await storageAdapter.remove(this.dataKey)
        this.data = { tasks: [], labels: [], projects: [] }
        this.dataLoaded = false
        logger.log('Cleared Todoist local data')
    }
}

export default TodoistProvider
