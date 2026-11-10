import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { ConfigContext, ExpoConfig } from 'expo/config';

import { z } from 'zod';

// NOTE: Expo loads this file in plain Node, which cannot resolve extensionless
// `.ts` imports, so it cannot import src/core/config/schema.ts. These two
// schemas mirror it; tests/core/config/app-config-file.test.ts fails if the
// output of this file ever stops satisfying the runtime schema.
const AppVariantSchema = z.enum(['development', 'staging', 'production']);
type AppVariant = z.infer<typeof AppVariantSchema>;

const ExtraSchema = z.object({
  variant: AppVariantSchema,
  envName: z.string().min(1),
  apiBaseUrl: z.url(),
  enableLogging: z.preprocess(
    (value) => (value === 'true' ? true : value === 'false' ? false : value),
    z.boolean(),
  ),
});

/**
 * ONE place to rename the app. Change these constants when you clone the
 * template; every variant (name, ids, scheme) derives from them.
 *
 * - BASE_APP_ID becomes the iOS bundleIdentifier and Android package of the
 *   production variant. Other variants append a suffix (.dev / .staging).
 * - Android packages must be valid Java package names (no dashes).
 */
const BASE_APP_ID = 'com.example.expotemplate';
const BASE_APP_NAME = 'Template';
const BASE_SLUG = 'expo-template';
const BASE_SCHEME = 'expotemplate';

type VariantSettings = {
  /** Human readable app name shown under the launcher icon. */
  name: string;
  /** Appended to BASE_APP_ID (empty for production). */
  idSuffix: string;
  /** Short environment label exposed to the app (`extra.envName`). */
  envName: string;
  /** Appended to BASE_SCHEME (empty for production). */
  schemeSuffix: string;
  /** Default API base URL; override with EXPO_PUBLIC_API_BASE_URL. */
  defaultApiBaseUrl: string;
  /** Verbose HTTP logging default; override with EXPO_PUBLIC_ENABLE_LOGGING. */
  defaultEnableLogging: boolean;
};

const VARIANTS: Record<AppVariant, VariantSettings> = {
  development: {
    name: `${BASE_APP_NAME} Dev`,
    envName: 'dev',
    idSuffix: '.dev',
    schemeSuffix: '-dev',
    defaultApiBaseUrl: 'https://dev.api.example.com',
    defaultEnableLogging: true,
  },
  staging: {
    name: `${BASE_APP_NAME} Staging`,
    envName: 'staging',
    idSuffix: '.staging',
    schemeSuffix: '-staging',
    defaultApiBaseUrl: 'https://staging.api.example.com',
    defaultEnableLogging: true,
  },
  production: {
    name: BASE_APP_NAME,
    envName: 'prod',
    idSuffix: '',
    schemeSuffix: '',
    defaultApiBaseUrl: 'https://api.example.com',
    defaultEnableLogging: false,
  },
};

/** Resolves APP_VARIANT, failing loudly on typos instead of silently shipping production. */
function resolveVariant(): AppVariant {
  const raw = process.env.APP_VARIANT ?? 'development';
  const parsed = AppVariantSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Invalid APP_VARIANT "${raw}". Expected one of: ${AppVariantSchema.options.join(', ')}.`,
    );
  }
  return parsed.data;
}

/**
 * Loads `.env.<variant>` (git-ignored; copy from `.env.<variant>.example`).
 * Existing process env wins, so EAS / CI values are never overridden by files.
 */
function loadVariantEnvFile(variant: AppVariant): void {
  const file = join(__dirname, `.env.${variant}`);
  if (existsSync(file)) {
    process.loadEnvFile(file);
  }
}

/** Optional per-variant icon: drop `assets/images/icon.<variant>.png` to use it. */
function iconFor(variant: AppVariant): string {
  const custom = `./assets/images/icon.${variant}.png`;
  return existsSync(join(__dirname, custom)) ? custom : './assets/images/icon.png';
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const variant = resolveVariant();
  loadVariantEnvFile(variant);
  // Read through an alias: babel-preset-expo inlines literal `process.env.EXPO_PUBLIC_*`
  // at transform time (e.g. under jest), which would freeze these values.
  const { env } = process;
  const settings = VARIANTS[variant];
  const appId = `${BASE_APP_ID}${settings.idSuffix}`;

  // Runtime config, validated at config time so a bad value fails the build,
  // and validated again at app start (see src/core/config).
  const extra = ExtraSchema.parse({
    variant,
    envName: settings.envName,
    apiBaseUrl: env.EXPO_PUBLIC_API_BASE_URL ?? settings.defaultApiBaseUrl,
    enableLogging: env.EXPO_PUBLIC_ENABLE_LOGGING ?? settings.defaultEnableLogging,
  });

  return {
    ...config,
    name: settings.name,
    slug: BASE_SLUG,
    version: '1.0.0',
    orientation: 'portrait',
    icon: iconFor(variant),
    scheme: `${BASE_SCHEME}${settings.schemeSuffix}`,
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: appId,
      supportsTablet: true,
    },
    android: {
      package: appId,
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      ],
      'expo-secure-store',
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra,
  };
};
