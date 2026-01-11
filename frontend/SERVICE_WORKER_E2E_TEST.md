# Service Worker Background Refresh E2E Test Guide

## Overview

This guide provides comprehensive end-to-end testing procedures for the **service worker background refresh** functionality in the re-start extension. The service worker runs in the background and periodically refreshes weather data every 15 minutes using `chrome.alarms`.

## Prerequisites

- Extension built successfully (`npm run build:chrome`)
- Chrome browser (version 88+)
- Extension installed as unpacked extension
- Weather location configured in settings

## Test Environment Setup

### 1. Install Extension

```bash
# Build the extension
cd frontend
npm run build:chrome

# Install in Chrome:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode" (top right)
# 3. Click "Load unpacked"
# 4. Select frontend/dist/chrome/
```

### 2. Configure Weather Location

1. Open the extension popup
2. Click the Settings icon (gear)
3. In Weather section:
   - Enable "Show weather"
   - Select "Manual" location mode
   - Enter latitude: `40.7128` (New York, for example)
   - Enter longitude: `-74.0060`
   - Select temperature unit (Celsius/Fahrenheit)
   - Select speed unit (km/h or mph)
4. Click "Save" and close settings

### 3. Access Service Worker Console

1. Open `chrome://extensions/`
2. Find "re-start" extension
3. Under the extension, click "service worker" link (blue text)
4. Service worker DevTools will open
5. Go to Console tab

**Note:** If service worker is inactive, interact with the extension (open popup) to wake it up.

---

## Test Scenarios

## Scenario 1: Service Worker Initialization and Alarm Creation

**Objective:** Verify service worker starts and creates the weatherRefresh alarm on extension installation.

### Steps:

1. **Reload the extension** (to trigger onInstalled event):
   - Go to `chrome://extensions/`
   - Click the reload icon for re-start extension
   - Immediately click "service worker" to open console

2. **Verify service worker initialization logs:**
   ```
   [ServiceWorker] Service worker initialized
   [ServiceWorker] Extension installed/updated: chrome_update
   [ServiceWorker] Created weatherRefresh alarm with 15min interval
   [ServiceWorker] Active alarms: ["weatherRefresh"]
   ```

3. **Verify alarm exists** in service worker console:
   ```javascript
   chrome.alarms.getAll().then(alarms => {
     console.log('Alarms:', alarms)
   })
   ```

   **Expected output:**
   ```javascript
   [
     {
       name: "weatherRefresh",
       periodInMinutes: 15,
       scheduledTime: 1736606340000 // Unix timestamp
     }
   ]
   ```

4. **Verify alarm properties:**
   - `name` is `"weatherRefresh"`
   - `periodInMinutes` is `15`
   - `scheduledTime` exists and is a future timestamp

### Success Criteria:

- ✅ Service worker console shows initialization logs
- ✅ Extension installed/updated log appears
- ✅ weatherRefresh alarm created
- ✅ chrome.alarms.getAll() returns weatherRefresh alarm
- ✅ Alarm has 15-minute period

### Debugging:

If alarm not created:
- Check service worker console for errors
- Verify manifest.json includes "alarms" permission
- Try uninstalling and reinstalling extension

---

## Scenario 2: Manual Alarm Trigger

**Objective:** Trigger the alarm manually to verify weather refresh logic without waiting 15 minutes.

### Steps:

1. **Open service worker console** (`chrome://extensions/` → service worker)

