---
name: zod-models
description: Use when defining entities, DTOs, form schemas or parsing API/persisted data with Zod in this repo.
---

Read `.claude/rules/models-and-zod.md`; examples: `src/features/auth/domain/user.ts`, `credentials.ts`.

1. Define the schema in the feature's `domain/`; export the type with `z.infer`. Domain imports only `zod`.
2. Parse every API or storage payload with `parseResponse(schema, data)` (`@/core/network`); never cast.
3. Form schemas use i18n keys as messages (`'validation.emailRequired'`).
4. Transform wire shapes to domain shapes in `data/`, not in components.
5. Config schemas: `src/core/config/schema.ts` and the copy in `app.config.ts` change together.
6. Add schema tests (valid, invalid, edge cases) under `tests/features/<name>/`.
