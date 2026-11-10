---
name: grill-me
description: Use before planning a feature when requirements are vague. Interviews the user one question at a time until the domain, scope and acceptance criteria are clear.
---

1. Look at the repo first (`.claude/knowledge/architecture.md`, existing features) so you never ask what the code already answers.
2. Ask exactly ONE question, with your recommended answer, then stop and wait.
3. Cover, in this order: business goal and users; entities and their rules; screens and states (loading, empty, error); data source (mock, existing API, new endpoint); auth/permissions; copy and languages (en, es); edge cases; out of scope; how success is verified.
4. After each answer, restate it briefly and ask the next most important question. Skip topics already answered.
5. When there are no open questions, summarise the agreed requirements in <= 15 lines and hand over to `feature-architect` (plan in `.claude/plans/`). Do not write code.
