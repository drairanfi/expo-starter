---
description: Scaffold a full feature (data, domain, presentation, route, i18n, tests). Usage - /new-feature <feature-name>
argument-hint: <feature-name>
---

Create the feature `$ARGUMENTS` (kebab-case, English).

1. Read `.claude/knowledge/critical-constraints.md`. If the business domain or requirements for `$ARGUMENTS` are not known, ask for them (one question at a time) before writing code. Check `.claude/plans/` for an existing plan.
2. Reference: `src/features/auth`.
3. Create under `src/features/$ARGUMENTS/`:
   - `domain/`: Zod schema(s) with inferred types, `<name>-repository.ts` interface
   - `data/`: implementation (mock or `getHttpClient()`-based, validated with `parseResponse`, throwing `FailureError`) and `<name>-repository-instance.ts` exporting the instance typed as the interface
   - `presentation/hooks/`: TanStack Query hooks for server data (`useQuery` / `useMutation`) and a Zustand store only for client state (factory + `useXStore(selector)`)
   - `presentation/screens/<name>-screen.tsx` and `presentation/components/` as needed (`AppScreen`, `useTheme()`, `t()`)
   - `index.ts` exporting only the public API (screen, hooks, types)
4. Add the thin route file in `src/app/` (`export { XScreen as default } from '@/features/$ARGUMENTS';`) and its `Stack.Screen` in the right layout; a public route belongs outside the protected group and needs the guard in `src/app/_layout.tsx` reviewed.
5. Add i18n keys (screen title, copy, errors) to both `src/core/i18n/locales/en.ts` and `es.ts`.
6. Tests in `tests/features/$ARGUMENTS/` (schemas, hooks/store with a fake repository, screen with `renderWithProviders`; a route test if the guard changes).
7. Run `npm run typecheck`, `npm run lint`, `npm run format:check` (fix with `npm run format`), `npm test`; fix until green.
8. Summarise files created and any follow-ups. Do not commit.

Follow `.claude/rules/*`; no new dependencies, no deep cross-feature imports.
