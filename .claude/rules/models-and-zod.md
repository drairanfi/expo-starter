# Models and Zod

- Entities and DTOs are Zod schemas in `domain/`; the type is `z.infer<typeof schema>`
  (`user.ts`, `credentials.ts`). Do not write a parallel interface.
- Domain files import only `zod` and other domain files.
- Every API payload goes through `parseResponse(schema, response.data)`
  (`src/core/network/parse-response.ts`); a mismatch becomes an `invalidResponse` failure.
  Never cast (`as User`) a response.
- Persisted data (secure storage, AsyncStorage) is parsed on read the same way.
- Form schemas use i18n **keys** as messages (`'validation.emailRequired'`), so validation stays
  pure and language-agnostic; the component translates them.
- Map wire format to domain shape in `data/` (e.g. snake_case to camelCase with `.transform`).
- Config is validated by `AppConfigSchema` (`src/core/config/schema.ts`). `app.config.ts` keeps its
  own copy because Node cannot import extensionless `.ts`; change both together.
- Keep schemas strict about required fields; use `.optional()` / `.nullable()` explicitly.
- Never edit generated types by hand (`expo-env.d.ts`, `.expo/types`).
