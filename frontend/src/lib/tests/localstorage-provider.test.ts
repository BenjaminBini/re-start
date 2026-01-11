import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock storage for testing
const mockStore: Record<string, unknown> = {}

// Mock the storage-adapter module
vi.mock('../storage-adapter', () => {
    return {
        localStorage: {
            get: vi.fn(async (key: string, defaultValue: unknown) => {
                return mockStore[key] !== undefined ? mockStore[key] : defaultValue
            }),
            set: vi.fn(async (key: string, value: unknown) => {
                mockStore[key] = value
            }),
            remove: vi.fn(async (key: string) => {
                delete mockStore[key]
            }),
            clear: vi.fn(async () => {
                Object.keys(mockStore).forEach((key) => delete mockStore[key])
            }),
            onChange: vi.fn(() => () => {}),
        },
        syncStorage: {
            get: vi.fn(),
            set: vi.fn(),
            remove: vi.fn(),
            clear: vi.fn(),
            onChange: vi.fn(() => () => {}),
        },
    }
})

// Mock the UUID module
vi.mock('../uuid', () => ({
    generateUUID: vi.fn(() => 'mock-uuid-123'),
}))

// Import after mocks
import LocalStorageProvider from '../providers/localstorage-provider'
import { localStorage as mockStorageAdapter } from '../storage-adapter'

