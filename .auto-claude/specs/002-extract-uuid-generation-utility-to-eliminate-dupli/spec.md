# Extract UUID generation utility to eliminate duplication

## Overview

UUID generation logic is duplicated in two places: `google-auth.ts` has a `generateUUID()` function (lines 109-114), and `google-calendar-backend.ts` has inline UUID generation with a fallback pattern (lines 288-293). The calendar backend even implements a fallback for `crypto.randomUUID` that the auth module's version doesn't have.

## Rationale

Duplicated utility code should be centralized. The fallback pattern in calendar backend is more robust and should be the canonical implementation. Having one tested utility prevents subtle bugs from divergent implementations.

---
*This spec was created from ideation and is pending detailed specification.*
