---
name: zustand
description: Use when adding or changing client state with Zustand in this repo (session, preferences, cross-screen UI state).
---

Read `.claude/rules/state-management.md`; examples: `src/features/auth/presentation/hooks/auth-store.ts`, `src/core/theme/theme-store.ts`.

1. Only client state belongs here; server data goes to TanStack Query.
2. Export `createXStore(deps)` (testable), the app instance, and `useXStore(selector)`.
3. Actions hold the logic and call repository interfaces; failures are thrown as `FailureError` or stored as a `Failure`.
4. Subscribe with selectors only. Outside React use `store.getState()`.
5. Persist non-sensitive data with `persist` + `createJSONStorage(() => AsyncStorage)` + `partialize`. Tokens use `secureStorage`.
6. Test the factory with a fake repository; reset shared stores in `beforeEach`.
