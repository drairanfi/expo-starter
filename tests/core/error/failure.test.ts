import { FailureError, failureMessageKey, toFailure, type Failure } from '@/core/error';
import { en } from '@/core/i18n/locales/en';

const everyKind: Failure[] = [
  { kind: 'network' },
  { kind: 'timeout' },
  { kind: 'unauthorized' },
  { kind: 'invalidCredentials' },
  { kind: 'notFound' },
  { kind: 'server', statusCode: 500 },
  { kind: 'invalidResponse' },
  { kind: 'unknown' },
];

describe('Failure', () => {
  it('unwraps a FailureError', () => {
    const failure: Failure = { kind: 'notFound', message: 'nope' };
    expect(toFailure(new FailureError(failure))).toBe(failure);
  });

  it('wraps unknown errors as `unknown`', () => {
    expect(toFailure(new Error('boom'))).toEqual({ kind: 'unknown', message: 'boom' });
    expect(toFailure('weird')).toEqual({ kind: 'unknown', message: undefined });
  });

  it('maps every failure kind to an existing English translation', () => {
    for (const failure of everyKind) {
      const [, key] = failureMessageKey(failure).split('.');
      expect(en.errors).toHaveProperty(key ?? '');
    }
  });
});
