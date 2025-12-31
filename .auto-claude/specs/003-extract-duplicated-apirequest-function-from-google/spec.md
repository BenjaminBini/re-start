# Extract duplicated apiRequest function from Google backends

## Overview

The `apiRequest` function is duplicated nearly identically in `google-tasks-backend.ts` (lines 105-128) and `google-calendar-backend.ts` (lines 92-115). Both functions perform the same pattern: get access token via ensureValidToken(), make an authenticated fetch request with Bearer token, and handle 401 errors identically.

## Rationale

Code duplication leads to maintenance burden where fixes must be applied in multiple places. If authentication error handling needs to change, it must be updated in both files. Extracting to a shared utility in google-auth.ts would centralize this logic.

---
*This spec was created from ideation and is pending detailed specification.*
