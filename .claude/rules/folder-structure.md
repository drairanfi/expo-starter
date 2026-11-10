# Folder structure

```
src/app/                    routes only (thin)
src/core/<concern>/         config theme network error storage i18n utils, each with index.ts
src/features/<name>/        data/ domain/ presentation/{screens,components,hooks}/ index.ts
src/shared/components/      atoms/ molecules/ organisms/
tests/                      mirrors src/
```

- Allowed imports: `presentation -> domain`, `data -> domain`, both -> `@/core`.
  `domain` imports nothing from `data`, `presentation`, `@/shared` or infrastructure.
- `@/core/<concern>` is imported through its `index.ts` barrel.
- `@/shared/components/<level>/<file>` is imported by file (no barrels there).
- Inside a feature use relative imports; across features only `@/features/<name>`.
- Feature `index.ts` exports only what other code needs (screens, hooks, stores, types). Keep
  `data/` private.
- A code unit used by 2+ features moves to `core/` (infrastructure) or `shared/components/` (UI).
- New feature: use `/new-feature <name>`. Reference: `src/features/auth`.
