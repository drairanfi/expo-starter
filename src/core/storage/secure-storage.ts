import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/** Keys used in secure storage. Keep them in one place. */
export const StorageKeys = {
  accessToken: 'access_token',
  currentUser: 'current_user',
} as const;

/** Abstraction over encrypted key/value storage so it can be faked in tests. */
export interface SecureStorage {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Backed by the iOS Keychain / Android Keystore through expo-secure-store. */
export class ExpoSecureStorage implements SecureStorage {
  read(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  write(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }

  delete(key: string): Promise<void> {
    return SecureStore.deleteItemAsync(key);
  }
}

/**
 * Web fallback. expo-secure-store has no web implementation, and browsers have
 * no secure enclave: this is `localStorage`, NOT encrypted. Fine for
 * development; do not keep real tokens here without a different strategy
 * (httpOnly cookies set by your backend).
 */
export class WebStorage implements SecureStorage {
  async read(key: string): Promise<string | null> {
    return globalThis.localStorage?.getItem(key) ?? null;
  }

  async write(key: string, value: string): Promise<void> {
    globalThis.localStorage?.setItem(key, value);
  }

  async delete(key: string): Promise<void> {
    globalThis.localStorage?.removeItem(key);
  }
}

/** In-memory implementation, useful for tests and previews. */
export class InMemorySecureStorage implements SecureStorage {
  private readonly data = new Map<string, string>();

  async read(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async write(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }
}

/** The app-wide instance (platform aware). */
export const secureStorage: SecureStorage =
  Platform.OS === 'web' ? new WebStorage() : new ExpoSecureStorage();
