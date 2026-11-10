# Expo Template

Production-grade React Native + Expo starter: Screaming + Clean architecture,
feature-first, expo-router with an auth guard, TanStack Query + Zustand, Zod,
axios with an interceptor layer, light/dark theming, i18next (en/es), three
build variants and a strict quality toolchain.

It is the React Native twin of the Flutter template (same scope, same
conventions). A mock auth repository ships out of the box so the app runs with
no backend: sign in with any valid email and the password `password123`.

Platforms: iOS, Android, Web (web is best effort, see "Known gaps").

## Quickstart

Requires Node >= 22.13 (see `.nvmrc`; RN 0.88 / Expo SDK 58) and npm.

```sh
nvm use                      # Node 24
npm install
npm run start:dev            # Metro for the development variant
```

`start:*` uses a development client. For the very first run build one with
`npm run ios:dev` or `npm run android:dev` (runs `expo prebuild` into a git-ignored
`ios/` / `android/` and installs the app on a simulator/emulator). Expo Go is
not supported: the template uses `expo-dev-client` and per-variant app ids.

Optional: enable the git hooks with `npx lefthook install`.

Rename the app after cloning: edit the constants at the top of
`app.config.ts` (`BASE_APP_ID`, `BASE_APP_NAME`, `BASE_SLUG`, `BASE_SCHEME`) and
`name` in `package.json`.

## Variants ("flavors")

`app.config.ts` is driven by `APP_VARIANT` = `development | staging | production`.
Everything per variant derives from one base id constant:

| Variant       | App name         | iOS bundle id / Android package    | Scheme                 | EAS profile   |
| ------------- | ---------------- | ---------------------------------- | ---------------------- | ------------- |
| `development` | Template Dev     | `com.example.expotemplate.dev`     | `expotemplate-dev`     | `development` |
| `staging`     | Template Staging | `com.example.expotemplate.staging` | `expotemplate-staging` | `staging`     |
| `production`  | Template         | `com.example.expotemplate`         | `expotemplate`         | `production`  |

The three can be installed side by side. An unknown `APP_VARIANT` fails the
config with a clear error (it never silently falls back to production).

```sh
npm run start:dev | start:staging | start:prod
npm run ios:dev   | ios:staging   | ios:prod
npm run android:dev | android:staging | android:prod
npm run config:dev | config:staging | config:prod   # print the resolved config
```

### Runtime config

`app.config.ts` bakes a typed `extra` block (`variant`, `envName`, `apiBaseUrl`,
`enableLogging`) into the app. It is validated with Zod twice: at config time
(a bad value fails the build) and at app start (`src/core/config`). Read it
only through `getAppConfig()`.

Values come from, in priority order: process env (EAS / CI) > `.env.<variant>` >
variant defaults in `app.config.ts`. Copy `.env.<variant>.example` to
`.env.<variant>` for local overrides (`EXPO_PUBLIC_API_BASE_URL`,
`EXPO_PUBLIC_ENABLE_LOGGING`). Real env files are git-ignored; only `*.example`
is tracked. **No secrets**: everything bundled in a mobile app is extractable.

### EAS builds

`eas.json` has `development` (dev client, internal), `staging` (internal) and
`production` profiles; each sets `APP_VARIANT`.

```sh
npx eas build --profile development --platform ios
npx eas build --profile staging --platform android
npx eas build --profile production --platform all
```

Run `npx eas init` once to link your Expo project (adds `extra.eas.projectId`),
and configure credentials per bundle id.

### Native folders (Continuous Native Generation)

`ios/` and `android/` are generated and git-ignored. Regenerate them for a
variant with:

```sh
npm run prebuild:dev      # or prebuild:staging / prebuild:prod (uses --clean)
```

Never edit generated native files by hand; change `app.config.ts` or add a
config plugin instead. Switching variant means re-running prebuild (`--clean`).

## Structure

