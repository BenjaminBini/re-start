# re-start

a tui-style browser startpage, built with svelte.

features:

- task management (local storage, Todoist, or Google Tasks)
- smart date parsing for tasks (supports 'tomorrow', 'next friday', 'jan 15', '12/31', and more)
- Google Calendar integration (today's events with Meet links)
- daily background images (from Unsplash with photographer credits, auto-refreshes daily, configurable opacity)
- weather with 24-hour forecast (from open-meteo, configurable temperature and wind speed units)
- customizable quick links
- extensive customization (custom CSS, 12/24hr time format, mdy/dmy date format, drag-to-reorder links)
- 8 color themes (default, rosé pine, catppuccin mocha/latte, nord, tokyo night, gruvbox, everforest)
- lightweight & performant

📖 **[Configuration Guide](CONFIGURATION.md)** - Learn how to set up and customize all features

<img width="2331" height="1319" alt="image" src="https://github.com/user-attachments/assets/e3164af7-fc42-4caf-81ee-a049e05b84c7" />

## installation

### firefox

1. go to <https://addons.mozilla.org/en-US/firefox/addon/d004c62a8aed4f3b8ddd/>.
2. click "Add to Firefox".
3. make sure to click "Add" and "Keep Changes" when prompted.

### chrome/edge

1. go to <https://chromewebstore.google.com/detail/re-start/fdodcmjeojbmcgmhcgcelffcekhicnop>.
2. click "Add to [Browser]".
3. make sure to click "Add extension" and "Keep it" when prompted.

## usage tips

**📖 For detailed setup instructions, see [CONFIGURATION.md](CONFIGURATION.md)** - comprehensive guide covering all features, integrations, and customization options.

quick tips:
- hover your cursor on the top right corner of the startpage, and you should see a settings button appear. click it to configure settings.
- to get your todoist api token, open the todoist website and click your profile in the top left. then go to "Settings" > "Integrations" > "Developer" > "Copy API Token".
- the 'x tasks' text is also a clickable link to todoist.
- you can force a refresh of the weather and todoist widgets by clicking the top left panel labels.
- **natural language date parsing** - when adding tasks, just type dates naturally (e.g., "tomorrow", "next friday", "jan 15", "weekend 3pm") and they'll be automatically detected. see [CONFIGURATION.md](CONFIGURATION.md#natural-language-date-parsing) for all supported formats.
- the ping stat is based on how long a request to <https://www.google.com/generate_204> takes. don't take it too seriously.
- here's a matching [firefox color theme](https://color.firefox.com/?theme=XQAAAAK3BAAAAAAAAABBqYhm849SCicxcUhA3DJozHnOMuotJJDtxcajvY2nrbwtWf53IW6FuMhmsQBmHjQtYV0LyoGIJnESUiSA8WGCMfXU1SYqmE_CaU8iA8bQXAYc2jrXIT6bjoi8T-cSTCi2_9o7kcESfauVKnMZKEKJIeeuT9qsP4Z_T2ya4LBqvZWjm1-pHOmWMq1OU0wrgs4bkzHQWozn4dcm22eBmWyWR55FkcmEsPvvHzhHCZ2ZMQrPXQqrOBLr79GTkJUGa5oslhWTp2LYqdD2gNQ1a8_c5-F91bPVmQerXZWpp-OZ11D1Ai6t1ydqjbVKD3RrGXYJwhcQaAxCKa_ft4VoGrVBq8AXYeJOZdXuOxnYXGhOXXSK_NybBfJLm-2W28qSSdoiW0pTL-iFan3xQQeC0WlSrnRYrRjh7HkgLuI-Ft8Fq5kNC7nVXoo8j9Ml_q2AO_RhE116j_MECbspxaJP58juayX_wNty3V2g5zUsf0gSqpEWGT02oZAF2z6LABKRWTO28wIoMUDvj9WAQGsup95WAmNW7g4WMEIgaiJhmBz9koq0wV7gHQtJB_0x2lJ7WQ488bJi8LvqnW-VT3kZ3GJtyv-yXmRJ)!

## development / build from source

**note**: this project has separate `frontend/` and `backend/` directories. the backend is required for Google OAuth (Google Tasks and Google Calendar features). if you're not using Google integrations, you can skip the backend setup and just run the frontend.

1. clone this repo (requires node.js).
2. install dependencies:
   - frontend: `cd frontend && npm i`
   - backend (if using Google features): `cd backend && npm i`
3. start development servers:
   - **terminal 1** (backend, optional if not using Google features): `cd backend && node server.js` - runs on port 3004
   - **terminal 2** (frontend): `cd frontend && npm run dev` - runs on port 5173
   - the frontend dev server proxies `/api/*` requests to the backend for Google OAuth

### building the extension

all build commands should be run from the `frontend/` directory:

4. **watch mode**: `cd frontend && npm run watch` - builds the extension and watches for changes. this can be used with `web-ext run` to test in firefox.
5. **production builds**:
   - firefox: `cd frontend && npm run build:firefox` - outputs to `frontend/dist/firefox/`
   - chrome: `cd frontend && npm run build:chrome` - outputs to `frontend/dist/chrome/`

### running tests

tests are run using vitest from the `frontend/` directory:

```bash
cd frontend && npm test
```
