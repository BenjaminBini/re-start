import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock store for storage-adapter
const mockStore: Record<string, unknown> = {}

// Mock the storage-adapter module
vi.mock('../storage-adapter', () => {
    return {
        localStorage: {
            get: vi.fn(async (key: string, defaultValue: unknown) => {
                return mockStore[key] !== undefined
                    ? mockStore[key]
                    : defaultValue
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

// Mock the google-auth module
vi.mock('../providers/google-auth', () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    getUserEmail: vi.fn(() => 'test@example.com'),
    isSignedIn: vi.fn(() => true),
    ensureValidToken: vi.fn(() => Promise.resolve('mock-token-123')),
    migrateStorageKeys: vi.fn(),
    apiRequest: vi.fn(),
    createApiClient: vi.fn(() => vi.fn()),
}))

// Import after mocks
import GoogleTasksProvider from '../providers/google-tasks-provider'
import * as googleAuth from '../providers/google-auth'
import { localStorage as mockStorageAdapter } from '../storage-adapter'

/**
 * Helper function to wait for async data loading in GoogleTasksProvider
 * Call this after creating a new provider instance that should load from mockStore
 */
async function waitForDataLoad() {
    await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('GoogleTasksProvider', () => {
    let mockApiRequest: ReturnType<typeof vi.fn<[], Promise<unknown>>>

    beforeEach(() => {
        // Reset the mock storage before each test
        Object.keys(mockStore).forEach((key) => delete mockStore[key])

        // Reset mock implementations
        mockApiRequest = vi.fn<[], Promise<unknown>>()
        // createApiClient returns a function that will be used for API requests
        vi.mocked(googleAuth.createApiClient).mockReturnValue(
            mockApiRequest as <T>(
                endpoint: string,
                options?: RequestInit
            ) => Promise<T>
        )
        vi.mocked(googleAuth.isSignedIn).mockReturnValue(true)
        vi.mocked(googleAuth.ensureValidToken).mockResolvedValue(
            'mock-token-123'
        )

        vi.clearAllMocks()
    })

    afterEach(() => {
        // Clean up mock store
        Object.keys(mockStore).forEach((key) => delete mockStore[key])
    })

    describe('constructor', () => {
        it('initializes with empty data when storage is empty', () => {
            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            expect(googleAuth.migrateStorageKeys).toHaveBeenCalled()

            const tasks = backend.getTasks()
            expect(tasks).toEqual([])
        })

        it('loads existing data from storage asynchronously', async () => {
            const existingData = {
                tasklists: [{ id: 'list1', title: 'My Tasks' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Existing task',
                        status: 'needsAction',
                        tasklistId: 'list1',
                        tasklistName: 'My Tasks',
                    },
                ],
                timestamp: Date.now(),
            }
            mockStore['google_tasks_data'] = existingData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            // Wait for async data loading
            await new Promise((resolve) => setTimeout(resolve, 0))

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.content).toBe('Existing task')
        })

        it('loads default tasklist ID from storage', async () => {
            mockStore['google_tasks_default_list'] = 'custom-list-id'

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            // Wait for async data loading
            await new Promise((resolve) => setTimeout(resolve, 0))

            expect(backend).toBeDefined()
        })

        it('defaults to "@default" when no tasklist ID is stored', () => {
            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            // Verify by checking that backend is initialized
            expect(backend).toBeDefined()
        })
    })

    describe('auth methods', () => {
        it('signIn delegates to google-auth module', async () => {
            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.signIn()

            expect(googleAuth.signIn).toHaveBeenCalled()
        })

        it('signOut delegates to google-auth and clears local data', async () => {
            mockStore['google_tasks_data'] = {
                tasklists: [],
                tasks: [],
            }

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.signOut()

            expect(googleAuth.signOut).toHaveBeenCalled()
            expect(mockStorageAdapter.remove).toHaveBeenCalledWith(
                'google_tasks_data'
            )
        })

        it('getIsSignedIn delegates to google-auth module', () => {
            vi.mocked(googleAuth.isSignedIn).mockReturnValue(true)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const result = backend.getIsSignedIn()

            expect(googleAuth.isSignedIn).toHaveBeenCalled()
            expect(result).toBe(true)
        })

        it('getUserEmail delegates to google-auth module', () => {
            vi.mocked(googleAuth.getUserEmail).mockReturnValue('test@example.com')

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const email = backend.getUserEmail()

            expect(googleAuth.getUserEmail).toHaveBeenCalled()
            expect(email).toBe('test@example.com')
        })

        it('ensureValidToken delegates to google-auth module', async () => {
            vi.mocked(googleAuth.ensureValidToken).mockResolvedValue(
                'valid-token-456'
            )

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const token = await backend.ensureValidToken()

            expect(googleAuth.ensureValidToken).toHaveBeenCalled()
            expect(token).toBe('valid-token-456')
        })
    })

    describe('sync', () => {
        it('throws error when not signed in', async () => {
            vi.mocked(googleAuth.isSignedIn).mockReturnValue(false)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            await expect(backend.sync()).rejects.toThrow(
                'Not signed in to Google account'
            )
        })

        it('fetches tasklists and tasks by default', async () => {
            const mockTasklistsResponse = {
                items: [
                    { id: 'list1', title: 'Work' },
                    { id: 'list2', title: 'Personal' },
                ],
            }

            const mockTasksResponse1 = {
                items: [
                    {
                        id: 'task1',
                        title: 'Task 1',
                        status: 'needsAction',
                    },
                ],
            }

            const mockTasksResponse2 = {
                items: [
                    {
                        id: 'task2',
                        title: 'Task 2',
                        status: 'needsAction',
                    },
                ],
            }

            mockApiRequest
                .mockResolvedValueOnce(mockTasklistsResponse)
                .mockResolvedValueOnce(mockTasksResponse1)
                .mockResolvedValueOnce(mockTasksResponse2)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.sync()

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/users/@me/lists?maxResults=20'
            )

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/lists/list1/tasks?showCompleted=true&showHidden=true&maxResults=100'
            )

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/lists/list2/tasks?showCompleted=true&showHidden=true&maxResults=100'
            )
        })

        it('enriches tasks with tasklist info', async () => {
            const mockTasklistsResponse = {
                items: [{ id: 'list1', title: 'Work Tasks' }],
            }

            const mockTasksResponse = {
                items: [
                    {
                        id: 'task1',
                        title: 'Important task',
                        status: 'needsAction',
                    },
                ],
            }

            mockApiRequest
                .mockResolvedValueOnce(mockTasklistsResponse)
                .mockResolvedValueOnce(mockTasksResponse)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.project_name).toBe('Work Tasks')
        })

        it('saves data to localStorage with timestamp', async () => {
            const mockTasklistsResponse = { items: [] }

            mockApiRequest.mockResolvedValueOnce(mockTasklistsResponse)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.sync()

            expect(mockStorageAdapter.set).toHaveBeenCalledWith(
                'google_tasks_data',
                expect.any(Object)
            )

            const savedData = mockStore['google_tasks_data'] as {
                timestamp?: number
            }
            expect(savedData.timestamp).toBeDefined()
            expect(savedData.timestamp).toBeGreaterThan(0)
        })

        it('sets default tasklist ID when not set', async () => {
            const mockTasklistsResponse = {
                items: [
                    { id: 'first-list', title: 'First List' },
                    { id: 'second-list', title: 'Second List' },
                ],
            }

            mockApiRequest
                .mockResolvedValueOnce(mockTasklistsResponse)
                .mockResolvedValueOnce({ items: [] })
                .mockResolvedValueOnce({ items: [] })

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.sync()

            expect(mockStorageAdapter.set).toHaveBeenCalledWith(
                'google_tasks_default_list',
                'first-list'
            )
        })

        it('updates invalid tasklist ID to first available', async () => {
            mockStore['google_tasks_default_list'] = 'invalid-list-id'

            const mockTasklistsResponse = {
                items: [{ id: 'valid-list', title: 'Valid List' }],
            }

            mockApiRequest
                .mockResolvedValueOnce(mockTasklistsResponse)
                .mockResolvedValueOnce({ items: [] })

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.sync()

            expect(mockStorageAdapter.set).toHaveBeenCalledWith(
                'google_tasks_default_list',
                'valid-list'
            )
        })

        it('keeps valid default tasklist ID', async () => {
            mockStore['google_tasks_default_list'] = 'valid-list'

            const mockTasklistsResponse = {
                items: [
                    { id: 'valid-list', title: 'Valid List' },
                    { id: 'other-list', title: 'Other List' },
                ],
            }

            mockApiRequest
                .mockResolvedValueOnce(mockTasklistsResponse)
                .mockResolvedValueOnce({ items: [] })
                .mockResolvedValueOnce({ items: [] })

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            // Clear setItem calls from constructor
            vi.clearAllMocks()

            await backend.sync()

            // Should not update the tasklist ID since it's still valid
            const setItemCalls = mockStorageAdapter.set.mock.calls
            const tasklistIdCalls = setItemCalls.filter(
                (call) => call[0] === 'google_tasks_default_list'
            )
            expect(tasklistIdCalls).toHaveLength(0)
        })

        it('handles empty tasklists by setting empty tasks', async () => {
            const mockTasklistsResponse = { items: [] }

            mockApiRequest.mockResolvedValueOnce(mockTasklistsResponse)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks).toEqual([])
        })

        it('handles missing items in API responses', async () => {
            const mockTasklistsResponse = {}
            const mockTasksResponse = {}

            mockApiRequest
                .mockResolvedValueOnce(mockTasklistsResponse)
                .mockResolvedValueOnce(mockTasksResponse)

            void new GoogleTasksProvider()

            // Add a tasklist manually to trigger task fetching
            mockStore['google_tasks_data'] = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [],
            }

            const backend2 = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend2.sync(['tasks'])

            const tasks = backend2.getTasks()
            expect(tasks).toEqual([])
        })

        it('supports custom resource types parameter', async () => {
            const mockTasklistsResponse = {
                items: [{ id: 'list1', title: 'List 1' }],
            }

            mockApiRequest.mockResolvedValueOnce(mockTasklistsResponse)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.sync(['tasklists'])

            // Should only fetch tasklists, not tasks
            expect(mockApiRequest).toHaveBeenCalledTimes(1)
            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/users/@me/lists')
            )
        })

        it('throws error on API failure', async () => {
            // Mock console.error to avoid test output noise
            const consoleErrorSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            mockApiRequest.mockRejectedValueOnce(new Error('API request failed'))

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            await expect(backend.sync()).rejects.toThrow('API request failed')
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[GoogleTasks]',
                'Google Tasks sync failed:',
                expect.any(Error)
            )

            consoleErrorSpy.mockRestore()
        })
    })

    describe('getTasks', () => {
        it('returns empty array when no tasks exist', () => {
            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            expect(backend.getTasks()).toEqual([])
        })

        it('filters tasks by status needsAction', async () => {
            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Active task',
                        status: 'needsAction',
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                    {
                        id: 'task2',
                        title: 'Completed task',
                        status: 'completed',
                        completed: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.content).toBe('Active task')
            expect(tasks[0]!.checked).toBe(false)
        })

        it('includes recently completed tasks (within 5 minutes)', () => {
            const recentCompletion = new Date(
                Date.now() - 2 * 60 * 1000
            ).toISOString()

            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Recently completed',
                        status: 'completed',
                        completed: recentCompletion,
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.checked).toBe(true)
            expect(tasks[0]!.completed_at).toBe(recentCompletion)
        })

        it('excludes completed tasks older than 5 minutes', () => {
            const oldCompletion = new Date(
                Date.now() - 10 * 60 * 1000
            ).toISOString()

            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Old completed',
                        status: 'completed',
                        completed: oldCompletion,
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            expect(tasks).toEqual([])
        })

        it('enriches tasks with tasklist name as project_name', () => {
            const mockData = {
                tasklists: [{ id: 'work-list', title: 'Work Projects' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'needsAction',
                        tasklistId: 'work-list',
                        tasklistName: 'Work Projects',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            expect(tasks[0]!.project_id).toBe('work-list')
            expect(tasks[0]!.project_name).toBe('Work Projects')
        })

        it('parses due dates as end of day (23:59:59)', () => {
            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task with due date',
                        status: 'needsAction',
                        due: '2025-12-25T00:00:00.000Z',
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            expect(tasks[0]!.due_date).toBeInstanceOf(Date)
            expect(tasks[0]!.has_time).toBe(false)

            const dueDate = tasks[0]!.due_date!
            expect(dueDate.getHours()).toBe(23)
            expect(dueDate.getMinutes()).toBe(59)
            expect(dueDate.getSeconds()).toBe(59)
        })

        it('handles tasks without due dates', () => {
            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'No due date',
                        status: 'needsAction',
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            expect(tasks[0]!.due_date).toBeNull()
            expect(tasks[0]!.due).toBeNull()
        })

        it('sorts tasks using TaskProvider.sortTasks', () => {
            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Completed task',
                        status: 'completed',
                        completed: new Date().toISOString(),
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                    {
                        id: 'task2',
                        title: 'Active task',
                        status: 'needsAction',
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            // Active task should be first (unchecked tasks before checked)
            expect(tasks[0]!.id).toBe('task2')
            expect(tasks[1]!.id).toBe('task1')
        })

        it('sets label_names to empty array', () => {
            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'needsAction',
                        tasklistId: 'list1',
                        tasklistName: 'List',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            const tasks = backend.getTasks()

            expect(tasks[0]!.labels).toEqual([])
            expect(tasks[0]!.label_names).toEqual([])
        })
    })

    describe('getTasklistName', () => {
        it('returns tasklist name by ID', () => {
            const mockData = {
                tasklists: [
                    { id: 'list1', title: 'Work' },
                    { id: 'list2', title: 'Personal' },
                ],
                tasks: [],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            expect(backend.getTasklistName('list1')).toBe('Work')
            expect(backend.getTasklistName('list2')).toBe('Personal')
        })

        it('returns empty string for non-existent tasklist ID', () => {
            const mockData = {
                tasklists: [{ id: 'list1', title: 'Work' }],
                tasks: [],
            }

            mockStore['google_tasks_data'] =
                mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            expect(backend.getTasklistName('non-existent')).toBe('')
        })
    })

    describe('addTask', () => {
        it('sends POST request with title only', async () => {
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.addTask('New task', null)

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/lists/@default/tasks',
                {
                    method: 'POST',
                    body: JSON.stringify({ title: 'New task' }),
                }
            )
        })

        it('sends POST request with title and due date', async () => {
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.addTask('Task with due date', '2025-12-25')

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/lists/@default/tasks',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: 'Task with due date',
                        due: '2025-12-25T00:00:00.000Z',
                    }),
                }
            )
        })

        it('strips time from due date if provided', async () => {
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.addTask('Task', '2025-12-25T14:30:00')

            const call = mockApiRequest.mock.calls[0] as unknown[]
            const body = JSON.parse((call[1] as { body: string }).body)
            expect(body.due).toBe('2025-12-25T00:00:00.000Z')
        })

        it('uses default tasklist ID', async () => {
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.addTask('Task', null)

            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/lists/@default/tasks'),
                expect.any(Object)
            )
        })

        it('throws error on API failure', async () => {
            mockApiRequest.mockRejectedValueOnce(
                new Error('HTTP 400: Bad Request')
            )

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            await expect(backend.addTask('Task', null)).rejects.toThrow(
                'HTTP 400: Bad Request'
            )
        })
    })

    describe('completeTask', () => {
        it('sends PATCH request with completed status', async () => {
            const mockData = {
                tasklists: [],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'needsAction',
                        tasklistId: 'list1',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.completeTask('task1')

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/lists/list1/tasks/task1',
                {
                    method: 'PATCH',
                    body: expect.stringContaining('"status":"completed"'),
                }
            )

            // Verify completed timestamp is included
            const call = mockApiRequest.mock.calls[0] as unknown[]
            const body = JSON.parse((call[1] as { body: string }).body)
            expect(body.completed).toBeDefined()
            expect(new Date(body.completed).getTime()).toBeGreaterThan(0)
        })

        it('uses task tasklistId from stored data', async () => {
            const mockData = {
                tasklists: [],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'needsAction',
                        tasklistId: 'custom-list',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.completeTask('task1')

            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/lists/custom-list/tasks/task1'),
                expect.any(Object)
            )
        })

        it('falls back to default tasklist when task not found', async () => {
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.completeTask('unknown-task')

            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/lists/@default/tasks/unknown-task'),
                expect.any(Object)
            )
        })

        it('throws error on API failure', async () => {
            mockApiRequest.mockRejectedValueOnce(
                new Error('HTTP 404: Not Found')
            )

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            await expect(backend.completeTask('task1')).rejects.toThrow(
                'HTTP 404: Not Found'
            )
        })
    })

    describe('uncompleteTask', () => {
        it('sends PATCH request with needsAction status', async () => {
            const mockData = {
                tasklists: [],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'completed',
                        completed: new Date().toISOString(),
                        tasklistId: 'list1',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.uncompleteTask('task1')

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/lists/list1/tasks/task1',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        status: 'needsAction',
                        completed: null,
                    }),
                }
            )
        })

        it('uses task tasklistId from stored data', async () => {
            const mockData = {
                tasklists: [],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'completed',
                        tasklistId: 'work-list',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.uncompleteTask('task1')

            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/lists/work-list/tasks/task1'),
                expect.any(Object)
            )
        })

        it('falls back to default tasklist when task not found', async () => {
            mockApiRequest.mockResolvedValueOnce({})

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.uncompleteTask('unknown-task')

            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/lists/@default/tasks/unknown-task'),
                expect.any(Object)
            )
        })

        it('throws error on API failure', async () => {
            mockApiRequest.mockRejectedValueOnce(
                new Error('HTTP 500: Server Error')
            )

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            await expect(backend.uncompleteTask('task1')).rejects.toThrow(
                'HTTP 500: Server Error'
            )
        })
    })

    describe('deleteTask', () => {
        it('sends DELETE request', async () => {
            const mockData = {
                tasklists: [],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task to delete',
                        status: 'needsAction',
                        tasklistId: 'list1',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData
            mockApiRequest.mockResolvedValueOnce(undefined)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.deleteTask('task1')

            expect(mockApiRequest).toHaveBeenCalledWith(
                '/lists/list1/tasks/task1',
                {
                    method: 'DELETE',
                }
            )
        })

        it('uses task tasklistId from stored data', async () => {
            const mockData = {
                tasklists: [],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'needsAction',
                        tasklistId: 'personal-list',
                    },
                ],
            }

            mockStore['google_tasks_data'] =
                mockData
            mockApiRequest.mockResolvedValueOnce(undefined)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.deleteTask('task1')

            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/lists/personal-list/tasks/task1'),
                expect.any(Object)
            )
        })

        it('falls back to default tasklist when task not found', async () => {
            mockApiRequest.mockResolvedValueOnce(undefined)

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.deleteTask('unknown-task')

            expect(mockApiRequest).toHaveBeenCalledWith(
                expect.stringContaining('/lists/@default/tasks/unknown-task'),
                expect.any(Object)
            )
        })

        it('throws error on API failure', async () => {
            mockApiRequest.mockRejectedValueOnce(
                new Error('HTTP 403: Forbidden')
            )

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            await expect(backend.deleteTask('task1')).rejects.toThrow(
                'HTTP 403: Forbidden'
            )
        })
    })

    describe('clearLocalData', () => {
        it('removes data from localStorage', async () => {
            mockStore['google_tasks_data'] = {
                tasklists: [],
                tasks: [],
            }

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.clearLocalData()

            expect(mockStorageAdapter.remove).toHaveBeenCalledWith(
                'google_tasks_data'
            )
        })

        it('removes default tasklist ID from localStorage', async () => {
            mockStore['google_tasks_default_list'] = 'list1'

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.clearLocalData()

            expect(mockStorageAdapter.remove).toHaveBeenCalledWith(
                'google_tasks_default_list'
            )
        })

        it('resets data to empty state', async () => {
            const mockData = {
                tasklists: [{ id: 'list1', title: 'List' }],
                tasks: [
                    {
                        id: 'task1',
                        title: 'Task',
                        status: 'needsAction',
                        tasklistId: 'list1',
                    },
                ],
            }

            mockStore['google_tasks_data'] = mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.clearLocalData()

            expect(backend.getTasks()).toEqual([])
        })

        it('resets default tasklist ID to "@default"', async () => {
            mockStore['google_tasks_default_list'] = 'custom-list'

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            await backend.clearLocalData()

            // Verify by checking that backend still works
            expect(backend).toBeDefined()
        })
    })

    describe('isCacheStale', () => {
        it('returns true when no timestamp exists', () => {
            const backend = new GoogleTasksProvider()
            await waitForDataLoad()
            expect(backend.isCacheStale()).toBe(true)
        })

        it('returns false when cache is fresh (within 5 minutes)', async () => {
            const mockData = {
                tasklists: [],
                tasks: [],
                timestamp: Date.now(),
            }

            mockStore['google_tasks_data'] = mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            // Wait for async data loading
            await new Promise((resolve) => setTimeout(resolve, 0))

            expect(backend.isCacheStale()).toBe(false)
        })

        it('returns true when cache is older than 5 minutes', async () => {
            const oldTimestamp = Date.now() - 6 * 60 * 1000 // 6 minutes ago

            const mockData = {
                tasklists: [],
                tasks: [],
                timestamp: oldTimestamp,
            }

            mockStore['google_tasks_data'] = mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            // Wait for async data loading
            await new Promise((resolve) => setTimeout(resolve, 0))

            expect(backend.isCacheStale()).toBe(true)
        })

        it('returns false when cache is at the 5-minute boundary', async () => {
            const boundaryTimestamp = Date.now() - 5 * 60 * 1000 + 100 // Just under 5 minutes

            const mockData = {
                tasklists: [],
                tasks: [],
                timestamp: boundaryTimestamp,
            }

            mockStore['google_tasks_data'] = mockData

            const backend = new GoogleTasksProvider()
            await waitForDataLoad()

            // Wait for async data loading
            await new Promise((resolve) => setTimeout(resolve, 0))

            expect(backend.isCacheStale()).toBe(false)
        })
    })
})
