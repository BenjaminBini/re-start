/// <reference types="node" />
import { defineConfig, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector'
import fs from 'fs'

interface Manifest {
    version: string
    [key: string]: unknown
}

// Read version from manifest.json at build time
const manifest: Manifest = JSON.parse(fs.readFileSync('./public/manifest.json', 'utf-8'))

// Plugin to exclude manifest.json from public copy (we'll generate it separately)
function excludeManifest(): Plugin {
    return {
        name: 'exclude-manifest',
        generateBundle(_options, bundle) {
            // Remove manifest.json from bundle if Vite copied it
            delete bundle['manifest.json']
        },
    }
}

// https://vite.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        svelte({
            compilerOptions: {
                dev: true,
            },
        }),
        svelteInspector(),
        excludeManifest(),
    ],
    define: {
        __APP_VERSION__: JSON.stringify(manifest.version),
    },
    build: {
        rollupOptions: {
            input: {
                index: './index.html',
                'service-worker': './src/service-worker.ts',
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    // Service worker must be at root level, not in assets/
                    return chunkInfo.name === 'service-worker'
                        ? 'service-worker.js'
                        : 'assets/[name]-[hash].js'
                },
            },
        },
    },
    server: {
        port: 5999,
    },
})
