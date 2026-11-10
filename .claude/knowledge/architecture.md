# Architecture

Feature-first Clean architecture (Screaming): top-level folders name business capabilities.

```
src/
  app/                    expo-router routes (thin) + root layout (composition root)
  core/                   app-wide, feature-agnostic infrastructure
    config/  theme/  network/  error/  storage/  i18n/  utils/
  features/<name>/
    domain/               Zod schemas + inferred types, repository interfaces
    data/                 repository implementations, repository instance
    presentation/         screens/  components/  hooks/ (query hooks, Zustand stores)
    index.ts              public API
  shared/components/{atoms,molecules,organisms}
tests/                    mirrors src/ (plus tests/app, tests/setup.ts, tests/test-utils.tsx)
```

## Dependency direction

```
presentation -> domain <- data
      \            |         /
       +------> core <------+      shared/components -> core (never features)
```

## Runtime flow

1. `src/app/_layout.tsx` renders `AppProviders` (`src/core/config/app-providers.tsx`): i18n init,
   `QueryClientProvider`, `ThemeProvider`.
2. `RootNavigator` restores the session (`authStore.getState().restoreSession()`), registers
   `setUnauthorizedHandler`, hides the splash screen and wraps screens in `Stack.Protected`.
3. A route file re-exports a screen; the screen calls hooks; hooks call the repository
   interface (domain) whose implementation (data) uses `getHttpClient()` and `secureStorage`.
4. axios interceptors (`src/core/network/interceptors.ts`) add the bearer token and map every
   failure to `FailureError`; a 401 also invokes the unauthorized handler.
5. Config comes from `app.config.ts` into `extra`, validated by `getAppConfig()`
   (`src/core/config/app-config.ts`). Nothing else reads `expo-constants`.

## Swap points

- `src/features/auth/data/auth-repository-instance.ts` chooses the `AuthRepository`
  (`MockAuthRepository` today). Replace it there; nothing else changes.
- Route guard: `Stack.Protected` driven by `useAuthStore` status in `src/app/_layout.tsx`.

## Where things go

| Thing                                    | Location                    |
| ---------------------------------------- | --------------------------- |
| Config schema, `getAppConfig`, providers | `src/core/config`           |
| Tokens, `useTheme`, theme mode store     | `src/core/theme`            |
| axios client, interceptors, query client | `src/core/network`          |
| `Failure` union, `FailureError`          | `src/core/error`            |
| `SecureStorage`, `StorageKeys`           | `src/core/storage`          |
| i18n setup, locales, `useLocalizedError` | `src/core/i18n`             |
| logger, helpers                          | `src/core/utils`            |
| UI shared by 2+ features                 | `src/shared/components/...` |

`auth`, `home` and `settings` are the reference features (`auth` is the fullest).
