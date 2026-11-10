# State management

| State                                                          | Tool                                       |
| -------------------------------------------------------------- | ------------------------------------------ |
| Data from the API (lists, detail, mutations)                   | TanStack Query (`useQuery`, `useMutation`) |
| Session, theme mode, UI preferences, cross-screen client state | Zustand                                    |
| One screen's ephemeral UI (open/closed, input draft)           | `useState`                                 |
| Form values and validation                                     | react-hook-form                            |

- **Never put server data in Zustand** and never copy query results into a store or `useState`.
- Query hooks live in `presentation/hooks/` and call the repository interface. Query keys are
  arrays starting with the feature name (`['profile', id]`). Mutations invalidate affected keys.
- Defaults live in `createQueryClient()` (`staleTime` 30s, `retry` via `shouldRetry`, mutations
  never retry). Do not retry non-retryable failures.
- Stores: build with a factory (`createAuthStore(repository)`) plus an app instance and a
  `useXStore(selector)` hook (see `auth-store.ts`), so tests can build isolated stores.
- Always subscribe with a selector (`useAuthStore((s) => s.status)`); never read the whole
  store in a component.
- Store actions hold the logic and throw `FailureError`; components do not call repositories.
- Persist only non-sensitive state, with `persist` + `partialize` (see `theme-store.ts`).
  Tokens go through `secureStorage`, not Zustand persist.
- Outside React use `store.getState()`; inside components use the hook.
- On sign-out the root layout clears the query cache; keep user-scoped data in Query so that works.
