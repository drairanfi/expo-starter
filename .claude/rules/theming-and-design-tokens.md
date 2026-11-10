# Theming and design tokens

- Tokens are in `src/core/theme/tokens.ts`: semantic `colors` (light and dark), `spacing`
  (multiples of 4), `radius`, `typography` roles, `MIN_TOUCH_TARGET` (48).
- Read them with `const { colors, spacing, radius, typography } = useTheme();`. Never write hex
  values, raw numbers for spacing, or `fontSize` in features or shared components.
- Need a new color or role? Add it to `ColorTokens`, `lightColors` and `darkColors` together (a
  missing one fails typecheck), then use it by name.
- Use semantic names (`danger`, `textMuted`), not appearance names. Pair backgrounds with their
  `on*` color.
- Theme mode (`system|light|dark`) is a persisted Zustand store (`useThemeStore`); the provider
  resolves it. Components never read the device scheme directly.
- Static layout (flex, alignment) goes in `StyleSheet.create`; token-dependent values are inline
  style objects from `useTheme()`.
- Interactive elements are at least `MIN_TOUCH_TARGET` high. Check contrast in both modes.
- Navigator headers and content backgrounds use tokens too (see `(app)/_layout.tsx`).
