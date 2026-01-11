# E2E Testing Guide - Browser Extension Installation

## Test Environment
- **Extension Version:** 1.4.1
- **Build Date:** 2026-01-11
- **Manifest Version:** 3
- **Test Browsers:** Chrome, Firefox

## Pre-Test Build Verification

### Build Status: ✅ PASSED
```bash
cd frontend
npm run build:chrome
```

**Build Results:**
- ✅ Build completed successfully
- ✅ service-worker.js generated (0.89 kB)
- ✅ manifest.json includes required permissions (storage, identity, alarms, unlimitedStorage)
- ✅ Theme data properly injected into index.html
- ✅ All assets bundled correctly

**Build Output:**
```
dist/chrome/
├── index.html (4.65 kB)
├── manifest.json (888 bytes)
├── service-worker.js (0.89 kB)
├── icon.svg
├── metadata.json
└── assets/
    ├── index-tjzHASaM.js (255.29 kB)
    ├── index-_j6pHHUd.css (20.51 kB)
    ├── logger-D3-N29jF.js (0.15 kB)
    └── fonts/ (geist-mono-*.woff2)
```

## Installation Steps

### Chrome/Chromium Installation
1. Open Chrome/Edge/Brave browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `frontend/dist/chrome` directory
6. Extension should appear in the extensions list

### Firefox Installation
1. Open Firefox browser
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to `frontend/dist/firefox` and select `manifest.json`
5. Extension should appear in the temporary extensions list

## E2E Test Checklist

