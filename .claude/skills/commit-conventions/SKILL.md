---
name: commit-conventions
description: Use when writing commit messages or preparing a commit/PR in this repo (Conventional Commits enforced by scripts/check_commit_msg.sh).
---

Format of the first line: `<type>(<scope>)?!?: <description>`

- Types: `feat fix docs style refactor perf test build ci chore revert`.
- Scope optional, regex `[a-z0-9._/-]+` (e.g. `auth`, `config`).
- Description required, imperative, English. `!` marks a breaking change.
- `Merge `, `Revert `, `fixup! `, `squash! ` first lines are allowed.
- Enforced by lefthook `commit-msg` -> `sh scripts/check_commit_msg.sh <file>`; pre-commit runs prettier check, `expo lint` and typecheck on staged files.
- Do not add AI/co-author attribution lines. Do not commit or push unless asked.

Example: `feat(auth): add remote auth repository`
