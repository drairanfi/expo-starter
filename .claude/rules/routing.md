# Routing (expo-router)

- Routes live in `src/app`. A route file is thin: re-export a feature screen
  (`export { LoginScreen as default } from '@/features/auth';`) or define a navigator layout.
- Import screens only through the feature's `index.ts`; add the export there first.
- Groups: `(app)` holds signed-in screens with its own `_layout.tsx`; `login.tsx` is public.
- Protected routes: `Stack.Protected guard={...}` in `src/app/_layout.tsx`, driven by
  `useAuthStore((s) => s.status)`. When the guard flips, expo-router redirects to the first allowed
  route. Do not add redirects or `router.replace` for auth elsewhere.
- Return `null` while `status === 'initializing'` (splash stays up), then hide the splash.
- Typed routes are on (`experiments.typedRoutes`): `router.push('/settings')`, `<Link href="/settings">`.
  Types are generated into `.expo/types`; do not hand-write route unions.
- Titles and header colors come from `t()` and `useTheme()` in layouts.
- Register a new screen: route file in `src/app`, `Stack.Screen` in the layout, i18n title key.
- Test navigation with `renderRouter('./src/app')` (`tests/app/route-guard.test.tsx`).