### Test 1: Extension Loads Without Errors
- [ ] Extension appears in browser extensions list
- [ ] Extension icon visible in toolbar (if applicable)
- [ ] Open DevTools Console (F12)
- [ ] Navigate to extension page (chrome-extension://<id>/index.html)
- [ ] **VERIFY:** No console errors (check for red errors)
- [ ] **VERIFY:** No console warnings about missing resources

**Expected Result:** Extension loads cleanly with no errors

### Test 2: Clock Widget Renders
- [ ] Open extension (new tab or popup)
- [ ] **VERIFY:** Clock widget is visible
- [ ] **VERIFY:** Current time displays correctly
- [ ] **VERIFY:** Date displays correctly
- [ ] **VERIFY:** Time updates every second
- [ ] Try toggling 12hr/24hr format in settings
- [ ] **VERIFY:** Format change persists after reload

**Expected Result:** Clock shows correct time and date, updates in real-time

### Test 3: Weather Widget Loads
- [ ] **VERIFY:** Weather widget is visible
- [ ] Check if location permission requested
- [ ] **VERIFY:** Current weather displays (or shows configuration prompt)
- [ ] **VERIFY:** Temperature unit (°C or °F) displays
- [ ] **VERIFY:** Weather icon/condition displays
- [ ] Check DevTools Network tab for OpenMeteo API calls
- [ ] **VERIFY:** 5-hour forecast displays (if enabled)

**Expected Result:** Weather loads from OpenMeteo API and displays correctly

### Test 4: Tasks Widget Displays
- [ ] **VERIFY:** Tasks widget is visible
- [ ] **VERIFY:** Task provider selector displays (local/todoist/google-tasks)
- [ ] Test Local Storage provider:
  - [ ] Add a new task
  - [ ] **VERIFY:** Task appears in list
  - [ ] Complete a task
  - [ ] **VERIFY:** Task shows as completed
  - [ ] Delete a task
  - [ ] **VERIFY:** Task is removed
- [ ] Reload extension
- [ ] **VERIFY:** Tasks persist after reload (chrome.storage.local)

**Expected Result:** Tasks can be created, completed, and deleted; data persists

### Test 5: Calendar Widget Shows Events
- [ ] **VERIFY:** Calendar widget is visible
- [ ] Check if Google sign-in required
- [ ] If signed in:
  - [ ] **VERIFY:** Today's events display
  - [ ] **VERIFY:** Event times are correct
  - [ ] **VERIFY:** Event titles are readable
- [ ] If not signed in:
  - [ ] **VERIFY:** Sign-in prompt displays
  - [ ] **VERIFY:** No console errors

**Expected Result:** Calendar widget displays or prompts for authentication

### Test 6: Links Widget Renders
- [ ] **VERIFY:** Links widget is visible
- [ ] **VERIFY:** Default links display (if configured)
- [ ] Try adding a new link via settings
- [ ] **VERIFY:** New link appears in grid
- [ ] Try reordering links (drag & drop if supported)
- [ ] **VERIFY:** Link order persists after reload

**Expected Result:** Links display and can be customized

### Test 7: Settings Modal Opens
- [ ] Click settings button/icon
- [ ] **VERIFY:** Settings modal opens
- [ ] **VERIFY:** All settings sections visible:
  - [ ] Display (font, theme)
  - [ ] Clock (time format, date format)
  - [ ] Weather (location, units)
  - [ ] Tasks (provider, API tokens)
  - [ ] Calendar (Google sign-in)
  - [ ] Background (opacity, refresh)
  - [ ] Links (add/edit/delete)
- [ ] Try changing a setting
- [ ] Close modal
- [ ] Reopen modal
- [ ] **VERIFY:** Setting change persisted
- [ ] Reload extension
- [ ] **VERIFY:** Setting still persisted (chrome.storage.sync)

**Expected Result:** Settings modal is fully functional and settings persist

### Test 8: Chrome Storage Verification
- [ ] Open DevTools → Application tab
- [ ] Navigate to Storage → Chrome Storage
- [ ] Check chrome.storage.sync:
  - [ ] **VERIFY:** `settings` object exists
  - [ ] **VERIFY:** Contains theme, timeFormat, etc.
- [ ] Check chrome.storage.local:
  - [ ] **VERIFY:** `local_tasks` exists (if tasks added)
  - [ ] **VERIFY:** `weather_data` exists (if weather loaded)
  - [ ] **VERIFY:** `migration_completed` flag is `true`

**Expected Result:** All data stored in chrome.storage, not localStorage

### Test 9: Service Worker Verification
- [ ] Navigate to `chrome://extensions/`
- [ ] Find the extension
- [ ] Click "Service worker" link (or "Inspect views: service worker")
- [ ] Service worker DevTools opens
- [ ] Check console for:
  - [ ] **VERIFY:** "Service worker initialized" message
  - [ ] **VERIFY:** "Created weatherRefresh alarm" message
  - [ ] **VERIFY:** No error messages
- [ ] In console, run: `chrome.alarms.getAll()`
- [ ] **VERIFY:** Returns array with `weatherRefresh` alarm
- [ ] **VERIFY:** Alarm has `periodInMinutes: 15`

**Expected Result:** Service worker is active and alarms are registered

### Test 10: Data Migration (First Install)
This test requires testing with fresh localStorage data.

**Setup:**
1. Uninstall extension
2. Add test data to localStorage (via console):
```javascript
localStorage.setItem('settings', JSON.stringify({
  currentTheme: 'nord',
  timeFormat: 24,
  showWeather: true
}))
localStorage.setItem('local_tasks', JSON.stringify([
  { id: '1', content: 'Test task', checked: false }
]))
```
3. Reload page
4. Install extension again

**Verification:**
- [ ] Open DevTools Console
- [ ] **VERIFY:** Console shows "Starting migration..."
- [ ] **VERIFY:** Console shows "Migration completed successfully"
- [ ] Check chrome.storage.sync:
  - [ ] **VERIFY:** `settings` contains migrated theme
- [ ] Check chrome.storage.local:
  - [ ] **VERIFY:** `local_tasks` contains test task
  - [ ] **VERIFY:** `migration_completed` is `true`
- [ ] **VERIFY:** Extension displays with nord theme
- [ ] **VERIFY:** Test task appears in tasks widget

**Expected Result:** localStorage data successfully migrates to chrome.storage on first load

## Known Issues

### Issue 1: Inline Theme Loader Uses localStorage
**Severity:** Medium
**Description:** The inline theme loader script in index.html still reads from `localStorage.getItem('settings')` instead of chrome.storage. This causes theme changes to not apply on reload until localStorage is manually updated.

**Workaround:** Theme will apply after app initialization, may cause brief flash of default theme.

**Fix Required:** Update inline script to use async chrome.storage or remove inline theme loader.

### Issue 2: A11y Warning in Build
**Severity:** Low
**Description:** Build shows warning about non-interactive `<nav>` element with interactive role in Drawer.svelte.

**Impact:** No functional impact, just an accessibility concern.

## Test Results Template

```
=== E2E TEST RESULTS ===
Date: [YYYY-MM-DD]
Tester: [Name]
Browser: [Chrome/Firefox] [Version]
OS: [Operating System]

Test 1: Extension Loads ........... [ PASS / FAIL ]
Test 2: Clock Widget .............. [ PASS / FAIL ]
Test 3: Weather Widget ............ [ PASS / FAIL ]
Test 4: Tasks Widget .............. [ PASS / FAIL ]
Test 5: Calendar Widget ........... [ PASS / FAIL ]
Test 6: Links Widget .............. [ PASS / FAIL ]
Test 7: Settings Modal ............ [ PASS / FAIL ]
Test 8: Chrome Storage ............ [ PASS / FAIL ]
Test 9: Service Worker ............ [ PASS / FAIL ]
Test 10: Data Migration ........... [ PASS / FAIL ]

Overall Result: [ PASS / FAIL ]

Notes:
[Add any observations, issues, or screenshots]

Console Errors:
[Copy any console errors here]
```

## Success Criteria

For this E2E test to pass:
- ✅ All 10 tests must pass
- ✅ No critical console errors
- ✅ All widgets render correctly
- ✅ Settings persist across reloads
- ✅ Service worker is active and alarms registered
- ✅ Data stored in chrome.storage (not localStorage)
- ✅ Migration completes successfully on first install

## Next Steps

After E2E test passes:
1. Test Google Tasks sign-in flow (subtask-6-3)
2. Test cross-device settings sync (subtask-6-4)
3. Test service worker background refresh (subtask-6-5)
4. Address known issues (inline theme loader)
5. Run final regression testing
