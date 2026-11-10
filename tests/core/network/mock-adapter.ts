import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

type Reply = { status: number; data?: unknown } | { error: 'network' | 'timeout' };

/**
 * Axios transport for tests. Behaves like the real adapters: statuses >= 400
 * reject with an AxiosError that carries the response.
 */
export function mockAdapter(
  reply: Reply | ((config: InternalAxiosRequestConfig) => Reply),
  seen: InternalAxiosRequestConfig[] = [],
): AxiosAdapter {
  return async (config) => {
    seen.push(config);
    const result = typeof reply === 'function' ? reply(config) : reply;

    if ('error' in result) {
      if (result.error === 'timeout') {
        throw new AxiosError('timeout of 15000ms exceeded', AxiosError.ECONNABORTED, config);
      }
      throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config);
    }

    const response: AxiosResponse = {
      status: result.status,
      statusText: String(result.status),
      data: result.data,
      headers: {},
      config,
    };
    if (result.status >= 400) {
      throw new AxiosError(
        `Request failed with status code ${result.status}`,
        AxiosError.ERR_BAD_RESPONSE,
        config,
        undefined,
        response,
      );
    }
    return response;
  };
}
