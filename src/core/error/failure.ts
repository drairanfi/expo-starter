/**
 * Domain-level error type: a discriminated union on `kind`.
 * Repositories throw a {@link FailureError}; the presentation layer narrows
 * on `kind` exhaustively (see `failureMessageKey`).
 */
export type Failure =
  /** No connectivity or the host could not be reached. */
  | { kind: 'network'; message?: string }
  /** Connect, send or receive timeout. */
  | { kind: 'timeout'; message?: string }
  /** HTTP 401: missing, invalid or expired credentials. */
  | { kind: 'unauthorized'; message?: string }
  /** Login rejected because of wrong email or password. */
  | { kind: 'invalidCredentials'; message?: string }
  /** HTTP 404. */
  | { kind: 'notFound'; message?: string }
  /** HTTP 5xx or any unexpected non-success status. */
  | { kind: 'server'; statusCode?: number; message?: string }
  /** The response body did not match the expected schema. */
  | { kind: 'invalidResponse'; message?: string }
  /** Anything that could not be classified. */
  | { kind: 'unknown'; message?: string };

export type FailureKind = Failure['kind'];

/** Throwable wrapper so failures keep stack traces and satisfy `only-throw-error`. */
export class FailureError extends Error {
  readonly failure: Failure;

  constructor(failure: Failure) {
    super(`${failure.kind}${failure.message ? `: ${failure.message}` : ''}`);
    this.name = 'FailureError';
    this.failure = failure;
  }
}

/** Extracts a {@link Failure} from anything that was thrown. */
export function toFailure(error: unknown): Failure {
  if (error instanceof FailureError) return error.failure;
  return { kind: 'unknown', message: error instanceof Error ? error.message : undefined };
}

/** i18n key for each failure kind. The `never` check makes the switch exhaustive. */
export function failureMessageKey(failure: Failure) {
  switch (failure.kind) {
    case 'network':
      return 'errors.network';
    case 'timeout':
      return 'errors.timeout';
    case 'unauthorized':
      return 'errors.unauthorized';
    case 'invalidCredentials':
      return 'errors.invalidCredentials';
    case 'notFound':
      return 'errors.notFound';
    case 'server':
      return 'errors.server';
    case 'invalidResponse':
    case 'unknown':
      return 'errors.generic';
    default: {
      const unreachable: never = failure;
      return unreachable;
    }
  }
}
