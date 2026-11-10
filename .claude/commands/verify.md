---
description: Run the full definition-of-done pipeline (typecheck, lint, prettier, tests, expo-doctor) and summarise.
---

Run in order, stopping to report on the first failure (expo-doctor excepted):

1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check` (if it fails, run `npm run format` and note which files changed)
4. `npm test`
5. `npx expo-doctor` (needs network; if it cannot reach the Expo API, report it as skipped, not failed)

Then summarise in a short table: step, status, key numbers (errors, warnings, tests passed/failed). For failures, give the file, the cause and the proposed fix. Do not edit code unless asked; formatting is the only exception.
