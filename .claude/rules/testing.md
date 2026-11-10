# Testing

- Stack: `jest` + `jest-expo`, `@testing-library/react-native` 14, run with `npm test`. Only
  `tests/**/*.test.{ts,tsx}` run (`jest.config.js`). `@/` maps to `src/`.
- Layout: `tests/` mirrors `src/` (`tests/core/...`, `tests/features/<name>/...`,
  `tests/app/` for route/guard tests). Helpers: `tests/setup.ts` (global mocks for
  expo-constants, secure-store, splash, localization, AsyncStorage), `tests/test-utils.tsx`
  (`renderWithProviders`), `tests/core/network/mock-adapter.ts`.
- RTL v14 is async: `await render(...)`, `await fireEvent.press(...)`, `await screen.findBy*`.
  Prefer `getByRole` / `getByText`; use `testID` for inputs and buttons as the existing tests do.
- Navigation and guards: `renderRouter('./src/app', { initialUrl })` from
  `expo-router/testing-library`.
- Network: `createHttpClient({ adapter: mockAdapter(...) })`; never hit the network.
- Timers: `jest.useFakeTimers()` with `await act(() => jest.advanceTimersByTimeAsync(ms))` for the
  mock repository delay; restore real timers after.
- Stores: build isolated stores with the factory (`createAuthStore(fakeRepository)`); reset the
  shared store in `beforeEach`.
- Test: stores/hooks logic, Zod schemas, error mapping, guards, shared components, config parity.
  Do not test implementation details or snapshot whole screens.
- Assert English strings; config parity is enforced in `tests/core/config/app-config-file.test.ts`.
- Done = `npm test` green; add tests with every behavior change.
