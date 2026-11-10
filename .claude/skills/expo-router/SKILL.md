---
name: expo-router
description: Use when adding or changing routes, layouts, navigation or the auth guard (expo-router, Stack.Protected) in this Expo repo.
---

Read `.claude/rules/routing.md`; code: `src/app/`.

1. Build the screen in its feature and export it from the feature `index.ts`.
2. Add the thin route file in `src/app/` (`export { XScreen as default } from '@/features/x';`).
3. Register `Stack.Screen` (title from `t()`, colors from `useTheme()`) in the right `_layout.tsx`.
4. Public vs protected: the guard is `Stack.Protected` in `src/app/_layout.tsx`; signed-in screens live in `(app)`.
5. Navigate with typed routes (`router.push('/settings')`, `<Link href>`); no auth redirects elsewhere.
6. Test with `renderRouter('./src/app')` (`tests/app/route-guard.test.tsx`).
