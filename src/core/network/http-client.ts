import axios, { type AxiosAdapter, type AxiosInstance } from 'axios';

import { secureStorage, StorageKeys } from '@/core/storage';
import { getAppConfig } from '@/core/config';

import {
  attachAuthInterceptor,
  attachErrorMappingInterceptor,
  attachLoggingInterceptor,
  type InterceptorOptions,
} from './interceptors';

export type HttpClientOptions = InterceptorOptions & {
  baseURL: string;
  timeoutMs?: number;
  /** Override the transport. Tests use this to avoid the network. */
  adapter?: AxiosAdapter;
};

/** Builds an axios instance with the full interceptor stack. */
export function createHttpClient(options: HttpClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeoutMs ?? 15_000,
    headers: { Accept: 'application/json' },
    adapter: options.adapter,
  });
  attachAuthInterceptor(client, options.getToken);
  if (options.enableLogging) attachLoggingInterceptor(client);
  attachErrorMappingInterceptor(client, options.onUnauthorized);
  return client;
}

let unauthorizedHandler: (() => void) | undefined;

/**
 * Registered once by the composition root (`app/_layout.tsx`) so core never
 * imports a feature: a 401 ends the session without a dependency cycle.
 */
export function setUnauthorizedHandler(handler: (() => void) | undefined): void {
  unauthorizedHandler = handler;
}

let shared: AxiosInstance | undefined;

/** App-wide client wired to the validated config and secure storage. */
export function getHttpClient(): AxiosInstance {
  shared ??= createHttpClient({
    baseURL: getAppConfig().apiBaseUrl,
    enableLogging: getAppConfig().enableLogging,
    getToken: () => secureStorage.read(StorageKeys.accessToken),
    onUnauthorized: () => unauthorizedHandler?.(),
  });
  return shared;
}
