import { QueryClient } from '@tanstack/react-query';

import { toFailure, type FailureKind } from '@/core/error';

/** Failures that will not fix themselves by retrying. */
const NON_RETRYABLE: ReadonlySet<FailureKind> = new Set([
  'unauthorized',
  'invalidCredentials',
  'notFound',
  'invalidResponse',
]);

const MAX_RETRIES = 2;

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (NON_RETRYABLE.has(toFailure(error).kind)) return false;
  return failureCount < MAX_RETRIES;
}

/** Server-state cache with sensible defaults. One instance per app (and per test). */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetry, staleTime: 30_000 },
      mutations: { retry: false },
    },
  });
}
