/**
 * Todoist API client using the Sync endpoint for efficient data retrieval
 */
class TodoistAPI {
    constructor(token) {
        this.token = token
        this.baseUrl = 'https://api.todoist.com/api/v1'
        this.syncTokenKey = 'todoist_sync_token'
        this.dataKey = 'todoist_data'

        this.syncToken = localStorage.getItem(this.syncTokenKey) || '*'
        this.data = JSON.parse(localStorage.getItem(this.dataKey) || '{}')
    }

    /**
     * Perform a sync request to get tasks and related data
     */
    async sync(
        resourceTypes = ['items', 'labels', 'projects'],
        isRetry = false
    ) {
        const formData = new FormData()
        formData.append('sync_token', this.syncToken)
        formData.append('resource_types', JSON.stringify(resourceTypes))

        try {
            const response = await fetch(`${this.baseUrl}/sync`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error(`todoist fetch failed: ${response.status}`)
            }

            const data = await response.json()

            this.updateLocalData(data)

            this.syncToken = data.sync_token
            localStorage.setItem(this.syncTokenKey, this.syncToken)

            console.log(data)

            return data
        } catch (error) {
            if (!isRetry && this.syncToken !== '*') {
                console.log('retrying with full sync...')
                this.syncToken = '*'
                localStorage.setItem(this.syncTokenKey, this.syncToken)
                return this.sync(resourceTypes, true)
            }
            throw error
        }
    }

    /**
     * Update local data storage with sync response
     */
    updateLocalData(syncData) {
        if (syncData.full_sync) {
            this.data = {
                items: syncData.items || [],
                labels: syncData.labels || [],
                projects: syncData.projects || [],
            }
        } else {
            // Merge incremental updates
            this.mergeData('items', syncData.items)
            this.mergeData('labels', syncData.labels)
            this.mergeData('projects', syncData.projects)
        }

        localStorage.setItem(this.dataKey, JSON.stringify(this.data))
    }

    /**
     * Generic merge function for all data types
     */
    mergeData(type, newData) {
        if (!newData) return
        if (!this.data[type]) this.data[type] = []

        newData.forEach((newItem) => {
            if (newItem.is_deleted) {
                this.data[type] = this.data[type].filter(
                    (item) => item.id !== newItem.id
                )
            } else {
                const existingIndex = this.data[type].findIndex(
                    (item) => item.id === newItem.id
                )
                if (existingIndex >= 0) {
                    this.data[type][existingIndex] = newItem
                } else {
                    this.data[type].push(newItem)
                }
            }
        })
    }

    /**
     * Get upcoming tasks (similar to Todoist inbox view)
     */
    getTasks() {
        if (!this.data.items) return []

        return this.data.items
            .filter((item) => !item.checked && !item.is_deleted)
            .map((item) => {
                let dueDate = null
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
                    project_name: this.getProjectName(item.project_id),
                    label_names: this.getLabelNames(item.labels),
                    offset_due_date: dueDate,
                    has_time: hasTime,
                }
            })
            .sort((a, b) => {
                // Sort by: due date, then no date, then child order
                if (a.offset_due_date && b.offset_due_date) {
                    return a.offset_due_date - b.offset_due_date
                }
                if (a.offset_due_date && !b.offset_due_date) return -1
                if (!a.offset_due_date && b.offset_due_date) return 1
                return a.child_order - b.child_order
            })
    }

    /**
     * Get project name by ID
     */
    getProjectName(projectId) {
        return this.data.projects?.find((p) => p.id === projectId)?.name || ''
    }

    /**
     * Get label names by label IDs
     */
    getLabelNames(labelIds) {
        if (!labelIds || !this.data.labels) return []
        return labelIds
            .map((id) => this.data.labels.find((l) => l.id === id)?.name)
            .filter(Boolean)
    }

    /**
     * Complete a task
     */
    async completeTask(taskId) {
        const commands = [
            {
                type: 'item_complete',
                uuid: crypto.randomUUID(),
                args: {
                    id: taskId,
                },
            },
        ]

        return this.executeCommands(commands)
    }

    /**
     * Execute sync commands
     */
    async executeCommands(commands) {
        const formData = new FormData()
        formData.append('commands', JSON.stringify(commands))

        try {
            const response = await fetch(`${this.baseUrl}/sync`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error(
                    `todoist command fetch failed: ${response.status}`
                )
            }

            const data = await response.json()

            if (data.sync_status) {
                await this.sync()
            }

            return data
        } catch (error) {
            console.error('todoist command execution error:', error)
            throw error
        }
    }

    /**
     * Clear local storage when the API token changes
     */
    clearLocalData() {
        localStorage.removeItem(this.syncTokenKey)
        localStorage.removeItem(this.dataKey)
        this.syncToken = '*'
        this.data = {}
    }
}

export default TodoistAPI
