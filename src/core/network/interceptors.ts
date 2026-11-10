import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { FailureError } from '@/core/error';
import { logger } from '@/core/utils';

import { mapAxiosError } from './error-mapper';

/** Supplies the current access token (or null when signed out). */
export type TokenReader = () => Promise<string | null>;

export type InterceptorOptions = {
  getToken: TokenReader;
  /** Called after a 401 so the app can end the session. */
  onUnauthorized?: () => void;
  enableLogging: boolean;
};

/** Adds `Authorization: Bearer <token>` when a token is available. */
export function attachAuthInterceptor(client: AxiosInstance, getToken: TokenReader): void {
  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  });
}

/**
 * Logs requests and responses. Headers and bodies are never logged, so
 * the Authorization header cannot leak.
 */
export function attachLoggingInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    logger.debug(`--> ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`);
    return config;
  });
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      logger.debug(`<-- ${response.status} ${response.config.url ?? ''}`);
      return response;
    },
    (error: AxiosError) => {
      logger.debug(
        `<-- ERROR ${error.response?.status ?? error.code ?? 'unknown'} ${error.config?.url ?? ''}`,
      );
      return Promise.reject(error);
    },
  );
}

/**
 * Maps every failed request to a {@link FailureError} so callers only ever
 * catch one error type. Must be registered last (response interceptors run in
 * registration order).
 */
export function attachErrorMappingInterceptor(
  client: AxiosInstance,
  onUnauthorized?: () => void,
): void {
  client.interceptors.response.use(undefined, (error: unknown) => {
    const failure = mapAxiosError(error);
    if (failure.kind === 'unauthorized') onUnauthorized?.();
    return Promise.reject(new FailureError(failure));
  });
}
