# Project Overview

## Purpose
re-start is a TUI-style browser startpage extension built with Svelte 5. It provides:
- Task management (local, Todoist, Google Tasks)
- Google Calendar integration
- Weather display with forecasts
- Customizable quick links
- Multiple color themes

Targets both Firefox and Chrome browsers.

## Tech Stack
- **Frontend**: Svelte 5 (with runes: `$state`, `$effect`, `$derived`)
- **Build Tool**: Vite 7
- **Testing**: Vitest
- **Module System**: ES modules (`"type": "module"`)
- **Language**: Vanilla JavaScript (no TypeScript)
- **Font**: Geist Mono (variable font)

## Key Dependencies
- `svelte` ^5.39.11
- `vite` ^7.1.9
- `vitest` ^1.6.1
- `@sveltejs/vite-plugin-svelte` ^6.2.1

## External APIs (no API keys in repo)
- OpenMeteo API (weather, free, no key)
- Unsplash API (backgrounds)
- Todoist Sync API
- Google Tasks API
- Google Calendar API
