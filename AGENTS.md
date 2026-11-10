# AGENTS.md

Entry point for AI coding agents (Claude Code, OpenCode, others) and humans.
Expo template (SDK 58): expo-router, TanStack Query + Zustand, Zod, axios, react-hook-form,
i18next, Screaming + Clean feature-first architecture, variants `development` / `staging` /
`production` via `app.config.ts` + `eas.json`.
Human docs: `README.md`. Quick card: `RULES.md`.

## Read first

`.claude/knowledge/critical-constraints.md` (hard rules). Then `architecture.md`, `tech-stack.md`
(same folder) and only the `.claude/rules/*` files relevant to the task.

## Clarify before building

If the business domain or requirements are missing or ambiguous, STOP and ask (one question at a
time; use the `grill-me` skill). Do not invent entities, screens or API contracts.

## Commands

Node >= 22.13 (`.nvmrc`).

```sh
npm install
npm run typecheck
npm run lint                         # lint:fix to autofix
npm run format:check                 # format to write
npm test                             # test:coverage for coverage
npm run verify                       # typecheck + lint + format:check + test
npx expo-doctor
npm run start:dev                    # also start:staging / start:prod (dev client)
npm run config:dev                   # resolved public config (also config:staging / config:prod)
npm run prebuild:dev                 # generate ios/ android/ (git-ignored, never commit)
```

Variants: `APP_VARIANT=development|staging|production` picks the variant; the npm scripts and
`eas.json` profiles set it. Config details in `.claude/rules/variants-and-config.md`. Rename the
app only through the `BASE_*` constants in `app.config.ts`. `EXPO_PUBLIC_*` values are public.

## Harness map

| Kind      | Name                                                                                 | Purpose                                                                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent     | `feature-architect`                                                                  | Plans a feature, writes `.claude/plans/<feature>.md`                                                                                                                                                                 |
| Agent     | `rn-builder`                                                                         | Implements following the plan and rules                                                                                                                                                                              |
| Agent     | `code-reviewer`                                                                      | Read-only audit against the rules                                                                                                                                                                                    |
| Agent     | `doc-gardener`                                                                       | Syncs README / AGENTS.md / rules with the code                                                                                                                                                                       |
| Agent     | `ux-ui-designer`                                                                     | Platform conventions, tokens, accessibility guidance                                                                                                                                                                 |
| Command   | `/new-feature <name>`                                                                | Scaffold a full feature                                                                                                                                                                                              |
| Command   | `/figma-to-rn <url>`                                                                 | Figma MCP to tokens + existing components                                                                                                                                                                            |
| Command   | `/verify`                                                                            | Typecheck, lint, prettier, test, expo-doctor                                                                                                                                                                         |
| Skill     | `expo-router`, `react-query`, `zustand`, `zod-models`, `rn-components`, `rn-testing` | Task checklists                                                                                                                                                                                                      |
| Skill     | `commit-conventions`, `naming-language`, `grill-me`                                  | Process and language                                                                                                                                                                                                 |
| Rules     | `.claude/rules/*.md`                                                                 | folder-structure, naming-conventions, state-management, models-and-zod, routing, networking-and-errors, theming-and-design-tokens, i18n, forms, components-atomic-design, testing, variants-and-config, code-quality |
| Knowledge | `.claude/knowledge/*.md`                                                             | critical-constraints, architecture, tech-stack                                                                                                                                                                       |

## Workflow

1. Architect writes a plan to `.claude/plans/` (needs clear requirements).
2. Builder implements the plan, then runs the verify pipeline.
3. Reviewer audits the diff against the rules; fix blockers.
4. Never commit or push unless the user asks. Commits are Conventional Commits, no AI attribution.

## Pre-work checklist

- [ ] Requirements and business domain are clear
- [ ] Read critical constraints and the relevant rules
- [ ] Looked at the closest existing feature (`src/features/auth`) before writing new code

## Pre-finish checklist

- [ ] `npm run typecheck` clean; `npm run lint` clean
- [ ] `npm run format:check` clean
- [ ] `npm test` green; tests added for stores/hooks, schemas, guards, mappers, shared components
- [ ] i18n keys in en and es; no hard-coded strings or colors
- [ ] Feature `index.ts` exports updated; no deep cross-feature imports
- [ ] No generated, lock, `ios/`, `android/`, secret or unrelated files changed

## Tool notes

- `.claude/` is the single source of truth. Claude Code reads it directly; `CLAUDE.md` just imports
  this file. OpenCode reads `AGENTS.md`, `opencode.json` (instructions, MCP, permissions),
  `.claude/skills` natively, `.opencode/commands` (symlink to `.claude/commands`) and
  `.opencode/agents` (generated: `sh scripts/sync_opencode_agents.sh` after editing `.claude/agents`).
- MCP, declared in `.mcp.json` (Claude Code) and `opencode.json` (OpenCode): the remote Expo MCP
  server (`https://mcp.expo.dev/mcp`, OAuth with an Expo account; authenticate with `/mcp` in
  Claude Code or `opencode mcp auth expo`) and Figma Desktop (`http://127.0.0.1:3845/mcp`).
  Expo's local capabilities (simulator automation, local docs) additionally need the `expo-mcp`
  dev dependency and `EXPO_UNSTABLE_MCP_SERVER=1 npx expo start`; this repo does not install it.
- Claude Code formats ts/tsx/js/jsx/json/md after edits via `.claude/hooks/format-ts.sh` (local
  prettier); OpenCode uses its built-in `prettier` formatter.
