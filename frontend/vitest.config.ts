import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        setupFiles: ['./src/lib/tests/setup.ts'],
    },
})
