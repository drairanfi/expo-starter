# Tech stack

Source of truth: `package.json`. Do not add dependencies without asking.

| Concern             | Choice                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Runtime             | Expo SDK 58, React Native 0.88, React 19, Node >= 22.13 (`.nvmrc`)                                   |
| Routing             | `expo-router` (file-based, typed routes, `Stack.Protected` guard)                                    |
| Server state        | `@tanstack/react-query` 5                                                                            |
| Client state        | `zustand` 5 (`persist` + AsyncStorage for theme mode)                                                |
| Validation / models | `zod` 4                                                                                              |
| HTTP                | `axios` with interceptors (auth, logging, error mapping)                                             |
| Forms               | `react-hook-form` + `@hookform/resolvers` (Zod)                                                      |
| Storage             | `expo-secure-store` behind `SecureStorage` (web: unencrypted `localStorage`), AsyncStorage for prefs |
| i18n                | `i18next` + `react-i18next` + `expo-localization`, typed `en` / `es` resources                       |
| Theming             | token objects in `src/core/theme/tokens.ts`, `useTheme()`                                            |
| Compiler            | React Compiler enabled (`experiments.reactCompiler` in `app.config.ts`)                              |
| Lint / format       | ESLint 9 (`eslint-config-expo`, flat config) + Prettier (`.prettierrc.json`)                         |
| Types               | TypeScript 6, `strict` + `noUncheckedIndexedAccess`                                                  |
| Tests               | `jest` + `jest-expo` + `@testing-library/react-native` 14                                            |
| Git hooks           | `lefthook` (prettier, lint, typecheck, `scripts/check_commit_msg.sh`)                                |
| Builds              | EAS (`eas.json` profiles `development`, `staging`, `production`)                                     |
| CI                  | `.github/workflows/ci.yml` (verify job + per-variant config/bundle smoke tests)                      |

Platforms: iOS, Android, Web (best effort).

## Commands

```sh
npm install
npm run typecheck
npm run lint            # lint:fix to autofix
npm run format:check    # format to write
npm test                # test:coverage for coverage
npm run verify          # all four above
npx expo-doctor
npm run start:dev       # or start:staging / start:prod (dev client)
npm run config:dev      # resolved public config for a variant
```
