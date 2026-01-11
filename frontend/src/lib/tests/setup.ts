import { vi } from 'vitest'

// Mock chrome storage for all tests
const createMockStorage = () => {
    const store: Record<string, unknown> = {}
    return {
        get: vi.fn(async (key: string | string[]) => {
            if (typeof key === 'string') {
                return { [key]: store[key] }
            }
            const result: Record<string, unknown> = {}
            key.forEach((k) => {
                result[k] = store[k]
            })
            return result
        }),
        set: vi.fn(async (items: Record<string, unknown>) => {
            Object.assign(store, items)
        }),
        remove: vi.fn(async (key: string | string[]) => {
            if (typeof key === 'string') {
                delete store[key]
            } else {
                key.forEach((k) => delete store[k])
            }
        }),
        clear: vi.fn(async () => {
            Object.keys(store).forEach((key) => delete store[key])
        }),
    }
}

// Set up chrome global before any imports
const mockStorage = createMockStorage()
vi.stubGlobal('chrome', {
    storage: {
        local: mockStorage,
        sync: mockStorage,
        onChanged: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
})
