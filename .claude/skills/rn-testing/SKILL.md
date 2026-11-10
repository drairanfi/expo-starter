---
name: rn-testing
description: Use when writing or fixing tests in this repo (jest-expo, Testing Library v14 async API, renderRouter, mockAdapter).
---

Read `.claude/rules/testing.md`.

1. File goes under `tests/` mirroring `src/`, named `<subject>.test.ts(x)`.
2. Components: `await renderWithProviders(<X />)` from `tests/test-utils.tsx`; RTL v14 is async: `await fireEvent.press(...)`, `await screen.findBy*`.
3. Routes and guards: `renderRouter('./src/app', { initialUrl })` from `expo-router/testing-library`.
4. Network: `createHttpClient({ adapter: mockAdapter(...) })` (`tests/core/network/mock-adapter.ts`).
5. Fake timers for the mock repository delay: `await act(() => jest.advanceTimersByTimeAsync(700))`.
6. Global mocks live in `tests/setup.ts`; reset shared stores and storage in `beforeEach`.
7. Run `npm test` (single file: `npx --no-install jest tests/path/file.test.tsx`).