2. **Trigger alarm manually:**
   ```javascript
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

3. **Monitor console logs** (should appear within 1-2 seconds):
   ```
   [ServiceWorker] Alarm triggered: weatherRefresh
   [ServiceWorker] Starting background weather refresh
   [ServiceWorker] Fetching fresh weather data: {latitude: 40.7128, longitude: -74.006, tempUnit: "celsius", speedUnit: "kmh"}
   [Weather] Syncing weather data: {latitude: 40.7128, longitude: -74.006, tempUnit: "celsius", speedUnit: "kmh"}
   [Weather] Weather sync successful
   [ServiceWorker] Background weather refresh completed successfully
   ```

4. **Verify Network tab** (in service worker DevTools):
   - Go to Network tab
   - Look for request to `https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006...`
   - Status should be `200 OK`
   - Response should contain JSON with weather data

5. **Verify chrome.storage.local updated:**
   ```javascript
   chrome.storage.local.get('weather_data', (result) => {
     console.log('Weather data:', result.weather_data)
   })
   ```

   **Expected output:**
   ```javascript
   {
     raw: {
       current: { temperature_2m: 15, weather_code: 0, ... },
       hourly: { time: [...], temperature_2m: [...], ... }
     },
     timestamp: 1736606340123,
     latitude: 40.7128,
     longitude: -74.006
   }
   ```

6. **Verify timestamp is recent** (within last few seconds):
   ```javascript
   chrome.storage.local.get('weather_data', (result) => {
     const age = Date.now() - result.weather_data.timestamp
     console.log('Cache age (seconds):', Math.floor(age / 1000))
   })
   ```

   **Expected:** Age should be < 10 seconds

### Success Criteria:

- ✅ Manual alarm trigger succeeds
- ✅ Console logs show weather refresh started
- ✅ Network request to OpenMeteo API succeeds (200 OK)
- ✅ Weather data saved to chrome.storage.local
- ✅ Timestamp is recent (within last 10 seconds)
- ✅ Data includes current and hourly weather
- ✅ Latitude and longitude match settings

### Debugging:

If no logs appear:
- Service worker may be terminated; wake it by opening popup
- Check for errors in console
- Verify weather is enabled in settings

If network request fails:
- Check internet connection
- Verify host_permissions in manifest.json includes `https://api.open-meteo.com/*`
- Check if API is rate-limited

---

## Scenario 3: Popup Displays Updated Weather

**Objective:** Verify the extension popup displays the weather data refreshed by the service worker.

### Steps:

