---
name: naming-language
description: Use when naming files, components, hooks, stores, i18n keys or routes, and when the business domain is described in another language (identifiers stay English).
---

Read `.claude/rules/naming-conventions.md`.

1. Everything in code is English: identifiers, comments, docs, commit messages. If the domain vocabulary is Spanish (or other), translate to a stable English term and note it in the plan; keep the original only in locale values.
2. Files `kebab-case.ts(x)`; components and types `PascalCase`; functions, variables, hooks `camelCase`.
3. `FooScreen`, `FooRepository` (interface), `MockFooRepository` (impl), `useFoo`, `useFooStore`, `fooSchema`.
4. i18n keys: nested `camelCase` (`login.title`, `errors.network`).
5. Booleans read as questions (`isLoading`).
