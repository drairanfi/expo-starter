// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier/flat');

/** Forbid imports that break the layering described in README.md. */
const banned = (patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

const DEEP_FEATURE_IMPORT = {
  group: ['@/features/*/*'],
  message: 'Import another feature only through its public API: "@/features/<name>".',
};

module.exports = defineConfig([
  expoConfig,
  prettier,
  {
    ignores: ['dist/*', 'coverage/*', '.expo/*', 'node_modules/*', 'ios/*', 'android/*'],
  },
  {
    rules: {
      'no-console': 'error',
      // Noisy for default-export libraries (axios, i18next) and wrong for our usage.
      'import/no-named-as-default-member': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // core is feature-agnostic and never depends on features or shared UI.
    files: ['src/core/**/*.{ts,tsx}'],
    rules: banned([
      { group: ['@/features', '@/features/*'], message: 'core must not import features.' },
      { group: ['@/shared', '@/shared/*'], message: 'core must not import shared UI.' },
    ]),
  },
  {
    // shared UI is feature-agnostic.
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: banned([
      { group: ['@/features', '@/features/*'], message: 'shared must not import features.' },
    ]),
  },
  {
    // domain is pure: no React, no infrastructure, no outer layers.
    files: ['src/features/*/domain/**/*.{ts,tsx}'],
    rules: banned([
      {
        group: ['react', 'react-native', 'expo-*', 'axios'],
        message: 'domain must stay framework-free.',
      },
      {
        group: ['@/features', '@/features/*', '@/shared/*', '@/core/storage', '@/core/network'],
        message: 'domain must not depend on outer layers.',
      },
      {
        group: ['**/data/**', '**/presentation/**'],
        message: 'domain must not import data or presentation.',
      },
    ]),
  },
  {
    // features and routes talk to other features only via their public API.
    files: ['src/features/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
    ignores: ['src/features/*/index.ts'],
    rules: banned([DEEP_FEATURE_IMPORT]),
  },
  {
    // route files are thin: they may only re-export a feature screen or lay out a navigator.
    files: ['tests/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    languageOptions: { globals: { jest: 'readonly' } },
  },
]);