1. **Trigger weather refresh** (from Scenario 2):
   ```javascript
   // In service worker console
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

2. **Wait for refresh to complete** (watch for success log):
   ```
   [ServiceWorker] Background weather refresh completed successfully
   ```

3. **Open extension popup:**
   - Click the re-start extension icon in toolbar
   - Popup should open and display weather widget

4. **Verify weather widget displays:**
   - Current temperature (e.g., "15°")
   - Weather description (e.g., "clear sky")
   - Apparent temperature ("Feels like X°")
   - Wind speed
   - Humidity percentage
   - 5 forecast items (3-hour intervals)

5. **Verify data matches chrome.storage:**
   ```javascript
   // In popup DevTools console (F12 when popup is open)
   chrome.storage.local.get('weather_data', (result) => {
     console.log('Current temp:', result.weather_data.raw.current.temperature_2m)
   })
   ```

   **Compare with displayed temperature** - should match

6. **Verify timestamp in popup DevTools:**
   ```javascript
   chrome.storage.local.get('weather_data', (result) => {
     const ageMinutes = Math.floor((Date.now() - result.weather_data.timestamp) / 60000)
     console.log('Weather age (minutes):', ageMinutes)
   })
   ```

   **Expected:** Should be < 1 minute if just refreshed

### Success Criteria:

- ✅ Weather widget displays in popup
- ✅ Current temperature matches chrome.storage data
- ✅ Weather description is accurate
- ✅ Forecast shows 5 future time slots
- ✅ Weather age is < 1 minute after refresh
- ✅ No console errors in popup

### Debugging:

If weather not displayed:
- Check if "Show weather" is enabled in settings
- Verify weather_data exists in chrome.storage.local
- Check popup console for errors
- Ensure location is configured

If temperature is stale:
- Check timestamp in chrome.storage.local
- Trigger manual refresh and reopen popup
- Verify service worker refresh completed successfully

---

## Scenario 4: Automatic Refresh After 15 Minutes

**Objective:** Verify the alarm triggers automatically every 15 minutes.

### Steps:

1. **Note current time** and alarm scheduled time:
   ```javascript
   // In service worker console
   chrome.alarms.getAll().then(alarms => {
     const alarm = alarms.find(a => a.name === 'weatherRefresh')
     const now = Date.now()
     const nextTrigger = alarm.scheduledTime
     const minutesUntil = Math.floor((nextTrigger - now) / 60000)
     console.log('Next alarm in:', minutesUntil, 'minutes')
   })
   ```

2. **Keep service worker console open** (prevents service worker termination)

3. **Wait for alarm to trigger** (up to 15 minutes from last trigger)
   - Leave browser open
   - Keep service worker console visible
   - Do NOT close the browser or reload extension

4. **Verify automatic trigger logs appear:**
   ```
   [ServiceWorker] Alarm triggered: weatherRefresh
   [ServiceWorker] Starting background weather refresh
   ...
   [ServiceWorker] Background weather refresh completed successfully
   ```

5. **Verify cache freshness check:**
   - If less than 15 minutes since last refresh, should see:
     ```
     [ServiceWorker] Weather cache still fresh, skipping refresh
     ```
   - If more than 15 minutes, should see:
     ```
     [ServiceWorker] Fetching fresh weather data
     ```

6. **Verify next alarm is scheduled:**
   ```javascript
   chrome.alarms.getAll().then(alarms => {
     console.log('Next alarm in:',
       Math.floor((alarms[0].scheduledTime - Date.now()) / 60000), 'min')
   })
   ```

   **Expected:** Should be ~15 minutes from now

### Success Criteria:

- ✅ Alarm triggers automatically after period expires
- ✅ Refresh logic executes (or skips if cache fresh)
- ✅ Next alarm is automatically rescheduled
- ✅ Service worker remains active (or restarts) to handle alarm
- ✅ No errors in console

### Debugging:

If alarm doesn't trigger:
- Service worker may have terminated; wake it by opening popup
- Check chrome.alarms.getAll() - alarm should still exist
- Verify browser wasn't closed (alarms persist, but service worker needs restart)
- Try creating alarm manually again

---

## Scenario 5: Cache Staleness Check

**Objective:** Verify service worker skips refresh if weather cache is still fresh (< 15 minutes old).

### Steps:

1. **Trigger fresh weather refresh:**
   ```javascript
   // In service worker console
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

2. **Wait for completion:**
   ```
   [ServiceWorker] Background weather refresh completed successfully
   ```

3. **Immediately trigger alarm again** (within 1 minute):
   ```javascript
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

4. **Verify cache freshness check logs:**
   ```
   [ServiceWorker] Alarm triggered: weatherRefresh
   [ServiceWorker] Starting background weather refresh
   [ServiceWorker] Weather cache still fresh, skipping refresh
   ```

5. **Verify no network request** in Network tab:
   - Go to Network tab in service worker DevTools
   - Should NOT see new request to `api.open-meteo.com`
   - Previous request should still be visible, but no new one

6. **Verify timestamp unchanged:**
   ```javascript
   chrome.storage.local.get('weather_data', (result) => {
     const ageMinutes = Math.floor((Date.now() - result.weather_data.timestamp) / 60000)
     console.log('Weather age (minutes):', ageMinutes)
   })
   ```

   **Expected:** Should be < 2 minutes (from first refresh)

7. **Manually invalidate cache and trigger:**
   ```javascript
   // Force cache to be stale
   chrome.storage.local.get('weather_data', (result) => {
     result.weather_data.timestamp = Date.now() - (16 * 60 * 1000) // 16 min ago
     chrome.storage.local.set({ weather_data: result.weather_data })
   })

   // Trigger alarm
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

8. **Verify refresh happens now:**
   ```
   [ServiceWorker] Fetching fresh weather data
   [Weather] Weather sync successful
   ```

### Success Criteria:

- ✅ Fresh cache (<15 min) is not refreshed
- ✅ Logs show "cache still fresh, skipping refresh"
- ✅ No network request when cache is fresh
- ✅ Timestamp remains unchanged
- ✅ Stale cache (>15 min) triggers refresh
- ✅ After manual invalidation, refresh happens

