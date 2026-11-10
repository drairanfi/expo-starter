# Naming conventions

- Identifiers, comments, docs, commit messages: **English**. Translate domain vocabulary to a
  stable English term; the original language only appears in locale values.
- Files and folders: `kebab-case` (`login-screen.tsx`, `use-sign-in.ts`, `auth-store.ts`).
  Route files follow expo-router (`index.tsx`, `login.tsx`, `(group)/`, `[id].tsx`).
- Components and types: `PascalCase`. Functions, variables, hooks: `camelCase`; hooks start
  with `use`. Constants: `SCREAMING_SNAKE_CASE` for true constants, `PascalCase` for const
  objects used like enums (`StorageKeys`).
- `FooScreen` (route-level), `FooRepository` (interface), `MockFooRepository` / `RemoteFooRepository`
  (impl), `useFoo` (hook), `fooStore` + `useFooStore`, `fooSchema` (Zod value) with `Foo`
  (inferred type; entity schemas may be `FooSchema`, see `UserSchema`).
- Booleans read as questions: `isLoading`, `hasError`, `canSubmit`.
- i18n keys: nested `area.key` in `camelCase` (`login.title`, `errors.network`).
- Env vars: `EXPO_PUBLIC_*` for public values only; `APP_VARIANT` for the variant.
- Test files: `<subject>.test.ts(x)` under `tests/` mirroring `src/`.
