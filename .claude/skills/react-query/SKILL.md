---
name: react-query
description: Use when fetching or mutating server data with TanStack Query in this repo (query hooks, keys, invalidation, error handling).
---

Read `.claude/rules/state-management.md` and `networking-and-errors.md`.

1. Hook in `presentation/hooks/use-<thing>.ts` calling the repository interface, never axios directly.
2. Reads: `useQuery({ queryKey: ['<feature>', ...params], queryFn })`. Writes: `useMutation` and invalidate the affected keys on success.
3. The repository validates payloads with `parseResponse(schema, data)`; failures arrive as `FailureError`.
4. Render `isPending`, `error` (via `useLocalizedError()`), empty and data states.
5. Do not copy results into Zustand or `useState`. Do not override the retry policy unless justified (`shouldRetry`).
6. Test with `renderWithProviders` (fresh `QueryClient` per render) and a fake repository or `mockAdapter`.
