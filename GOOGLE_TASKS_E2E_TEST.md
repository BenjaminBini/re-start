# Google Tasks E2E Testing Guide

## Test Overview
**Subtask:** subtask-6-3
**Purpose:** Verify Google Tasks integration using chrome.identity OAuth flow
**Date:** 2026-01-11
**Prerequisites:** Extension installed with manifest.json oauth2 configuration

## Test Environment Requirements

### Before Starting
- ✅ Extension built and installed (see E2E_TEST_GUIDE.md)
- ✅ Chrome browser with valid Google account signed in
- ✅ DevTools open (F12) to monitor console and network
- ✅ Google Tasks API enabled in Google Cloud Console
- ✅ OAuth client_id configured in manifest.json

### Required Permissions in manifest.json
```json
{
  "permissions": ["storage", "identity", "alarms"],
  "oauth2": {
    "client_id": "317653837986-8hsogqkfab632ducq6k0jcpngn1iub6a.apps.googleusercontent.com",
    "scopes": [
      "https://www.googleapis.com/auth/tasks",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  }
}
```

## Test Scenario 1: Google Tasks Sign-In Flow

### Pre-Test Setup
1. Open extension in new tab (chrome-extension://<id>/index.html)
2. Open DevTools Console (F12)
3. Navigate to Application → Storage → chrome.storage.local
4. Clear any existing Google auth tokens:
   - Delete `google_access_token`
   - Delete `google_token_expiry`
   - Delete `google_token_scopes`
   - Delete `google_user_email`

### Test Steps

#### Step 1: Click Google Tasks Sign-In Button
- [ ] In extension UI, find Tasks widget
- [ ] Select "Google Tasks" from provider dropdown
- [ ] **VERIFY:** Sign-in button appears
- [ ] Click "Sign in with Google" button

**Expected Result:** Button click triggers sign-in flow

#### Step 2: Complete chrome.identity OAuth Flow
- [ ] **VERIFY:** OAuth popup window opens
- [ ] **VERIFY:** Google account selector appears
- [ ] Select Google account to authenticate
- [ ] **VERIFY:** Permission consent screen shows requested scopes:
  - "View and manage your tasks"
  - "View your calendars"
  - "View your email address"
- [ ] Click "Allow" to grant permissions

**Expected Result:** OAuth consent granted, popup closes automatically

**Console Verification:**
```
[GoogleAuth] Attempting sign in
[GoogleAuth] Sign in successful, access token obtained
[GoogleAuth] Storing tokens
```

#### Step 3: Verify Tasks Load from Google Tasks API
- [ ] Wait for OAuth popup to close
- [ ] **VERIFY:** Tasks widget shows loading state
- [ ] Open DevTools Network tab
- [ ] **VERIFY:** Network request to `https://www.googleapis.com/tasks/v1/users/@me/lists`
- [ ] **VERIFY:** Network request to `https://www.googleapis.com/tasks/v1/lists/{listId}/tasks`
- [ ] **VERIFY:** Response status 200 OK
- [ ] **VERIFY:** Response includes Authorization header with Bearer token
- [ ] **VERIFY:** Tasks from Google Tasks API display in widget
- [ ] **VERIFY:** Task count matches Google Tasks web UI

**Expected Result:** Tasks successfully fetched and displayed

**Chrome Storage Verification:**
Navigate to DevTools → Application → Storage → chrome.storage.local:
- [ ] **VERIFY:** `google_access_token` exists (starts with "ya29.")
- [ ] **VERIFY:** `google_token_expiry` exists (timestamp in future)
- [ ] **VERIFY:** `google_token_scopes` exists (array of 3 scopes)
- [ ] **VERIFY:** `google_user_email` exists (your Google email)

## Test Scenario 2: Task Operations

### Pre-Condition
- User signed in to Google Tasks
- Tasks visible in widget

### Test 2A: Add New Task via UI

#### Steps:
1. Find "Add task" input field in Tasks widget
2. Enter task content: "Test task from extension E2E"
3. Press Enter or click "Add" button
4. Open DevTools Network tab

**Verification:**
- [ ] **VERIFY:** Network request to `POST https://www.googleapis.com/tasks/v1/lists/{listId}/tasks`
- [ ] **VERIFY:** Request body includes task title
- [ ] **VERIFY:** Response status 200 OK
- [ ] **VERIFY:** Response includes created task with ID
- [ ] **VERIFY:** New task appears at top of task list
- [ ] **VERIFY:** Task appears in Google Tasks web UI (tasks.google.com)

**Console Verification:**
```
[GoogleTasksProvider] Adding task: Test task from extension E2E
[GoogleTasksProvider] Task added successfully
```

**Expected Result:** Task created successfully in both extension and Google Tasks

### Test 2B: Complete Existing Task

#### Steps:
1. Find an uncompleted task in the task list
2. Click the checkbox/complete button next to the task
3. Watch DevTools Network tab

**Verification:**
- [ ] **VERIFY:** Network request to `POST https://www.googleapis.com/tasks/v1/lists/{listId}/tasks/{taskId}/move`
- [ ] **VERIFY:** OR `PATCH https://www.googleapis.com/tasks/v1/lists/{listId}/tasks/{taskId}` with status: "completed"
- [ ] **VERIFY:** Response status 200 OK
- [ ] **VERIFY:** Task shows as completed (strikethrough or moved to completed section)
- [ ] **VERIFY:** Task marked complete in Google Tasks web UI

**Expected Result:** Task completion syncs to Google Tasks API

### Test 2C: Uncomplete Task

#### Steps:
1. Find a recently completed task (shows for 5 minutes)
2. Click to uncomplete the task
3. Watch DevTools Network tab

**Verification:**
- [ ] **VERIFY:** Network request to update task status
- [ ] **VERIFY:** Response status 200 OK
- [ ] **VERIFY:** Task moves back to uncompleted section
- [ ] **VERIFY:** Task unmarked in Google Tasks web UI

**Expected Result:** Task uncomplete syncs to Google Tasks API

### Test 2D: Delete Task

#### Steps:
1. Find a task to delete (use the test task created in 2A)
2. Click delete/remove button (or swipe/trash icon)
3. Watch DevTools Network tab

**Verification:**
- [ ] **VERIFY:** Network request to `DELETE https://www.googleapis.com/tasks/v1/lists/{listId}/tasks/{taskId}`
- [ ] **VERIFY:** Response status 204 No Content OR 200 OK
- [ ] **VERIFY:** Task removed from task list
- [ ] **VERIFY:** Task deleted in Google Tasks web UI

**Expected Result:** Task deletion syncs to Google Tasks API

## Test Scenario 3: Token Refresh

### Pre-Condition
- User signed in to Google Tasks
- Access token stored in chrome.storage.local

### Test 3A: Token Refresh Before Expiry

#### Steps:
1. Open DevTools → Application → Storage → chrome.storage.local
2. Note current `google_token_expiry` value
3. Manually set `google_token_expiry` to near-future time (5 minutes from now):
   ```javascript
   const nearFuture = Date.now() + (4 * 60 * 1000) // 4 minutes from now
   await chrome.storage.local.set({ google_token_expiry: nearFuture })
   ```
4. Trigger a task sync (add/complete/delete task)
5. Watch DevTools Console

**Verification:**
- [ ] **VERIFY:** Console shows token refresh attempt
- [ ] **VERIFY:** chrome.identity.getAuthToken() called with `interactive: false`
- [ ] **VERIFY:** New access token obtained
- [ ] **VERIFY:** `google_token_expiry` updated to new future time
- [ ] **VERIFY:** Task operation completes successfully

**Console Verification:**
```
[GoogleAuth] Token needs refresh
[GoogleAuth] Refreshing token via chrome.identity
[GoogleAuth] Token refreshed successfully
```

**Expected Result:** Token auto-refreshes before expiration

## Test Scenario 4: Sign-Out and Token Revocation

### Pre-Condition
- User signed in to Google Tasks
- Tasks visible in widget

### Test 4A: Sign Out

#### Steps:
1. Find "Sign out" or account menu in Tasks widget
2. Click "Sign out" button
3. Watch DevTools Console
4. Watch DevTools Network tab (may show revocation request)

**Verification:**
- [ ] **VERIFY:** Console shows sign-out initiated
- [ ] **VERIFY:** chrome.identity.removeCachedAuthToken() called
- [ ] **VERIFY:** chrome.identity.clearAllCachedAuthTokens() called
- [ ] **VERIFY:** Sign-in button reappears
- [ ] **VERIFY:** Tasks cleared from UI

**Console Verification:**
```
[GoogleAuth] Signing out
[GoogleAuth] Token removed from cache
[GoogleAuth] All cached tokens cleared
[GoogleAuth] Sign out complete
```

**Chrome Storage Verification:**
Navigate to DevTools → Application → Storage → chrome.storage.local:
- [ ] **VERIFY:** `google_access_token` removed
- [ ] **VERIFY:** `google_token_expiry` removed
- [ ] **VERIFY:** `google_token_scopes` removed
- [ ] **VERIFY:** `google_user_email` removed

**Expected Result:** All auth data cleared, user signed out

### Test 4B: Verify Token Revoked

#### Steps:
1. After sign-out, manually check if token is truly revoked
2. Open new DevTools Console
3. Try to use old token (if you copied it before sign-out):
   ```javascript
   const oldToken = 'ya29...' // paste old token
   const response = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
     headers: { 'Authorization': `Bearer ${oldToken}` }
   })
   console.log(response.status) // Should be 401 Unauthorized
   ```

**Verification:**
- [ ] **VERIFY:** Old token returns 401 Unauthorized
- [ ] **VERIFY:** Cannot access API with revoked token

**Expected Result:** Token properly revoked and unusable

## Test Scenario 5: Error Handling

### Test 5A: Offline Sign-In Attempt

#### Steps:
1. Sign out from Google Tasks (if signed in)
2. Disable network connection (airplane mode or DevTools offline mode)
3. Click "Sign in with Google"

**Verification:**
- [ ] **VERIFY:** Error message shows "Network error" or "Cannot connect"
- [ ] **VERIFY:** User-friendly error message displayed
- [ ] **VERIFY:** No console stack traces (errors logged cleanly)

**Expected Result:** Graceful offline error handling

### Test 5B: Token Revoked Externally

#### Steps:
1. Sign in to Google Tasks
2. Go to https://myaccount.google.com/permissions
3. Find the re-start extension in third-party access
4. Click "Remove access"
5. Return to extension
6. Try to perform task operation (add/complete task)

**Verification:**
- [ ] **VERIFY:** API request fails with 401 Unauthorized
- [ ] **VERIFY:** Extension handles auth error gracefully
- [ ] **VERIFY:** User prompted to sign in again
- [ ] **VERIFY:** Console shows AuthError logged

**Expected Result:** Extension detects revoked token and prompts re-authentication

## Success Criteria

All tests must pass:
- ✅ **Sign-In:** OAuth flow completes via chrome.identity
- ✅ **Tasks Load:** Tasks fetched from Google Tasks API
- ✅ **Add Task:** New task created successfully
- ✅ **Complete Task:** Task completion syncs to API
- ✅ **Uncomplete Task:** Task uncomplete syncs to API
- ✅ **Delete Task:** Task deletion syncs to API
- ✅ **Token Refresh:** Auto-refresh before expiry
- ✅ **Sign-Out:** Tokens revoked and cleared
- ✅ **Error Handling:** Graceful handling of offline/revoked token

## Verification Checklist

### Code Verification
Before running tests, verify implementation:
- [ ] `google-auth/oauth.ts` uses chrome.identity.getAuthToken()
- [ ] `google-auth/token.ts` handles token refresh via chrome.identity
- [ ] `google-tasks-provider.ts` uses chrome.storage.local for task data
- [ ] `manifest.json` includes oauth2 config with correct scopes
- [ ] No backend API dependencies (no /api/auth/google/* calls)

### Runtime Verification
During tests, monitor:
- [ ] No backend API calls in Network tab
- [ ] All OAuth via chrome.identity (check console logs)
- [ ] Tokens stored in chrome.storage.local (not localStorage)
- [ ] No console errors during normal operations
- [ ] API requests include proper Authorization headers

## Test Results Template

```
=== GOOGLE TASKS E2E TEST RESULTS ===
Date: 2026-01-11
Tester: [Name]
Browser: Chrome [Version]
Extension Version: 1.4.1

Scenario 1: Sign-In Flow .................. [ PASS / FAIL ]
  - OAuth popup ............................ [ PASS / FAIL ]
  - Token acquisition ...................... [ PASS / FAIL ]
  - Tasks load ............................. [ PASS / FAIL ]

Scenario 2: Task Operations
  - Add task ............................... [ PASS / FAIL ]
  - Complete task .......................... [ PASS / FAIL ]
  - Uncomplete task ........................ [ PASS / FAIL ]
  - Delete task ............................ [ PASS / FAIL ]

Scenario 3: Token Refresh .................. [ PASS / FAIL ]

Scenario 4: Sign-Out
  - Token revocation ....................... [ PASS / FAIL ]
  - Storage cleanup ........................ [ PASS / FAIL ]

Scenario 5: Error Handling
  - Offline handling ....................... [ PASS / FAIL ]
  - External revocation .................... [ PASS / FAIL ]

Overall Result: [ PASS / FAIL ]

Notes:
[Add observations]

Console Errors:
[Copy any errors]

Network Trace:
[Relevant API calls]
```

## Debugging Tips

### Common Issues

**Issue:** OAuth popup doesn't open
- **Check:** manifest.json has correct oauth2 client_id
- **Check:** chrome.identity permission in manifest
- **Fix:** Verify client_id matches Google Cloud Console

**Issue:** API returns 401 Unauthorized
- **Check:** Token expiry in chrome.storage.local
- **Check:** Scopes in manifest.json match API requirements
- **Fix:** Sign out and sign in again

**Issue:** Tasks don't load
- **Check:** Network tab for API errors
- **Check:** Console for JavaScript errors
- **Fix:** Check if Google Tasks API is enabled in Cloud Console

**Issue:** Token refresh fails
- **Check:** chrome.identity.getAuthToken() errors in console
- **Check:** Extension ID hasn't changed
- **Fix:** Clear all cached tokens and sign in again

### Useful Console Commands

```javascript
// Check current auth state
const tokens = await chrome.storage.local.get([
  'google_access_token',
  'google_token_expiry',
  'google_token_scopes',
  'google_user_email'
])
console.log(tokens)

// Check if token is expired
const expiry = tokens.google_token_expiry
const isExpired = expiry < Date.now()
console.log('Token expired:', isExpired)

// Manually trigger sign-out
// (Use the UI sign-out button instead to test properly)

// Check chrome.alarms
const alarms = await chrome.alarms.getAll()
console.log('Active alarms:', alarms)
```

## Next Steps After Test Completion

1. Document test results in test results template
2. File bugs for any failures
3. Update implementation_plan.json to mark subtask-6-3 as completed
4. Proceed to subtask-6-4: Cross-device settings sync testing
5. Proceed to subtask-6-5: Service worker background refresh testing

## References

- Chrome Identity API: https://developer.chrome.com/docs/extensions/reference/identity/
- Google Tasks API: https://developers.google.com/tasks
- Extension Manifest V3: https://developer.chrome.com/docs/extensions/mv3/intro/
