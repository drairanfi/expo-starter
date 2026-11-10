import { z } from 'zod';

/** Build variants. Mirrors the EAS profiles in eas.json. */
export const AppVariantSchema = z.enum(['development', 'staging', 'production']);
export type AppVariant = z.infer<typeof AppVariantSchema>;

/**
 * Accepts real booleans and the strings "true"/"false" (env vars are always
 * strings). Anything else is rejected instead of silently coerced, because
 * `Boolean("false")` is `true`.
 */
const booleanFromEnv = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

/**
 * Runtime configuration baked into the app by `app.config.ts` (`extra`).
 * This file must stay free of React Native imports: app.config.ts loads it
 * in Node.
 */
export const AppConfigSchema = z.object({
  variant: AppVariantSchema,
  envName: z.string().min(1),
  apiBaseUrl: z.url(),
  enableLogging: booleanFromEnv,
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
