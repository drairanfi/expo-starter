# Networking and errors

- One axios client: `getHttpClient()` (`src/core/network/http-client.ts`), built by
  `createHttpClient` with interceptors in this order: auth (bearer token from `secureStorage`),
  logging (only if `enableLogging`; never headers or bodies), error mapping (last).
- Repositories use `getHttpClient()`, validate with `parseResponse`, and never catch axios errors:
  the interceptor already throws `FailureError`.
- `Failure` is a discriminated union on `kind` (`src/core/error/failure.ts`). A new kind forces
  an update of `failureMessageKey` (exhaustive `never` check), the locales and `error-mapper.ts`.
- UI shows `useLocalizedError()(error)`; never `Failure.message`. Narrow with `toFailure(error)`.
- 401: the error interceptor calls the handler set with `setUnauthorizedHandler`, registered once
  by `src/app/_layout.tsx` to sign the user out. `core` must not import the auth feature.
  A refresh-token flow, if needed, goes in that 401 path.
- Retries: `shouldRetry` in `query-client.ts` skips `unauthorized`, `invalidCredentials`,
  `notFound`, `invalidResponse`; max 2 retries.
- Base URL and logging come from `getAppConfig()`; never hardcode hosts.
- Tests use `createHttpClient({ adapter: mockAdapter(...) })` from
  `tests/core/network/mock-adapter.ts`; no real network.
