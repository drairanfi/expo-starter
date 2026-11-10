import { getAppConfig, parseAppConfig, AppConfigSchema } from '@/core/config';
import { resetAppConfigCache } from '@/core/config/app-config';

const valid = {
  variant: 'staging',
  envName: 'staging',
  apiBaseUrl: 'https://staging.api.example.com',
  enableLogging: true,
};

describe('AppConfigSchema', () => {
  it('accepts a valid config', () => {
    expect(AppConfigSchema.parse(valid)).toEqual(valid);
  });

  it('rejects an unknown variant', () => {
    expect(AppConfigSchema.safeParse({ ...valid, variant: 'qa' }).success).toBe(false);
  });

  it('rejects a malformed API base URL', () => {
    expect(AppConfigSchema.safeParse({ ...valid, apiBaseUrl: 'not a url' }).success).toBe(false);
  });

  it('rejects an empty env name', () => {
    expect(AppConfigSchema.safeParse({ ...valid, envName: '' }).success).toBe(false);
  });

  it('parses boolean strings from env vars without the Boolean("false") trap', () => {
    expect(AppConfigSchema.parse({ ...valid, enableLogging: 'false' }).enableLogging).toBe(false);
    expect(AppConfigSchema.parse({ ...valid, enableLogging: 'true' }).enableLogging).toBe(true);
  });

  it('rejects ambiguous boolean strings', () => {
    expect(AppConfigSchema.safeParse({ ...valid, enableLogging: 'yes' }).success).toBe(false);
  });
});

describe('parseAppConfig', () => {
  it('fails loudly with a readable message when config is missing', () => {
    expect(() => parseAppConfig(undefined)).toThrow(/Invalid app configuration/);
  });

  it('fails loudly when a field is wrong', () => {
    expect(() => parseAppConfig({ ...valid, apiBaseUrl: 'nope' })).toThrow(/apiBaseUrl|Invalid/);
  });
});

describe('getAppConfig', () => {
  beforeEach(resetAppConfigCache);

  it('reads the validated config from expo-constants and memoises it', () => {
    const first = getAppConfig();
    expect(first.envName).toBe('dev');
    expect(getAppConfig()).toBe(first);
  });
});
