# Cross-Device Settings Sync E2E Testing Guide

## Test Overview
**Subtask:** subtask-6-4
**Purpose:** Verify chrome.storage.sync cross-device settings synchronization
**Date:** 2026-01-11
**Prerequisites:** Extension installed on multiple browser instances with same Google account

## Test Environment Requirements

### Before Starting
- ✅ Extension built and installed (see build instructions below)
- ✅ Two browser instances required:
  - **Browser Instance A:** Primary Chrome browser (signed in to Google account)
  - **Browser Instance B:** Chrome Incognito OR separate Chrome profile (signed in to SAME Google account)
- ✅ Both instances have extension installed
- ✅ DevTools open (F12) in both instances
- ✅ Network connection active (sync requires internet)

### Required Permissions in manifest.json
```json
{
  "permissions": ["storage", "identity", "alarms"],
  "manifest_version": 3
}
```

### Extension Installation (Both Instances)

#### Build the Extension:
```bash
cd frontend
npm run build:chrome
# Output: frontend/dist/chrome/
```

#### Install in Browser Instance A (Primary):
1. Open Chrome browser (signed in to Google account)
2. Navigate to `chrome://extensions`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select `frontend/dist/chrome` directory
6. Note the extension ID (e.g., `abc123def456...`)
7. Pin the extension to toolbar for easy access

#### Install in Browser Instance B (Secondary):
**Option 1 - Incognito Window:**
1. Open Incognito window (Ctrl+Shift+N / Cmd+Shift+N)
2. Navigate to `chrome://extensions`
3. Find the re-start extension
4. Click "Details"
5. Enable "Allow in incognito"
6. Open extension in new tab

**Option 2 - Separate Profile:**
1. Create new Chrome profile (signed in to same Google account)
2. Navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `frontend/dist/chrome` directory
6. Extension will sync settings from other profiles

## Test Scenario 1: Basic Theme Sync

