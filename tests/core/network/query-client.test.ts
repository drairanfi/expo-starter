import { FailureError } from '@/core/error';
import { createQueryClient, shouldRetry } from '@/core/network';

describe('query client retry policy', () => {
  it('never retries failures that cannot recover', () => {
    for (const kind of [
      'unauthorized',
      'notFound',
      'invalidCredentials',
      'invalidResponse',
    ] as const) {
      expect(shouldRetry(0, new FailureError({ kind }))).toBe(false);
    }
  });

  it('retries transient failures up to twice', () => {
    const error = new FailureError({ kind: 'network' });
    expect(shouldRetry(0, error)).toBe(true);
    expect(shouldRetry(1, error)).toBe(true);
    expect(shouldRetry(2, error)).toBe(false);
  });

  it('creates an isolated client with mutation retries off', () => {
    const a = createQueryClient();
    expect(a).not.toBe(createQueryClient());
    expect(a.getDefaultOptions().mutations?.retry).toBe(false);
  });
});