```
src/
├── app/                           # expo-router routes: THIN, only render a feature screen
│   ├── _layout.tsx                # providers + session restore + Stack.Protected guard
│   ├── login.tsx
│   └── (app)/{_layout,index,settings}.tsx
├── core/                          # app-wide, feature-agnostic infrastructure
│   ├── config/                    # Zod schema, getAppConfig(), AppProviders
│   ├── theme/                     # tokens, ThemeProvider/useTheme, persisted theme store
│   ├── network/                   # axios client, interceptors, error mapping, query client
│   ├── error/                     # Failure discriminated union + FailureError
│   ├── storage/                   # SecureStorage interface (+ Expo / web / in-memory)
│   ├── i18n/                      # i18next setup, typed en/es resources
│   └── utils/                     # logger, sleep
├── features/                      # one folder per business capability
│   ├── auth/ {data, domain, presentation/{screens,components,hooks}, index.ts}
│   ├── home/
│   └── settings/
└── shared/components/             # atomic design, feature-agnostic UI
    ├── atoms/                     # AppButton
    ├── molecules/                 # LabeledTextField
    └── organisms/                 # AppScreen
tests/                             # mirrors src/ (plus tests/app for route guard tests)
```

Dependency direction (inner layers never import outer ones), enforced by ESLint
(`no-restricted-imports`):

```
presentation -> domain <- data
      \            |         /
       +------> core <------+      shared/components -> core (never features)
```

- `core/` never imports `features/` or `shared/`.
- `domain/` is pure TypeScript: no React, axios, expo-* or storage.
- Features talk to each other (and `src/app` talks to features) only through a
  feature's public API, its `index.ts`. Deep imports such as
  `@/features/auth/data/...` are lint errors.
- Absolute imports use `@/` -> `src/` (tsconfig `paths`; Metro and Jest resolve it).

## Commands

| Task               | Command                           |
| ------------------ | --------------------------------- |
| Install deps       | `npm install`                     |
| Typecheck          | `npm run typecheck`               |
| Lint / autofix     | `npm run lint` / `lint:fix`       |
| Format / check     | `npm run format` / `format:check` |
| Test               | `npm test`                        |
| Test with coverage | `npm run test:coverage`           |
| Everything at once | `npm run verify`                  |
| Dependency health  | `npx expo-doctor`                 |
| Web bundle smoke   | `npm run export:web:dev`          |

## Add a feature

Example: `profile`.

1. Create `src/features/profile/{data,domain,presentation/{screens,components,hooks}}`
   and an `index.ts` exposing only what other code needs.
2. **Domain**: Zod schemas + inferred types for entities, and a repository
   interface. No framework imports.
3. **Data**: implement the repository with `getHttpClient()`; validate payloads
   with `parseResponse(schema, response.data)`. Failures arrive as
   `FailureError` (see Conventions).
4. **Presentation**: hooks wrapping TanStack Query (`useQuery` for reads,
   `useMutation` for writes), screens and components that only call hooks.
   Use `useTheme()` tokens; never raw colours.
5. Add strings to **both** `core/i18n/locales/en.ts` and `es.ts` (the compiler
   and the parity test enforce it).
6. Add the route file in `src/app/` (a one-line re-export of the screen) and
   register it in the right layout. Typed routes (`experiments.typedRoutes`)
   type `router.push('/profile')`.
7. Add tests under `tests/features/profile/`.

### Swapping the mock auth backend

Implement `AuthRepository` (e.g. `RemoteAuthRepository` using `getHttpClient()`,
persisting the token under `StorageKeys.accessToken`) and export it as
`authRepository` in `src/features/auth/data/auth-repository-instance.ts`. The
HTTP client already sends the stored token as a bearer header and ends the
session on a 401. Nothing else changes.

## Conventions

- Conventional Commits (`feat(auth): ...`), enforced by lefthook through
  `scripts/check_commit_msg.sh` (POSIX shell, no Node needed).
- Strict TypeScript (`strict`, `noUncheckedIndexedAccess`). ESLint
  (`eslint-config-expo`) + Prettier; `npm run verify` must be green.
- Errors: repositories throw `FailureError`; the UI localises it with
  `useLocalizedError()` (never show `Failure.message`). Add a new `Failure`
  kind and the exhaustive `failureMessageKey` switch forces you to map it.
- Server state lives in TanStack Query, client state (session, theme mode) in
  Zustand. Do not copy query data into stores.