### Debugging:

If refresh happens when cache is fresh:
- Check isCacheStale() logic in weather-api.ts
- Verify cacheExpiry is 15 minutes (15 * 60 * 1000 ms)
- Check timestamp format in chrome.storage

---

## Scenario 6: Error Handling

**Objective:** Verify service worker handles errors gracefully (offline, API failures).

### Steps:

#### Test 6A: Offline Error Handling

1. **Disconnect from internet:**
   - Open Chrome DevTools Network tab in service worker console
   - Click "Offline" checkbox (throttling dropdown)

2. **Trigger weather refresh:**
   ```javascript
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

3. **Verify error logs:**
   ```
   [ServiceWorker] Alarm triggered: weatherRefresh
   [ServiceWorker] Starting background weather refresh
   [Weather] Failed to fetch weather data: <error details>
   [ServiceWorker] Weather refresh error: <error details>
   ```

4. **Verify error is logged but doesn't crash:**
   - Service worker should remain active
   - No unhandled promise rejections
   - Next alarm should still be scheduled

5. **Go back online and retry:**
   - Uncheck "Offline" in Network tab
   - Trigger alarm manually again
   - Verify success:
     ```
     [ServiceWorker] Background weather refresh completed successfully
     ```

#### Test 6B: Weather Disabled in Settings

1. **Disable weather in settings:**
   - Open popup → Settings
   - Uncheck "Show weather"
   - Save settings

2. **Trigger alarm:**
   ```javascript
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

3. **Verify skip log:**
   ```
   [ServiceWorker] Alarm triggered: weatherRefresh
   [ServiceWorker] Starting background weather refresh
   [ServiceWorker] Weather disabled in settings, skipping refresh
   ```

4. **Verify no network request** in Network tab

#### Test 6C: Location Not Configured

1. **Clear weather location:**
   - Open popup → Settings
   - Set latitude to empty or 0
   - Save settings

2. **Trigger alarm:**
   ```javascript
   chrome.alarms.create('weatherRefresh', { when: Date.now() })
   ```

3. **Verify skip log:**
   ```
   [ServiceWorker] Starting background weather refresh
   [ServiceWorker] Weather location not configured, skipping refresh
   ```

### Success Criteria:

- ✅ Offline errors are logged but don't crash service worker
- ✅ Service worker recovers when connection restored
- ✅ Weather disabled in settings → skip refresh gracefully
- ✅ Missing location → skip refresh gracefully
- ✅ All error paths log meaningful messages
- ✅ No unhandled promise rejections
- ✅ Alarms continue to trigger despite errors

### Debugging:

If service worker crashes on error:
- Check try-catch blocks in handleWeatherRefresh()
- Verify error handling in weather-api.ts
- Check for unhandled promise rejections in console

---

## Verification Checklist

Use this checklist to verify all aspects of service worker background refresh:

### Service Worker Setup
- [ ] Service worker registered in manifest.json
- [ ] Service worker loads without errors
- [ ] Initialization logs appear on extension install/reload
- [ ] Event listeners registered at top-level

### Alarm Configuration
- [ ] weatherRefresh alarm created on install
- [ ] Alarm period is 15 minutes
- [ ] chrome.alarms.getAll() shows weatherRefresh alarm
- [ ] Alarm persists across browser restarts

### Manual Trigger
- [ ] Manual trigger via chrome.alarms.create() works
- [ ] Alarm event fires within 1-2 seconds
- [ ] Handler function (handleWeatherRefresh) executes
- [ ] Logs appear in service worker console

### Weather API Integration
- [ ] Settings loaded from chrome.storage.sync
- [ ] Weather location checked before refresh
- [ ] WeatherAPI.sync() called with correct parameters
- [ ] Network request to api.open-meteo.com succeeds
- [ ] Response is 200 OK with valid JSON

### Storage Updates
- [ ] Weather data saved to chrome.storage.local
- [ ] Timestamp is current (within 10 seconds)
- [ ] Latitude/longitude match settings
- [ ] Data structure includes raw.current and raw.hourly

