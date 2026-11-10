---
description: Implement a Figma design in React Native using the Figma MCP, mapped to existing tokens and components. Usage - /figma-to-rn <figma_url>
argument-hint: <figma_url>
---

Implement the Figma node `$ARGUMENTS` in React Native.

1. The Figma MCP server (`figma` in `.mcp.json`, Figma Desktop at `http://127.0.0.1:3845/mcp`) must be running. Fetch the design context, a screenshot and variables for the node. If it is unreachable, say so and stop.
2. Inventory what exists: `src/shared/components/{atoms,molecules,organisms}` and `src/core/theme/tokens.ts`. Reuse before creating.
3. Map the design, do not paste generated web/React output (no `div`, CSS or Tailwind):
   - Colors -> `useTheme().colors` roles; text -> `typography` roles; spacing -> `spacing`; radii -> `radius`. No hex values, no raw font sizes. If a token is missing, add it to `ColorTokens`, `lightColors` and `darkColors` (or the scale) and say so.
   - Components -> existing atoms/molecules/organisms; reusable new pieces go to `src/shared/components` at the right level, feature-only pieces to the feature's `presentation/components`.
   - Every string -> i18n key in both `en.ts` and `es.ts`.
   - Layout with `View`, `Text`, `Pressable`, flexbox; touch targets >= `MIN_TOUCH_TARGET`; `accessibilityRole` / `accessibilityLabel` on interactive and icon-only elements.
   - Images/icons: bundle assets under `assets/`, sized explicitly.
4. Cover loading/empty/error states, light/dark, small and large screens.
5. No business logic in components; wire to hooks.
6. Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`. Add tests for new shared components.
7. Report: tokens mapped, tokens added, components reused/created, deviations from the design.
