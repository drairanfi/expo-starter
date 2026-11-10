import axios, { type AxiosError } from 'axios';

import { FailureError, type Failure } from '@/core/error';

/** Converts any thrown value from axios into the app's {@link Failure} union. */
export function mapAxiosError(error: unknown): Failure {
  if (error instanceof FailureError) return error.failure;
  if (!axios.isAxiosError(error)) {
    return { kind: 'unknown', message: error instanceof Error ? error.message : undefined };
  }
  if (axios.isCancel(error)) return { kind: 'unknown', message: 'Request cancelled' };

  if (error.response) return fromStatus(error);

  switch (error.code) {
    case AxiosErrorCode.ECONNABORTED:
    case AxiosErrorCode.ETIMEDOUT:
      return { kind: 'timeout', message: error.message };
    default:
      // No response at all: DNS failure, offline, connection refused, CORS...
      return { kind: 'network', message: error.message };
  }
}

const AxiosErrorCode = {
  ECONNABORTED: 'ECONNABORTED',
  ETIMEDOUT: 'ETIMEDOUT',
} as const;

function fromStatus(error: AxiosError): Failure {
  const status = error.response?.status;
  const message = extractMessage(error.response?.data);
  switch (status) {
    case 401:
      return { kind: 'unauthorized', message };
    case 404:
      return { kind: 'notFound', message };
    default:
      return { kind: 'server', statusCode: status, message };
  }
}

function extractMessage(data: unknown): string | undefined {
  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;
    const value = record.message ?? record.error;
    if (typeof value === 'string') return value;
  }
  return undefined;
}