### Popup Display
- [ ] Popup displays updated weather data
- [ ] Current temperature matches chrome.storage
- [ ] Weather description is accurate
- [ ] Forecast shows 5 future time slots
- [ ] No console errors in popup

### Automatic Refresh
- [ ] Alarm triggers automatically after 15 minutes
- [ ] Refresh logic executes on auto-trigger
- [ ] Next alarm is rescheduled automatically
- [ ] Service worker handles periodic triggers

### Cache Freshness
- [ ] Fresh cache (<15 min) skips refresh
- [ ] Logs show "cache still fresh" message
- [ ] No network request when cache is fresh
- [ ] Stale cache (>15 min) triggers refresh

### Error Handling
- [ ] Offline errors are logged gracefully
- [ ] Service worker doesn't crash on errors
- [ ] Weather disabled → skip refresh
- [ ] Missing location → skip refresh
- [ ] Recovery works when error condition cleared

### Performance
- [ ] Refresh completes in < 5 seconds
- [ ] Service worker startup is fast (< 1 second)
- [ ] No memory leaks over multiple refreshes
- [ ] Network requests are efficient

---

## Common Issues and Solutions

### Issue: Service worker not showing in chrome://extensions

**Solution:**
- Reload the extension
- Check manifest.json has "background" section with service_worker
- Verify build output includes service-worker.js
- Try uninstalling and reinstalling extension

### Issue: Alarm not triggering

**Solution:**
- Check chrome.alarms.getAll() - alarm should exist
- Service worker may be terminated; open popup to wake it
- Verify "alarms" permission in manifest.json
- Try creating alarm manually to test

### Issue: Weather not refreshing

**Solution:**
- Check service worker console for errors
- Verify weather is enabled in settings
- Verify latitude/longitude are configured
- Check internet connection
- Look for API errors in Network tab

### Issue: "Failed to fetch" errors

**Solution:**
- Check host_permissions in manifest.json
- Verify `https://api.open-meteo.com/*` is allowed
- Check internet connection
- Try manual API request in Network tab

### Issue: Service worker console disappears

**Solution:**
- Service workers auto-terminate after 30 seconds idle
- Click "service worker" link again to reopen console
- Keep console open to prevent termination
- Or interact with extension to wake it

### Issue: Weather data not updating in popup

**Solution:**
- Check chrome.storage.local for weather_data
- Verify timestamp is recent
- Close and reopen popup to reload data
- Check popup console for errors

---

## Advanced Testing

### Test with Multiple Alarms

Create additional alarms to test service worker handles multiple events:

```javascript
// In service worker console
chrome.alarms.create('testAlarm1', { periodInMinutes: 1 })
chrome.alarms.create('testAlarm2', { delayInMinutes: 2 })

chrome.alarms.getAll().then(alarms => {
  console.log('All alarms:', alarms.map(a => a.name))
})
```

**Expected:** Service worker should handle unknown alarms gracefully (log warning).

### Test Service Worker Lifecycle

1. **Open service worker console**
2. **Wait 30 seconds** (service worker should terminate)
3. **Console will show "Inactive" status**
4. **Open popup** (wakes service worker)
5. **Console shows "Service worker initialized" again**
6. **Verify alarms still exist:**
   ```javascript
   chrome.alarms.getAll().then(console.log)
   ```

**Expected:** Alarms persist across service worker restarts.

### Test Concurrent Refreshes

Trigger multiple alarms rapidly to test concurrency:

```javascript
// In service worker console
for (let i = 0; i < 5; i++) {
  chrome.alarms.create('weatherRefresh', { when: Date.now() + i * 1000 })
}
```

**Expected:** Each refresh should complete or skip based on cache staleness. No race conditions or crashes.

---

## Test Results Template

Use this template to document your test results:

