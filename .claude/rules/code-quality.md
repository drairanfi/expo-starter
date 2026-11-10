# Code quality

- TypeScript `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`. No `any`; use `unknown` and
  narrow (Zod). No `@ts-ignore`. Prefer discriminated unions with exhaustive `never` checks.
- ESLint (`eslint-config-expo` + prettier) must be clean. Layering is enforced by
  `no-restricted-imports` (core, shared, domain, deep feature imports). `no-console` is an error;
  use `logger` from `@/core/utils`. Use `import type` for type-only imports.
- Prettier: single quotes, trailing commas, width 100, semicolons. Do not fight it.
- Never disable a lint rule to pass; fix the cause. A narrow `eslint-disable` needs a reason.
- Performance: React Compiler is on, so do not sprinkle `useMemo` / `useCallback` /
  `React.memo` by default; add them only for a measured problem or to stabilize a non-React
  boundary. Long lists use `FlatList` virtualization with `keyExtractor` and
  stable item components, never `ScrollView` + `map`. Avoid inline object/array creation in
  hot list items. Size images explicitly (`expo-image` if added, else `Image` with dimensions) and
  use correctly scaled assets. Select the minimum from stores.
- Keep components small and files focused; extract hooks for logic.
- Handle loading, empty, error and data states on every screen.
- Comments explain why, not what; doc comments on exported APIs as the existing code does.
- Dependencies: no additions without asking; use `npx expo install` for native-compatible versions.
