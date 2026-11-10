import type { InternalAxiosRequestConfig } from 'axios';
import { z } from 'zod';

import { FailureError } from '@/core/error';
import { createHttpClient, parseResponse } from '@/core/network';
import { logger } from '@/core/utils';

import { mockAdapter } from './mock-adapter';

function build(
  reply: Parameters<typeof mockAdapter>[0],
  options: { token?: string | null; onUnauthorized?: () => void; enableLogging?: boolean } = {},
) {
  const seen: InternalAxiosRequestConfig[] = [];
  const client = createHttpClient({
    baseURL: 'https://api.test.example.com',
    getToken: async () => options.token ?? null,
    onUnauthorized: options.onUnauthorized,
    enableLogging: options.enableLogging ?? false,
    adapter: mockAdapter(reply, seen),
  });
  return { client, seen };
}

describe('http client interceptor stack', () => {
  it('adds the bearer header when a token exists', async () => {
    const { client, seen } = build({ status: 200, data: {} }, { token: 'abc' });
    await client.get('/me');
    expect(seen[0]?.headers.get('Authorization')).toBe('Bearer abc');
  });

  it('sends no Authorization header when signed out', async () => {
    const { client, seen } = build({ status: 200, data: {} }, { token: null });
    await client.get('/public');
    expect(seen[0]?.headers.has('Authorization')).toBe(false);
  });

  it('rejects 401 with an unauthorized FailureError and notifies the app', async () => {
    const onUnauthorized = jest.fn();
    const { client } = build({ status: 401 }, { token: 'expired', onUnauthorized });

    const error = await client.get('/me').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(FailureError);
    expect((error as FailureError).failure.kind).toBe('unauthorized');
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('rejects 500 with a server failure and does not call onUnauthorized', async () => {
    const onUnauthorized = jest.fn();
    const { client } = build({ status: 500, data: { message: 'boom' } }, { onUnauthorized });

    const error = (await client.get('/x').catch((e: unknown) => e)) as FailureError;

    expect(error.failure).toMatchObject({ kind: 'server', statusCode: 500, message: 'boom' });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('rejects connection problems with a network failure', async () => {
    const { client } = build({ error: 'network' });
    const error = (await client.get('/x').catch((e: unknown) => e)) as FailureError;
    expect(error.failure.kind).toBe('network');
  });

  it('rejects timeouts with a timeout failure', async () => {
    const { client } = build({ error: 'timeout' });
    const error = (await client.get('/x').catch((e: unknown) => e)) as FailureError;
    expect(error.failure.kind).toBe('timeout');
  });

  it('resolves successful responses untouched', async () => {
    const { client } = build({ status: 200, data: { ok: true } });
    const response = await client.get('/x');
    expect(response.data).toEqual({ ok: true });
  });

  describe('logging', () => {
    afterEach(() => jest.restoreAllMocks());

    it('logs requests without leaking the token when enabled', async () => {
      const debug = jest.spyOn(logger, 'debug').mockImplementation(() => undefined);
      const { client } = build(
        { status: 200, data: {} },
        { token: 'secret-token', enableLogging: true },
      );

      await client.get('/me');

      expect(debug).toHaveBeenCalled();
      expect(JSON.stringify(debug.mock.calls)).not.toContain('secret-token');
    });

    it('does not log when disabled', async () => {
      const debug = jest.spyOn(logger, 'debug').mockImplementation(() => undefined);
      const { client } = build({ status: 200, data: {} });
      await client.get('/me');
      expect(debug).not.toHaveBeenCalled();
    });
  });
});

describe('parseResponse', () => {
  const schema = z.object({ id: z.string() });

  it('returns typed data for a valid payload', () => {
    expect(parseResponse(schema, { id: 'a' })).toEqual({ id: 'a' });
  });

  it('throws an invalidResponse failure for a bad payload', () => {
    try {
      parseResponse(schema, { id: 42 });
      throw new Error('should have thrown');
    } catch (error) {
      expect((error as FailureError).failure.kind).toBe('invalidResponse');
    }
  });
});
