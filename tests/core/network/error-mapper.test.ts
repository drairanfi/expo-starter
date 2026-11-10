import { AxiosError } from 'axios';

import { FailureError } from '@/core/error';
import { mapAxiosError } from '@/core/network';

function axiosError(status: number | undefined, data?: unknown, code?: string) {
  const config = { headers: {} } as never;
  const response =
    status === undefined
      ? undefined
      : ({ status, data, statusText: '', headers: {}, config } as never);
  return new AxiosError('failed', code, config, undefined, response);
}

describe('mapAxiosError', () => {
  it('maps 401 to unauthorized', () => {
    expect(mapAxiosError(axiosError(401)).kind).toBe('unauthorized');
  });

  it('maps 404 to notFound', () => {
    expect(mapAxiosError(axiosError(404)).kind).toBe('notFound');
  });

  it('maps 500 to server and keeps the status code', () => {
    expect(mapAxiosError(axiosError(500))).toMatchObject({ kind: 'server', statusCode: 500 });
  });

  it('extracts a message from the response body', () => {
    expect(mapAxiosError(axiosError(500, { message: 'db down' })).message).toBe('db down');
    expect(mapAxiosError(axiosError(500, { error: 'bad' })).message).toBe('bad');
  });

  it('maps timeouts', () => {
    expect(mapAxiosError(axiosError(undefined, undefined, AxiosError.ECONNABORTED)).kind).toBe(
      'timeout',
    );
  });

  it('maps a missing response to network', () => {
    expect(mapAxiosError(axiosError(undefined, undefined, AxiosError.ERR_NETWORK)).kind).toBe(
      'network',
    );
  });

  it('passes through an already mapped failure', () => {
    const failure = { kind: 'notFound' } as const;
    expect(mapAxiosError(new FailureError(failure))).toBe(failure);
  });

  it('maps non-axios errors to unknown', () => {
    expect(mapAxiosError(new Error('x'))).toEqual({ kind: 'unknown', message: 'x' });
  });
});
