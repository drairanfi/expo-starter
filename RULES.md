# RULES.md - quick reference

Works for Claude Code and OpenCode. Full text: `.claude/knowledge/critical-constraints.md` and `.claude/rules/*`.

| Topic      | Rule                                                                                      | Details                        |
| ---------- | ----------------------------------------------------------------------------------------- | ------------------------------ |
| Layers     | `presentation -> domain <- data`, all use `core/`; `core` never imports features          | `folder-structure.md`          |
| Features   | Cross-feature and `src/app` imports only via `@/features/<name>` (`index.ts`)             | `folder-structure.md`          |
| Routes     | `src/app` files are thin re-exports; guard is `Stack.Protected` in the root layout        | `routing.md`                   |
| Logic      | None in components; hooks and stores call repositories                                    | `state-management.md`          |
| State      | Server data in TanStack Query, client state in Zustand with selectors                     | `state-management.md`          |
| Models     | Zod schemas, `z.infer` types, `parseResponse` on every payload                            | `models-and-zod.md`            |
| Errors     | Repos throw `FailureError`; UI uses `useLocalizedError`; 401 via `setUnauthorizedHandler` | `networking-and-errors.md`     |
| Theme      | `useTheme()` tokens; no raw colors/sizes                                                  | `theming-and-design-tokens.md` |
| Strings    | `t('area.key')`, keys in en + es                                                          | `i18n.md`                      |
| Forms      | react-hook-form + `zodResolver`, i18n-key messages, `AppButton loading`                   | `forms.md`                     |
| Components | atoms -> molecules -> organisms in `shared/components`, accessible                        | `components-atomic-design.md`  |
| Tests      | `tests/` mirrors `src/`, RTL v14 async API, `mockAdapter`, `renderRouter`                 | `testing.md`                   |
| Variants   | `APP_VARIANT`, `app.config.ts`, `.env.<variant>`, `EXPO_PUBLIC_*` is public               | `variants-and-config.md`       |
| Native     | Never commit `ios/` / `android/` (prebuild generates them)                                | `variants-and-config.md`       |
| Quality    | Strict TS, no `any`, no `console.*`, ESLint clean                                         | `code-quality.md`              |
| Naming     | English identifiers, `kebab-case` files                                                   | `naming-conventions.md`        |
| Secrets    | Never read/edit `.env.<variant>`, keystores, `google-services.json`, plists, `.pem`       | critical constraints           |
| Git        | Conventional Commits, no AI attribution, commit only when asked                           | `commit-conventions` skill     |

Done = `npm run verify` (typecheck, lint, format:check, test) or `/verify`.
