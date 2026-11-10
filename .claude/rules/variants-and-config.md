# Variants and config

- Variants: `development`, `staging`, `production`, selected by `APP_VARIANT`
  (default `development`; typos throw). Defined in `app.config.ts` (`VARIANTS`).
- One place to rename the app: `BASE_APP_ID`, `BASE_APP_NAME`, `BASE_SLUG`, `BASE_SCHEME` in
  `app.config.ts`. Bundle id / package = base id + variant suffix; never hand-edit native ids.
- Runtime config reaches the app as `extra`, validated at config time (copy of the schema in
  `app.config.ts`) and at startup (`src/core/config/schema.ts`, `getAppConfig()`). Keep both in
  sync; `tests/core/config/app-config-file.test.ts` guards parity. Add a setting in: `ExtraSchema`,
  `VARIANTS` defaults, `AppConfigSchema`, the `.env.*.example` files and the test.
- Env files: `.env.<variant>` is git-ignored and loaded by `app.config.ts`; only
  `.env.<variant>.example` is tracked. Existing process env wins (EAS / CI).
- `EXPO_PUBLIC_*` values are inlined into the bundle and public. Never put secrets, tokens or
  private keys there. Real secrets belong on a backend or in EAS secrets used at build time only.
- Read config only through `getAppConfig()`, never `process.env` or `expo-constants` in features.
- EAS: `eas.json` profiles `development` (dev client, internal), `staging` (internal, channel),
  `production` (channel, autoIncrement), each sets `APP_VARIANT`.
- Scripts: `npm run start:dev|staging|prod`, `ios:*`, `android:*`, `config:*`, `export:web:*`,
  `prebuild:*` (`--clean`).
- CNG: `ios/` and `android/` are generated and git-ignored. Native changes go through
  `app.config.ts` plugins, then `npm run prebuild:<variant>`. Never commit them.
- Verify config changes with `npm run config:dev` (and staging/prod).
