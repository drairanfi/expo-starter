# Components (atomic design)

- `src/shared/components/atoms` (`AppButton`), `molecules` (`LabeledTextField`),
  `organisms` (`AppScreen`). Feature-specific UI goes in `features/<n>/presentation/components`.
- Shared components are feature-agnostic: no `@/features` import, no business logic, no data
  fetching. They take already-localised strings as props.
- Build from tokens (`useTheme()`); export a typed `Props` object; accept `testID` and `style`.
- Accessibility is part of the component: `accessibilityRole`, `accessibilityLabel`,
  `accessibilityState` (disabled, busy), touch target >= `MIN_TOUCH_TARGET`.
- Atoms compose into molecules, molecules into organisms; never the reverse.
- Promote a feature component to `shared` only when a second feature needs it.
- Named exports; one component per file; file name matches the component in kebab-case.
- New shared component: add a test under `tests/` mirroring its path.
