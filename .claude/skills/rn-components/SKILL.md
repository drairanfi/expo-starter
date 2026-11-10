---
name: rn-components
description: Use when creating or changing React Native components, screens or shared UI (atomic design, tokens, accessibility, list performance) in this repo.
---

Read `.claude/rules/components-atomic-design.md`, `theming-and-design-tokens.md`, `code-quality.md`.

1. Place it: `src/shared/components/{atoms,molecules,organisms}` if reusable and feature-free; otherwise the feature's `presentation/components` or `screens`.
2. Style from `useTheme()` tokens; static layout in `StyleSheet.create`. No hex, raw spacing or font sizes.
3. Accessibility: role, localised label, state, touch target >= `MIN_TOUCH_TARGET`.
4. Strings via `t()`; keys in en and es.
5. Logic lives in hooks; the component renders and forwards events.
6. Performance: React Compiler is on, so skip default memoization. Lists use `FlatList` with `keyExtractor` and light items; size images explicitly; select minimal store slices.
7. Cover loading, empty, error, data; light and dark. Add a test.
