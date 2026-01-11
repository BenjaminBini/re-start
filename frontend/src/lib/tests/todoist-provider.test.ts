import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

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

// Import after mocks
import TodoistProvider from '../providers/todoist-provider'
import { localStorage as mockStorageAdapter } from '../storage-adapter'

// Helper to create mock REST API v2 responses
function createMockFetch() {
    return vi.fn()
}

function mockRestApiResponses(
    mockFetch: ReturnType<typeof createMockFetch>,
    tasks: unknown[] = [],
    projects: unknown[] = [],
    labels: unknown[] = []
) {
    mockFetch.mockImplementation((url: string) => {
        if (url.includes('/rest/v2/tasks') && !url.match(/\/tasks\/\d/)) {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async () => tasks,
            })
        }
        if (url.includes('/rest/v2/projects')) {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async () => projects,
            })
        }
        if (url.includes('/rest/v2/labels')) {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async () => labels,
            })
        }
        // Default response for mutations
        return Promise.resolve({
            ok: true,
            status: 204,
            json: async () => ({}),
        })
    })
}

describe('TodoistProvider', () => {
    let mockFetch: ReturnType<typeof createMockFetch>

    beforeEach(() => {
        // Reset the mock storage before each test
        Object.keys(mockStore).forEach((key) => delete mockStore[key])

        mockFetch = createMockFetch()
        vi.stubGlobal('fetch', mockFetch)

        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe('constructor', () => {
        it('initializes with empty data', () => {
            const backend = new TodoistProvider({ apiToken: 'test-token' })

            // Constructor doesn't load data immediately
            const tasks = backend.getTasks()
            expect(tasks).toEqual([])
        })

        it('loads existing data from chrome.storage before first sync', async () => {
            const existingData = {
                tasks: [
                    {
                        id: '1',
                        content: 'Existing task',
                        is_completed: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        order: 0,
                    },
                ],
                labels: [],
                projects: [],
                timestamp: Date.now(),
            }
            mockStore['todoist_data'] = existingData

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            // Before sync, getTasks should be empty (data not loaded yet)
            expect(backend.getTasks()).toEqual([])

            // Mock REST API v2 sync - returns the same existing task from API
            const mockTasks = [
                {
                    id: '1',
                    content: 'Existing task',
                    is_completed: false,
                    completed_at: null,
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]
            mockRestApiResponses(mockFetch, mockTasks, [], [])

            await backend.sync()

            // After sync, should have the task from API
            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.content).toBe('Existing task')
        })
    })

    describe('sync', () => {
        it('makes parallel API calls to /tasks, /projects, /labels with correct headers', async () => {
            mockRestApiResponses(mockFetch, [], [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            // Should make 3 parallel requests
            expect(mockFetch).toHaveBeenCalledTimes(3)

            // Verify each endpoint was called with correct headers
            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/tasks',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                        'Content-Type': 'application/json',
                    }),
                })
            )

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/projects',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                    }),
                })
            )

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/labels',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                    }),
                })
            )
        })

        it('fetches and stores tasks, projects, and labels', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'New task',
                    is_completed: false,
                    completed_at: null,
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]
            const mockProjects = [{ id: 'p1', name: 'Project 1' }]
            const mockLabels = [{ id: 'l1', name: 'Label 1' }]

            mockRestApiResponses(mockFetch, mockTasks, mockProjects, mockLabels)

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.content).toBe('New task')

            expect(backend.getProjectName('p1')).toBe('Project 1')
            expect(backend.getLabelNames(['l1'])).toEqual(['Label 1'])
        })

        it('saves updated data to chrome.storage after sync', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'Task',
                    is_completed: false,
                    completed_at: null,
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            expect(mockStorageAdapter.set).toHaveBeenCalledWith(
                'todoist_data',
                expect.objectContaining({
                    tasks: expect.arrayContaining([
                        expect.objectContaining({ id: '1', content: 'Task' }),
                    ]),
                    labels: [],
                    projects: [],
                    timestamp: expect.any(Number),
                })
            )

            const savedData = mockStore['todoist_data'] as {
                tasks: unknown[]
                timestamp: number
            }
            expect(savedData.tasks).toHaveLength(1)
            expect(savedData.timestamp).toBeDefined()
        })

        it('throws AuthError on 401 response', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            await expect(backend.sync()).rejects.toThrow(
                'Todoist API authentication failed: 401'
            )
        })

        it('throws RateLimitError on 429 response', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 429,
                statusText: 'Too Many Requests',
                headers: {
                    get: (name: string) =>
                        name === 'Retry-After' ? '60' : null,
                },
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            await expect(backend.sync()).rejects.toThrow('rate limit')
        })

        it('throws NetworkError on 500 response', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            await expect(backend.sync()).rejects.toThrow()
        })
    })

    describe('getProjectName', () => {
        it('returns project name by ID', async () => {
            mockRestApiResponses(
                mockFetch,
                [],
                [
                    { id: 'p1', name: 'Work' },
                    { id: 'p2', name: 'Personal' },
                ],
                []
            )

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            expect(backend.getProjectName('p1')).toBe('Work')
            expect(backend.getProjectName('p2')).toBe('Personal')
        })

        it('returns empty string for non-existent project ID', async () => {
            mockRestApiResponses(
                mockFetch,
                [],
                [{ id: 'p1', name: 'Work' }],
                []
            )

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            expect(backend.getProjectName('non-existent')).toBe('')
        })
    })

    describe('getLabelNames', () => {
        it('returns label names by IDs', async () => {
            mockRestApiResponses(
                mockFetch,
                [],
                [],
                [
                    { id: 'l1', name: 'Important' },
                    { id: 'l2', name: 'Urgent' },
                    { id: 'l3', name: 'Later' },
                ]
            )

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            expect(backend.getLabelNames(['l1', 'l2'])).toEqual([
                'Important',
                'Urgent',
            ])
        })

        it('filters out non-existent label IDs', async () => {
            mockRestApiResponses(
                mockFetch,
                [],
                [],
                [{ id: 'l1', name: 'Important' }]
            )

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            expect(backend.getLabelNames(['l1', 'non-existent'])).toEqual([
                'Important',
            ])
        })

        it('returns empty array for empty input', () => {
            const backend = new TodoistProvider({ apiToken: 'test-token' })
            expect(backend.getLabelNames([])).toEqual([])
        })
    })

    describe('isCacheStale', () => {
        it('returns true when no timestamp exists', () => {
            const backend = new TodoistProvider({ apiToken: 'test-token' })
            expect(backend.isCacheStale()).toBe(true)
        })

        it('returns false when cache is fresh (within 5 minutes)', async () => {
            mockRestApiResponses(mockFetch, [], [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            expect(backend.isCacheStale()).toBe(false)
        })

        it('returns true when cache has no timestamp before sync', () => {
            const backend = new TodoistProvider({ apiToken: 'test-token' })
            expect(backend.isCacheStale()).toBe(true)
        })

        it('returns false when cache is fresh after sync', async () => {
            const backend = new TodoistProvider({ apiToken: 'test-token' })

            mockRestApiResponses(mockFetch, [], [], [])

            await backend.sync()

            expect(backend.isCacheStale()).toBe(false)
        })
    })

    describe('clearLocalData', () => {
        it('removes data from chrome.storage', async () => {
            mockStore['todoist_data'] = {
                tasks: [],
            }

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.clearLocalData()

            expect(mockStorageAdapter.remove).toHaveBeenCalledWith(
                'todoist_data'
            )
        })

        it('resets data to empty state', async () => {
            const existingData = {
                tasks: [
                    {
                        id: '1',
                        content: 'Task',
                        is_completed: false,
                        completed_at: null,
                        due: null,
                        project_id: null,
                        labels: [],
                        order: 0,
                    },
                ],
                labels: [],
                projects: [],
            }
            mockStore['todoist_data'] = existingData

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.clearLocalData()

            expect(backend.getTasks()).toEqual([])
        })
    })

    describe('addTask', () => {
        it('sends POST request to /tasks with content', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({
                    id: 'new-task-id',
                    content: 'New task',
                    is_completed: false,
                    order: 1,
                }),
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.addTask('New task', null)

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/tasks',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({ content: 'New task' }),
                })
            )
        })

        it('sends POST request with content and due date', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({
                    id: 'new-task-id',
                    content: 'Task with due date',
                    is_completed: false,
                    order: 1,
                }),
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.addTask('Task with due date', '2025-12-31')

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/tasks',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        content: 'Task with due date',
                        due_string: '2025-12-31',
                    }),
                })
            )
        })

        it('throws error when command fails', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            await expect(backend.addTask('New task', null)).rejects.toThrow()
        })
    })

    describe('completeTask', () => {
        it('sends POST request to /tasks/{id}/close', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 204,
                json: async () => ({}),
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.completeTask('task-123')

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/tasks/task-123/close',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                        'Content-Type': 'application/json',
                    }),
                })
            )
        })

        it('throws error when command fails', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            await expect(backend.completeTask('task-123')).rejects.toThrow()
        })
    })

    describe('uncompleteTask', () => {
        it('sends POST request to /tasks/{id}/reopen', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 204,
                json: async () => ({}),
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.uncompleteTask('task-456')

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/tasks/task-456/reopen',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                        'Content-Type': 'application/json',
                    }),
                })
            )
        })

        it('throws error when command fails', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 403,
                statusText: 'Forbidden',
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            await expect(backend.uncompleteTask('task-456')).rejects.toThrow(
                'Todoist API authentication failed: 403'
            )
        })
    })

    describe('deleteTask', () => {
        it('sends DELETE request to /tasks/{id}', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 204,
                json: async () => ({}),
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.deleteTask('task-789')

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/rest/v2/tasks/task-789',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                        'Content-Type': 'application/json',
                    }),
                })
            )
        })

        it('throws error when command fails', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            })

            const backend = new TodoistProvider({ apiToken: 'test-token' })

            await expect(backend.deleteTask('task-789')).rejects.toThrow()
        })
    })

    describe('getTasks', () => {
        it('returns empty array when no tasks exist', () => {
            const backend = new TodoistProvider({ apiToken: 'test-token' })
            expect(backend.getTasks()).toEqual([])
        })

        it('includes uncompleted tasks', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'Uncompleted task',
                    is_completed: false,
                    completed_at: null,
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.checked).toBe(false)
        })

        it('includes recently completed tasks (within 5 minutes)', async () => {
            const recentCompletion = new Date(
                Date.now() - 2 * 60 * 1000
            ).toISOString()

            const mockTasks = [
                {
                    id: '1',
                    content: 'Recently completed',
                    is_completed: true,
                    completed_at: recentCompletion,
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks).toHaveLength(1)
            expect(tasks[0]!.checked).toBe(true)
        })

        it('excludes completed tasks older than 5 minutes', async () => {
            const oldCompletion = new Date(
                Date.now() - 10 * 60 * 1000
            ).toISOString()

            const mockTasks = [
                {
                    id: '1',
                    content: 'Old completed',
                    is_completed: true,
                    completed_at: oldCompletion,
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks).toEqual([])
        })

        it('enriches tasks with project_name', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'Task',
                    is_completed: false,
                    completed_at: null,
                    due: null,
                    project_id: 'p1',
                    labels: [],
                    order: 0,
                },
            ]
            const mockProjects = [{ id: 'p1', name: 'Work' }]

            mockRestApiResponses(mockFetch, mockTasks, mockProjects, [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks[0]!.project_name).toBe('Work')
        })

        it('enriches tasks with label_names', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'Task',
                    is_completed: false,
                    completed_at: null,
                    due: null,
                    project_id: null,
                    labels: ['l1', 'l2'],
                    order: 0,
                },
            ]
            const mockLabels = [
                { id: 'l1', name: 'Important' },
                { id: 'l2', name: 'Urgent' },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], mockLabels)

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks[0]!.label_names).toEqual(['Important', 'Urgent'])
        })

        it('parses due dates without time as end of day', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'Task',
                    is_completed: false,
                    completed_at: null,
                    due: { date: '2025-12-15' },
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks[0]!.due_date).toBeInstanceOf(Date)
            expect(tasks[0]!.has_time).toBe(false)

            const dueDate = tasks[0]!.due_date!
            expect(dueDate.getHours()).toBe(23)
            expect(dueDate.getMinutes()).toBe(59)
            expect(dueDate.getSeconds()).toBe(59)
        })

        it('parses due dates with time and sets has_time flag', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'Task',
                    is_completed: false,
                    completed_at: null,
                    due: { date: '2025-12-15T14:30:00' },
                    project_id: null,
                    labels: [],
                    order: 0,
                },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            expect(tasks[0]!.due_date).toBeInstanceOf(Date)
            expect(tasks[0]!.has_time).toBe(true)
        })

        it('sorts tasks using TaskProvider.sortTasks', async () => {
            const mockTasks = [
                {
                    id: '1',
                    content: 'Completed task',
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 0,
                },
                {
                    id: '2',
                    content: 'Uncompleted task',
                    is_completed: false,
                    completed_at: null,
                    due: null,
                    project_id: null,
                    labels: [],
                    order: 1,
                },
            ]

            mockRestApiResponses(mockFetch, mockTasks, [], [])

            const backend = new TodoistProvider({ apiToken: 'test-token' })
            await backend.sync()

            const tasks = backend.getTasks()
            // Uncompleted should be first
            expect(tasks[0]!.id).toBe('2')
            expect(tasks[1]!.id).toBe('1')
        })
    })
})
