import Constants from 'expo-constants';

import { AppConfigSchema, type AppConfig } from './schema';

/**
 * Parses and validates the `extra` block produced by `app.config.ts`.
 * Throws with a readable message so a misconfigured build fails at startup
 * instead of producing confusing runtime errors later.
 */
export function parseAppConfig(extra: unknown): AppConfig {
  const result = AppConfigSchema.safeParse(extra);
  if (!result.success) {
    throw new Error(
      `Invalid app configuration (check app.config.ts / env files): ${result.error.message}`,
    );
  }
  return result.data;
}

let cached: AppConfig | undefined;

/** Validated runtime config, memoised. Never read `Constants` directly elsewhere. */
export function getAppConfig(): AppConfig {
  cached ??= parseAppConfig(Constants.expoConfig?.extra);
  return cached;
}

/** Test helper: forget the memoised value. */
export function resetAppConfigCache(): void {
  cached = undefined;
}