```markdown
# Service Worker Background Refresh E2E Test Results

**Tested by:** [Your Name]
**Date:** [YYYY-MM-DD]
**Extension version:** [Version from manifest.json]
**Chrome version:** [Check in chrome://version]

## Environment
- OS: [e.g., macOS 13.4]
- Chrome version: [e.g., 120.0.6099.109]
- Extension build: [e.g., dist/chrome from commit abc123]

## Test Results

### Scenario 1: Service Worker Initialization ✅ / ❌
- Service worker loads: ✅
- Alarm created on install: ✅
- chrome.alarms.getAll() works: ✅
- Notes: [Any observations]

### Scenario 2: Manual Alarm Trigger ✅ / ❌
- Manual trigger works: ✅
- Weather API called: ✅
- chrome.storage.local updated: ✅
- Notes: [Any observations]

### Scenario 3: Popup Displays Weather ✅ / ❌
- Weather widget renders: ✅
- Data matches storage: ✅
- Timestamp is recent: ✅
- Notes: [Any observations]

### Scenario 4: Automatic Refresh ✅ / ❌
- Alarm triggers after 15 min: ✅
- Refresh executes: ✅
- Next alarm scheduled: ✅
- Notes: [Any observations]

### Scenario 5: Cache Staleness ✅ / ❌
- Fresh cache skips refresh: ✅
- Stale cache triggers refresh: ✅
- No unnecessary API calls: ✅
- Notes: [Any observations]

### Scenario 6: Error Handling ✅ / ❌
- Offline errors handled: ✅
- Weather disabled handled: ✅
- Missing location handled: ✅
- Notes: [Any observations]

## Issues Found
[List any issues discovered during testing]

## Overall Result: ✅ PASS / ❌ FAIL

## Additional Notes
[Any other observations or comments]
```

---

## Success Criteria Summary

All scenarios must pass for E2E test to be considered successful:

1. ✅ Service worker initializes and creates weatherRefresh alarm
2. ✅ Manual alarm trigger executes weather refresh
3. ✅ Weather data updates in chrome.storage.local
4. ✅ Popup displays updated weather data
5. ✅ Automatic alarm triggers every 15 minutes
6. ✅ Cache freshness check prevents unnecessary refreshes
7. ✅ Error conditions handled gracefully
8. ✅ Service worker lifecycle works correctly
9. ✅ No console errors or crashes
10. ✅ Network requests are efficient and succeed

---

## References

- **Chrome Extensions Service Workers:** https://developer.chrome.com/docs/extensions/mv3/service_workers/
- **chrome.alarms API:** https://developer.chrome.com/docs/extensions/reference/alarms/
- **chrome.storage API:** https://developer.chrome.com/docs/extensions/reference/storage/
- **OpenMeteo API:** https://open-meteo.com/en/docs
- **Manifest V3 Migration:** https://developer.chrome.com/docs/extensions/mv3/intro/

---

## Appendix: Useful Console Commands

```javascript
// Check all alarms
chrome.alarms.getAll().then(alarms => {
  console.table(alarms)
})

// Check specific alarm
chrome.alarms.get('weatherRefresh').then(alarm => {
  console.log('Next trigger:', new Date(alarm.scheduledTime))
})

// Clear all alarms
chrome.alarms.clearAll()

// Trigger alarm immediately
chrome.alarms.create('weatherRefresh', { when: Date.now() })

// Check weather data
chrome.storage.local.get('weather_data', (result) => {
  console.log('Weather data:', result.weather_data)
  console.log('Age (minutes):', Math.floor((Date.now() - result.weather_data.timestamp) / 60000))
})

// Check settings
chrome.storage.sync.get('settings', (result) => {
  console.log('Settings:', result.settings)
  console.log('Weather enabled:', result.settings.showWeather)
  console.log('Location:', result.settings.latitude, result.settings.longitude)
})

// Clear weather cache
chrome.storage.local.remove('weather_data')

// Force stale cache
chrome.storage.local.get('weather_data', (result) => {
  result.weather_data.timestamp = Date.now() - (16 * 60 * 1000)
  chrome.storage.local.set({ weather_data: result.weather_data })
})
```

---

**End of Service Worker Background Refresh E2E Test Guide**