- No hard-coded user-facing strings; use `t('...')` (keys are type-checked).
- Route files stay thin; the guard lives in `src/app/_layout.tsx` using
  `Stack.Protected`, driven by the auth store.
- Tests mirror `src/`. Prefer real route files (`renderRouter('./src/app')`) for
  navigation behaviour and a mocked axios adapter for network behaviour.
- Secure storage: `expo-secure-store` behind the `SecureStorage` interface;
  theme mode in AsyncStorage (not sensitive).

## CI

`.github/workflows/ci.yml`: install, typecheck, lint, format check, tests with
coverage and `expo-doctor`; then, per variant (matrix), `expo config` and
bundling smoke tests (`expo export` for web, iOS and Android).

## AI harness

The repo ships configuration for AI coding agents. It works with both Claude Code and
OpenCode, with `.claude/` as the single source of truth.

| Path                          | Purpose                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `AGENTS.md`                   | Entry point for agents (`CLAUDE.md` imports it)                                          |
| `RULES.md`                    | One-page rules card                                                                      |
| `.claude/knowledge/`          | Critical constraints, architecture, tech stack                                           |
| `.claude/rules/`              | Short rules per topic (state, routing, Zod, i18n, tests, variants, ...)                  |
| `.claude/agents/`             | `feature-architect`, `rn-builder`, `code-reviewer`, `doc-gardener`, `ux-ui-designer`     |
| `.claude/commands/`           | `/new-feature <name>`, `/figma-to-rn <url>`, `/verify`                                   |
| `.claude/skills/`             | Task checklists (`expo-router`, `react-query`, `zustand`, `zod-models`, `grill-me`, ...) |
| `.claude/plans/`              | Feature plans written by the architect (git-ignored, only `.gitkeep` is tracked)         |
| `.claude/settings.json`       | Claude Code permissions (secrets denied) and the prettier-on-edit hook                   |
| `.mcp.json` / `opencode.json` | Expo MCP and Figma Desktop MCP; OpenCode also holds permissions                          |
| `.opencode/`                  | OpenCode view: `commands` is a symlink; `agents` is generated                            |

Typical flow: describe the feature, `feature-architect` writes a plan, `rn-builder`
implements it, `code-reviewer` audits, `/verify` runs the full pipeline. Use
`/new-feature profile` to scaffold a feature directly.

After editing `.claude/agents/*`, run `sh scripts/sync_opencode_agents.sh` to refresh
`.opencode/agents/` (the formats differ, so those files cannot be symlinks).

Caveats:

- Expo MCP is the remote server (`https://mcp.expo.dev/mcp`): authenticate once with an Expo
  account (`/mcp` in Claude Code, `opencode mcp auth expo`). Its local capabilities also need the
  `expo-mcp` dev dependency and `EXPO_UNSTABLE_MCP_SERVER=1 npx expo start`; they are not
  installed here.
- Figma commands need Figma Desktop running with its MCP server enabled.
- Claude Code formats edited files with the local prettier via a hook; OpenCode uses its
  built-in `prettier` formatter (enable it with a `formatter` entry in `opencode.json` if your
  version has built-ins off).
- `.env.<variant>`, keystores, `google-services.json`, plists and similar are denied to both tools.
  The tracked `.env.*.example` files stay readable.

## Known gaps

- Per-variant launcher icons: all variants share `assets/images/icon.png`.
  Drop `assets/images/icon.<variant>.png` and `app.config.ts` picks it up
  (adaptive Android icons are still shared).
- No per-variant `google-services.json` / `GoogleService-Info.plist`, signing,
  deep link hosts or push setup; add them per project (config plugins).
- Web: `expo-secure-store` has no web backend, so web falls back to unencrypted
  `localStorage` (development only). Use cookie sessions for a real web target.
- Default Expo splash/icon artwork; replace before shipping.
- No crash reporting or analytics wiring; add them next to `AppProviders`.
- Language follows the device; there is no in-app language picker yet.
- Mock auth only: there is no refresh-token flow (add it in the 401 path of
  `core/network/interceptors.ts` when your backend needs it).
- Development tooling targets Node >= 22.13 (React Native 0.88 requirement).