describe('LocalStorageProvider', () => {
    beforeEach(() => {
        // Reset the mock storage before each test
        Object.keys(mockStore).forEach((key) => delete mockStore[key])
        vi.clearAllMocks()
    })

    describe('loadData', () => {
        it('loads data from chrome.storage.local on initialization', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Test task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync() // Ensure initialization completes

            expect(mockStorageAdapter.get).toHaveBeenCalledWith('local_tasks', { items: [] })
            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.content).toBe('Test task')
        })

        it('returns empty items array when storage is empty', async () => {
            const backend = new LocalStorageProvider({})
            await backend.sync() // Ensure initialization completes

            expect(mockStorageAdapter.get).toHaveBeenCalledWith('local_tasks', { items: [] })
            const tasks = backend.getTasks()
            expect(tasks).toEqual([])
        })

        it('handles storage errors gracefully', async () => {
            // Suppress console.error for this test since we expect an error to be logged
            const consoleErrorSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            // Mock storage error
            mockStorageAdapter.get.mockRejectedValueOnce(new Error('Storage error'))

            // Should not throw - gracefully handles storage errors
            const backend = new LocalStorageProvider({})
            await backend.sync() // Ensure initialization completes

            // Should return empty tasks when storage fails
            const tasks = backend.getTasks()
            expect(tasks).toEqual([])

            // Error should have been logged (via console.error from logger)
            expect(consoleErrorSpy).toHaveBeenCalled()

            consoleErrorSpy.mockRestore()
        })
    })

    describe('saveData', () => {
        it('saves data to chrome.storage.local when tasks are modified', async () => {
            const backend = new LocalStorageProvider({})

            await backend.addTask('New task', null)

            expect(mockStorageAdapter.set).toHaveBeenCalled()
            const savedData = mockStore['local_tasks'] as any
            expect(savedData.items).toHaveLength(1)
            expect(savedData.items[0]!.content).toBe('New task')
        })

        it('persists task data correctly on completion', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Test task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.completeTask('task-1')

            const savedData = mockStore['local_tasks'] as any
            expect(savedData.items[0]!.checked).toBe(true)
            expect(savedData.items[0]!.completed_at).not.toBeNull()
        })
    })

    describe('getTasks', () => {
        it('returns empty array when no tasks exist', async () => {
            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()
            expect(tasks).toEqual([])
        })

        it('filters out deleted tasks', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Active task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                    {
                        id: '2',
                        content: 'Deleted task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 1,
                        is_deleted: true,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.content).toBe('Active task')
        })

        it('includes unchecked tasks', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Unchecked task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.checked).toBe(false)
        })

        it('includes recently completed tasks (within 5 minutes)', async () => {
            const now = new Date()
            const recentCompletion = new Date(
                now.getTime() - 2 * 60 * 1000
            ).toISOString() // 2 minutes ago

            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Recently completed',
                        checked: true,
                        completed_at: recentCompletion,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.checked).toBe(true)
        })

        it('excludes completed tasks older than 5 minutes', async () => {
            const now = new Date()
            const oldCompletion = new Date(
                now.getTime() - 10 * 60 * 1000
            ).toISOString() // 10 minutes ago

            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Old completed',
                        checked: true,
                        completed_at: oldCompletion,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            expect(tasks).toEqual([])
        })

        it('enriches tasks with project_name and label_names (empty for localStorage)', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: 'some-project',
                        labels: ['label1', 'label2'],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            expect(tasks[0]!.project_name).toBe('')
            expect(tasks[0]!.label_names).toEqual([])
        })

        it('parses due dates without time as end of day', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Task with due date',
                        checked: false,
                        completed_at: null,
                        due: { date: '2025-12-15' },
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            expect(tasks[0]!.due_date).toBeInstanceOf(Date)
            expect(tasks[0]!.has_time).toBe(false)
            // Should be the date with 23:59:59 in local time
            const dueDate = tasks[0]!.due_date!
            expect(dueDate.getFullYear()).toBe(2025)
            expect(dueDate.getMonth()).toBe(11) // December (0-indexed)
            expect(dueDate.getDate()).toBe(15)
            expect(dueDate.getHours()).toBe(23)
            expect(dueDate.getMinutes()).toBe(59)
            expect(dueDate.getSeconds()).toBe(59)
        })

        it('parses due dates with time and sets has_time flag', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Task with due time',
                        checked: false,
                        completed_at: null,
                        due: { date: '2025-12-15T14:30:00' },
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            expect(tasks[0]!.due_date).toBeInstanceOf(Date)
            expect(tasks[0]!.has_time).toBe(true)
            // Verify the date was parsed correctly (handles timezone)
            const dueDate = tasks[0]!.due_date!
            const expectedDate = new Date('2025-12-15T14:30:00')
            expect(dueDate.getTime()).toBe(expectedDate.getTime())
        })

        it('sorts tasks using TaskProvider.sortTasks', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Checked task',
                        checked: true,
                        completed_at: new Date().toISOString(),
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                    {
                        id: '2',
                        content: 'Unchecked task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 1,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync()
            const tasks = backend.getTasks()

            // Unchecked task should be first (sortTasks behavior)
            expect(tasks[0]!.id).toBe('2')
            expect(tasks[0]!.checked).toBe(false)
            expect(tasks[1]!.id).toBe('1')
            expect(tasks[1]!.checked).toBe(true)
        })
    })

    describe('addTask', () => {
        it('adds a new task with generated UUID', async () => {
            const backend = new LocalStorageProvider({})

            await backend.addTask('New task', null)

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.id).toBe('mock-uuid-123')
            expect(tasks[0]!.content).toBe('New task')
        })

        it('adds task without due date', async () => {
            const backend = new LocalStorageProvider({})

            await backend.addTask('Task without due date', null)

            const tasks = backend.getTasks()
            expect(tasks[0]!.due).toBeNull()
            expect(tasks[0]!.due_date).toBeNull()
        })

        it('adds task with due date', async () => {
            const backend = new LocalStorageProvider({})

            await backend.addTask('Task with due date', '2025-12-20')

            const tasks = backend.getTasks()
            expect(tasks[0]!.due).toEqual({ date: '2025-12-20' })
            expect(tasks[0]!.due_date).toBeInstanceOf(Date)
        })

        it('sets initial task properties correctly', async () => {
            const backend = new LocalStorageProvider({})

            await backend.addTask('New task', null)

            const tasks = backend.getTasks()
            expect(tasks[0]!.checked).toBe(false)
            expect(tasks[0]!.completed_at).toBeNull()
            expect(tasks[0]!.project_id).toBeNull()
            expect(tasks[0]!.labels).toEqual([])
            expect(tasks[0]!.is_deleted).toBe(false)
        })

        it('sets child_order based on current task count', async () => {
            const taskData = {
                items: [
                    {
                        id: '1',
                        content: 'Existing task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.addTask('Second task', null)

            const savedData = (
                mockStore['local_tasks']
            )
            expect(savedData.items[1]!.child_order).toBe(1)
        })

        it('persists the new task to chrome.storage.local', async () => {
            const backend = new LocalStorageProvider({})

            await backend.addTask('Persist me', null)

            expect(mockStorageAdapter.set).toHaveBeenCalled()
            const savedData = mockStore['local_tasks'] as any
            expect(savedData.items[0]!.content).toBe('Persist me')
        })
    })

    describe('completeTask', () => {
        it('marks a task as checked', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task to complete',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.completeTask('task-1')

            const tasks = backend.getTasks()
            expect(tasks[0]!.checked).toBe(true)
        })

        it('sets completed_at timestamp', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task to complete',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.completeTask('task-1')

            const tasks = backend.getTasks()
            expect(tasks[0]!.completed_at).not.toBeNull()
            expect(new Date(tasks[0]!.completed_at!)).toBeInstanceOf(Date)
        })

        it('persists completion to localStorage', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.completeTask('task-1')

            const savedData = (
                mockStore['local_tasks']
            )
            expect(savedData.items[0]!.checked).toBe(true)
            expect(savedData.items[0]!.completed_at).not.toBeNull()
        })

        it('does nothing if task ID not found', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.completeTask('non-existent-id')

            const tasks = backend.getTasks()
            expect(tasks[0]!.checked).toBe(false)
        })
    })

    describe('uncompleteTask', () => {
        it('marks a completed task as unchecked', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Completed task',
                        checked: true,
                        completed_at: new Date().toISOString(),
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.uncompleteTask('task-1')

            const tasks = backend.getTasks()
            expect(tasks[0]!.checked).toBe(false)
        })

        it('clears completed_at timestamp', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Completed task',
                        checked: true,
                        completed_at: new Date().toISOString(),
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.uncompleteTask('task-1')

            const tasks = backend.getTasks()
            expect(tasks[0]!.completed_at).toBeNull()
        })

        it('persists uncomplete to localStorage', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task',
                        checked: true,
                        completed_at: new Date().toISOString(),
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.uncompleteTask('task-1')

            const savedData = (
                mockStore['local_tasks']
            )
            expect(savedData.items[0]!.checked).toBe(false)
            expect(savedData.items[0]!.completed_at).toBeNull()
        })

        it('does nothing if task ID not found', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task',
                        checked: true,
                        completed_at: new Date().toISOString(),
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.uncompleteTask('non-existent-id')

            const tasks = backend.getTasks()
            expect(tasks[0]!.checked).toBe(true)
        })
    })

    describe('deleteTask', () => {
        it('removes a task from the items array', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task to delete',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                    {
                        id: 'task-2',
                        content: 'Task to keep',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 1,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.deleteTask('task-1')

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.id).toBe('task-2')
        })

        it('persists deletion to localStorage', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task to delete',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.deleteTask('task-1')

            const savedData = (
                mockStore['local_tasks']
            )
            expect(savedData.items).toHaveLength(0)
        })

        it('does nothing if task ID not found', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.deleteTask('non-existent-id')

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
        })
    })

    describe('isCacheStale', () => {
        it('always returns false for localStorage backend', () => {
            const backend = new LocalStorageProvider({})
            expect(backend.isCacheStale()).toBe(false)
        })
    })

    describe('sync', () => {
        it('is a no-op for localStorage backend', async () => {
            const backend = new LocalStorageProvider({})

            // Should not throw and should complete successfully
            await expect(backend.sync()).resolves.toBeUndefined()
        })
    })

    describe('clearLocalData', () => {
        it('is a no-op for localStorage backend', () => {
            const backend = new LocalStorageProvider({})

            // Should not throw
            expect(() => backend.clearLocalData()).not.toThrow()
        })

        it('does not clear localStorage data', async () => {
            const taskData = {
                items: [
                    {
                        id: 'task-1',
                        content: 'Task',
                        checked: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        child_order: 0,
                        is_deleted: false,
                    },
                ],
            }
            mockStore['local_tasks'] = taskData

            const backend = new LocalStorageProvider({})
            await backend.sync() // Load data first
            backend.clearLocalData()

            // Data should still be present
            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
        })
    })

    describe('getProjectName', () => {
        it('always returns empty string', () => {
            const backend = new LocalStorageProvider({})
            expect(backend.getProjectName('any-id')).toBe('')
        })
    })

    describe('getLabelNames', () => {
        it('always returns empty array', () => {
            const backend = new LocalStorageProvider({})
            expect(backend.getLabelNames(['label1', 'label2'])).toEqual([])
        })
    })

    describe('invalidateCache', () => {
        it('is a no-op for localStorage backend', () => {
            const backend = new LocalStorageProvider({})

            // Should not throw
            expect(() => backend.invalidateCache()).not.toThrow()
        })
    })
})