### Pre-Test Setup
1. **In Browser Instance A:**
   - Open extension (chrome-extension://<id>/index.html)
   - Open DevTools Console (F12)
   - Open Settings modal
   - Note current theme (should be "default")

2. **In Browser Instance B:**
   - Open extension in new tab
   - Open DevTools Console (F12)
   - Verify same theme as Instance A
   - Keep DevTools console visible

### Test Steps

#### Step 1: Change Theme in Instance A
- [ ] In **Browser Instance A**, open Settings modal
- [ ] Navigate to "Display" section
- [ ] Change theme from "default" to "rose-pine"
- [ ] Click outside modal to close (or click save if applicable)

**Expected Result:** Theme changes immediately in Instance A

**Console Verification (Instance A):**
```
[SettingsStore] Settings loaded from chrome.storage.sync
[SettingsStore] Saving settings to chrome.storage.sync
```

#### Step 2: Verify Sync to Instance B
- [ ] Switch to **Browser Instance B**
- [ ] Wait 1-5 seconds for sync propagation
- [ ] **VERIFY:** Theme automatically changes to "rose-pine"
- [ ] **VERIFY:** No page reload required
- [ ] **VERIFY:** Visual theme colors update (background, text, panels)

**Console Verification (Instance B):**
```
[SettingsStore] Settings updated from another device
```

**Expected Result:** Theme syncs automatically via chrome.storage.sync

#### Step 3: Verify chrome.storage.onChanged Listener
- [ ] In **Browser Instance B** DevTools Console, verify listener triggered
- [ ] Console should show "Settings updated from another device"
- [ ] Theme should apply without user interaction

**Expected Result:** onChange listener detects and applies changes

#### Step 4: Verify Storage Contents
In both instances, open DevTools → Application → Storage → chrome.storage:

**Sync Storage Verification:**
- [ ] Navigate to "chrome.storage → Sync"
- [ ] Find "settings" key
- [ ] **VERIFY:** `currentTheme: "rose-pine"` in both instances
- [ ] **VERIFY:** Settings objects are identical

**Expected Result:** chrome.storage.sync contains identical data in both instances

## Test Scenario 2: Multiple Settings Sync

### Test 2A: Sync Multiple Setting Changes

#### Steps:
1. In **Browser Instance A**, open Settings modal
2. Make multiple changes:
   - Change time format from "24hr" to "12hr"
   - Change date format from "dmy" to "mdy"
   - Change tab title from "~" to "my-startpage"
3. Close settings modal
4. Switch to **Browser Instance B**

**Verification:**
- [ ] **VERIFY:** Time format updates to 12hr in Instance B
- [ ] **VERIFY:** Date format updates to mdy in Instance B
- [ ] **VERIFY:** Tab title updates to "my-startpage" in Instance B
- [ ] **VERIFY:** All changes propagate within 5 seconds
- [ ] **VERIFY:** Console in B shows "Settings updated from another device"

**Chrome Storage Verification:**
In both instances, check chrome.storage.sync → settings:
- [ ] `timeFormat: "12hr"`
- [ ] `dateFormat: "mdy"`
- [ ] `tabTitle: "my-startpage"`

**Expected Result:** All setting changes sync simultaneously

### Test 2B: Sync Link Configuration

#### Steps:
1. In **Browser Instance A**, open Settings modal → Links tab
2. Add new link:
   - Title: "test-sync"
   - URL: "https://example.com/sync-test"
3. Save settings
4. Switch to **Browser Instance B**

**Verification:**
- [ ] **VERIFY:** New link appears in Links widget in Instance B
- [ ] **VERIFY:** Link is clickable and has correct URL
- [ ] **VERIFY:** Link position matches Instance A

**Expected Result:** Link configuration syncs across devices

## Test Scenario 3: Bidirectional Sync

### Test 3A: Change Settings in Instance B

#### Steps:
1. In **Browser Instance B**, open Settings modal
2. Change background opacity from default (0.85) to 0.5
3. Close settings modal
4. Switch to **Browser Instance A**

**Verification:**
- [ ] **VERIFY:** Background opacity updates to 0.5 in Instance A
- [ ] **VERIFY:** Console in A shows "Settings updated from another device"
- [ ] **VERIFY:** Visual background opacity changes in Instance A
- [ ] **VERIFY:** chrome.storage.sync matches in both instances

**Expected Result:** Bidirectional sync works (B → A)

### Test 3B: Rapid Alternating Changes

#### Steps:
1. In **Browser Instance A**, change theme to "catppuccin-mocha"
2. Immediately in **Browser Instance B**, change theme to "nord"
3. Wait 5 seconds
4. Check which theme "wins" (last write wins)

**Verification:**
- [ ] **VERIFY:** Both instances eventually show same theme
- [ ] **VERIFY:** Last change propagates to both instances
- [ ] **VERIFY:** No console errors about sync conflicts
- [ ] **VERIFY:** chrome.storage.sync shows consistent state

**Expected Result:** Last write wins, eventual consistency achieved

## Test Scenario 4: Sync Delay and Performance

### Test 4A: Measure Sync Latency

#### Steps:
1. In **Browser Instance A**, note current time
2. Change a setting (e.g., toggle showWeather)
3. In **Browser Instance B**, watch console
4. Note time when "Settings updated from another device" appears
5. Calculate sync latency

**Verification:**
- [ ] **VERIFY:** Sync latency < 5 seconds (typical: 1-3 seconds)
- [ ] **VERIFY:** UI updates immediately after onChange event
- [ ] **VERIFY:** No visual glitches during sync

**Expected Result:** Low latency sync (1-5 seconds typical)

### Test 4B: Test Offline Behavior

#### Steps:
1. In **Browser Instance B**, enable offline mode (DevTools → Network → Offline)
2. In **Browser Instance A**, change theme to "gruvbox"
3. Wait 10 seconds
4. In **Browser Instance B**, disable offline mode

**Verification:**
- [ ] **VERIFY:** Instance B doesn't update while offline
- [ ] **VERIFY:** When back online, Instance B syncs within 5-10 seconds
- [ ] **VERIFY:** Theme updates to "gruvbox" in Instance B
- [ ] **VERIFY:** Console shows delayed "Settings updated from another device"

**Expected Result:** Sync resumes when connection restored

## Test Scenario 5: Storage Limit Verification

### Test 5A: Check Storage Quota Usage

#### Steps:
1. In **Browser Instance A** DevTools Console, run:
   ```javascript
   // Check current sync storage usage
   chrome.storage.sync.getBytesInUse('settings', (bytes) => {
     console.log(`Settings size: ${bytes} bytes`)
     console.log(`Quota limit: 8KB per item, 100KB total`)
     console.log(`Remaining: ${8192 - bytes} bytes for this item`)
   })
   ```

**Verification:**
- [ ] **VERIFY:** Settings size is well under 8KB limit
- [ ] **VERIFY:** Console shows size in bytes
- [ ] **VERIFY:** No quota exceeded errors

**Expected Result:** Settings fit within chrome.storage.sync limits

### Test 5B: Large Custom CSS Test

#### Steps:
1. In **Browser Instance A**, open Settings → Display → Custom CSS
2. Add large custom CSS (≈2KB):
   ```css
   body { background: linear-gradient(to bottom, #1e1e2e, #181825); }
   .widget { border: 2px solid #89b4fa; }
   /* Add more CSS rules to increase size */
   ```
3. Save settings
4. Switch to **Browser Instance B**

**Verification:**
- [ ] **VERIFY:** Custom CSS syncs to Instance B
- [ ] **VERIFY:** CSS rules applied in Instance B
- [ ] **VERIFY:** No quota errors in console
- [ ] **VERIFY:** Settings still under 8KB limit

**Expected Result:** Custom CSS syncs correctly within quota

## Verification Checklist

### Pre-Test Code Verification
Before running tests, verify implementation:
- [ ] `settings-store.svelte.ts` uses `syncStorage.get()` and `syncStorage.set()`
- [ ] `initSettings()` registers `syncStorage.onChange()` listener (line 123)
- [ ] Settings reactive state uses Svelte 5 `$state` rune
- [ ] No localStorage usage for settings (migrated to chrome.storage.sync)

### Runtime Verification (During Tests)
Monitor in both browser instances:
- [ ] Console logs "Settings loaded from chrome.storage.sync" on startup
- [ ] Console logs "Settings updated from another device" on remote changes
- [ ] No console errors during sync operations
- [ ] UI updates reactively without page reload
- [ ] chrome.storage.sync shows identical data in both instances

### Storage Structure Verification
Verify chrome.storage.sync → settings contains:
```json
{
  "font": "Geist Mono Variable",
  "currentTheme": "rose-pine",
  "tabTitle": "~",
  "timeFormat": "24hr",
  "dateFormat": "dmy",
  "showWeather": true,
  "showTasks": true,
  "showCalendar": true,
  "showBackground": false,
  "showLinks": true,
  "links": [...],
  "customCSS": ""
}
```

## Success Criteria

All tests must pass:
- ✅ **Theme Sync:** Theme changes propagate between instances
- ✅ **onChange Listener:** Listener detects and applies remote changes
- ✅ **Multiple Settings:** Multiple setting changes sync together
- ✅ **Bidirectional Sync:** Changes sync from both A→B and B→A
- ✅ **Low Latency:** Sync occurs within 1-5 seconds
- ✅ **Offline Resilience:** Sync resumes after reconnection
- ✅ **Storage Limits:** Settings stay within 8KB quota
- ✅ **No Errors:** No console errors during sync operations

## Test Results Template

```
=== CROSS-DEVICE SETTINGS SYNC E2E TEST RESULTS ===
Date: 2026-01-11
Tester: [Name]
Browser: Chrome [Version]
Extension Version: 1.4.1

Environment Setup:
  - Browser Instance A .................. [ READY / NOT READY ]
  - Browser Instance B .................. [ READY / NOT READY ]
  - Same Google account ................. [ YES / NO ]
  - Extension installed in both ......... [ YES / NO ]

Scenario 1: Basic Theme Sync
  - Theme change in Instance A .......... [ PASS / FAIL ]
  - Sync to Instance B .................. [ PASS / FAIL ]
  - onChange listener triggered ......... [ PASS / FAIL ]
  - Storage contents match .............. [ PASS / FAIL ]

Scenario 2: Multiple Settings Sync
  - Multiple changes sync ............... [ PASS / FAIL ]
  - Link configuration sync ............. [ PASS / FAIL ]

Scenario 3: Bidirectional Sync
  - B → A sync .......................... [ PASS / FAIL ]
  - Rapid alternating changes ........... [ PASS / FAIL ]

Scenario 4: Sync Performance
  - Sync latency < 5 seconds ............ [ PASS / FAIL ]
  - Offline/online behavior ............. [ PASS / FAIL ]

Scenario 5: Storage Limits
  - Settings under 8KB quota ............ [ PASS / FAIL ]
  - Large custom CSS sync ............... [ PASS / FAIL ]

Overall Result: [ PASS / FAIL ]

Sync Latency Measured: _____ seconds

Notes:
[Add observations about sync behavior]

Console Logs (Instance A):
[Copy relevant console output]

Console Logs (Instance B):
[Copy relevant console output]

Storage Contents (chrome.storage.sync → settings):
[Paste JSON from DevTools]
```

## Debugging Tips

### Common Issues

**Issue:** Changes don't sync between instances
- **Check:** Both instances signed in to same Google account
- **Check:** Internet connection active in both instances
- **Check:** Chrome sync enabled (chrome://settings/syncSetup)
- **Fix:** Sign out and sign back in to Chrome

**Issue:** onChange listener not triggered
- **Check:** Console for "Settings loaded from chrome.storage.sync"
- **Check:** initSettings() called in main.ts
- **Fix:** Verify syncStorage.onChange() registered in settings-store.ts

**Issue:** Sync is very slow (> 10 seconds)
- **Check:** Network connection quality
- **Check:** Chrome sync server status
- **Fix:** Wait longer or restart Chrome sync

**Issue:** Settings revert after sync
- **Check:** Both instances making concurrent changes
- **Fix:** Last write wins - make changes in one instance at a time

**Issue:** Quota exceeded error
- **Check:** Settings size with chrome.storage.sync.getBytesInUse()
- **Check:** Custom CSS size (should be < 5KB)
- **Fix:** Reduce custom CSS or move large data to chrome.storage.local

### Useful Console Commands

```javascript
// ===== Browser Instance A & B - Check Current Settings =====
const settings = await chrome.storage.sync.get('settings')
console.log('Current settings:', settings)

// ===== Check Storage Quota Usage =====
chrome.storage.sync.getBytesInUse('settings', (bytes) => {
  console.log(`Settings size: ${bytes} bytes (limit: 8KB)`)
  console.log(`Percentage used: ${(bytes / 8192 * 100).toFixed(1)}%`)
})

// ===== Check Total Sync Storage Usage =====
chrome.storage.sync.getBytesInUse(null, (bytes) => {
  console.log(`Total sync storage: ${bytes} bytes (limit: 100KB)`)
})

// ===== Monitor Storage Changes in Real-Time =====
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log(`Storage area '${areaName}' changed:`)
  for (let key in changes) {
    console.log(`  ${key}:`)
    console.log(`    Old:`, changes[key].oldValue)
    console.log(`    New:`, changes[key].newValue)
  }
})

// ===== Manually Trigger Setting Change (for testing) =====
const currentSettings = await chrome.storage.sync.get('settings')
currentSettings.settings.currentTheme = 'tokyo-night'
await chrome.storage.sync.set(currentSettings)
console.log('Theme changed to tokyo-night')

// ===== Check Chrome Sync Status =====
console.log('Chrome sync enabled:', navigator.onLine)
console.log('Extension ID:', chrome.runtime.id)

// ===== Force Settings Reload (for debugging) =====
// Note: This is for debugging only - normal flow shouldn't need this
const freshSettings = await chrome.storage.sync.get('settings')
console.log('Reloaded settings:', freshSettings)
```

## Advanced Testing

### Test with Chrome Sync Disabled

#### Steps:
1. In **Browser Instance A**, go to chrome://settings/syncSetup
2. Disable sync for "Extensions"
3. Try changing theme
4. Check if sync still works (it shouldn't)

**Expected Result:** chrome.storage.sync requires Chrome sync enabled

### Test with Multiple Profiles (3+ Instances)

#### Steps:
1. Create 3 Chrome profiles with same Google account
2. Install extension in all 3 profiles
3. Change settings in Profile A
4. Verify sync to Profiles B and C

**Expected Result:** Settings sync to all profiles simultaneously

### Stress Test: Rapid Changes

#### Steps:
1. In **Browser Instance A**, rapidly change theme 10 times
2. Monitor **Browser Instance B** console
3. Verify all changes eventually propagate

**Expected Result:** Final state syncs correctly (last write wins)

## Next Steps After Test Completion

1. Document test results in test results template
2. File bugs for any sync failures or delays
3. Update implementation_plan.json to mark subtask-6-4 as completed
4. Proceed to subtask-6-5: Service worker background refresh testing
5. Complete final QA verification

## References

- Chrome Storage API: https://developer.chrome.com/docs/extensions/reference/storage/
- Chrome Sync Documentation: https://developer.chrome.com/docs/extensions/reference/storage/#property-sync
- Storage Limits: https://developer.chrome.com/docs/extensions/reference/storage/#property-sync-QUOTA_BYTES
- Manifest V3 Storage: https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#storage

## Implementation Notes

**Code Location:**
- Settings store: `frontend/src/lib/settings-store.svelte.ts`
- Storage adapter: `frontend/src/lib/storage-adapter.ts`
- Main initialization: `frontend/src/main.ts`

**Key Implementation Details:**
- Settings use `chrome.storage.sync` for cross-device sync (line 2 in settings-store.ts)
- onChange listener registered in `initSettings()` (line 123 in settings-store.ts)
- Reactive state uses Svelte 5 `$state` rune (line 108 in settings-store.ts)
- Settings saved via `saveSettings()` async function (line 78 in settings-store.ts)
- Storage quota: 100KB total, 8KB per item for sync storage

**Migration Notes:**
- Old implementation used localStorage (synchronous)
- New implementation uses chrome.storage.sync (asynchronous)
- Migration happens automatically on first load via migration.ts
- No localStorage fallback (pure chrome.storage implementation)
