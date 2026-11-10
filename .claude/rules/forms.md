# Forms

- react-hook-form with `zodResolver(schema)` from `@hookform/resolvers/zod`; the schema lives in
  `domain/` (`credentialsSchema`) and its messages are i18n keys.
- Pattern (see `login-screen.tsx`): `useForm<Credentials>({ resolver, defaultValues })`,
  `Controller` per field rendering `LabeledTextField`, `handleSubmit(values => mutation.mutate(values))`.
- Always set `defaultValues`. Translate `fieldState.error?.message` at render.
- Submit button: `AppButton` with `loading={mutation.isPending}`; no double submits.
- Server errors: show `useLocalizedError()(mutation.error)` in a `Text` with
  `accessibilityRole="alert"`.
- Keyboard: correct `keyboardType`, `autoComplete`, `textContentType`, `autoCapitalize`,
  `returnKeyType`; `onSubmitEditing` submits the last field. Wrap screens in `AppScreen`
  (keyboard avoiding, `keyboardShouldPersistTaps="handled"`).
- Give inputs `testID` for tests; labels double as `accessibilityLabel`.
- No validation logic inline in components; extend the schema.
