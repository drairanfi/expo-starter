import createConfig from '../../../app.config';
import { AppConfigSchema } from '@/core/config';

const ORIGINAL_ENV = { ...process.env };

function configFor(variant?: string) {
  if (variant === undefined) delete process.env.APP_VARIANT;
  else process.env.APP_VARIANT = variant;
  return createConfig({ config: {}, projectRoot: '/tmp' } as never);
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('app.config.ts', () => {
  it.each([
    ['development', 'Template Dev', 'com.example.expotemplate.dev', 'expotemplate-dev'],
    ['staging', 'Template Staging', 'com.example.expotemplate.staging', 'expotemplate-staging'],
    ['production', 'Template', 'com.example.expotemplate', 'expotemplate'],
  ])('resolves name, ids and scheme for %s', (variant, name, id, scheme) => {
    const config = configFor(variant);
    expect(config.name).toBe(name);
    expect(config.ios?.bundleIdentifier).toBe(id);
    expect(config.android?.package).toBe(id);
    expect(config.scheme).toBe(scheme);
  });

  it('defaults to the development variant', () => {
    expect(configFor(undefined).name).toBe('Template Dev');
  });

  it('produces an `extra` block the runtime schema accepts (schema parity)', () => {
    for (const variant of ['development', 'staging', 'production']) {
      expect(() => AppConfigSchema.parse(configFor(variant).extra)).not.toThrow();
    }
  });

  it('lets EXPO_PUBLIC_ env vars override variant defaults', () => {
    process.env.EXPO_PUBLIC_API_BASE_URL = 'https://override.example.com';
    process.env.EXPO_PUBLIC_ENABLE_LOGGING = 'false';
    const extra = AppConfigSchema.parse(configFor('development').extra);
    expect(extra.apiBaseUrl).toBe('https://override.example.com');
    expect(extra.enableLogging).toBe(false);
  });

  it('throws on an unknown APP_VARIANT instead of silently using production', () => {
    expect(() => configFor('qa')).toThrow(/Invalid APP_VARIANT "qa"/);
  });

  it('throws when the API base URL env var is malformed', () => {
    process.env.EXPO_PUBLIC_API_BASE_URL = 'definitely not a url';
    expect(() => configFor('development')).toThrow();
  });
});
