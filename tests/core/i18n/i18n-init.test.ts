import { getLocales } from 'expo-localization';

import { detectLanguage, initI18n } from '@/core/i18n';

const mockedGetLocales = jest.mocked(getLocales);

describe('i18n', () => {
  it('detects a supported device language', () => {
    mockedGetLocales.mockReturnValueOnce([{ languageCode: 'es' }] as never);
    expect(detectLanguage()).toBe('es');
  });

  it('falls back to English for unsupported languages', () => {
    mockedGetLocales.mockReturnValueOnce([{ languageCode: 'fr' }] as never);
    expect(detectLanguage()).toBe('en');
  });

  it('translates with interpolation and switches language', () => {
    const i18n = initI18n('en');
    expect(i18n.t('home.welcome', { name: 'Ana' })).toBe('Hello, Ana!');
    initI18n('es');
    expect(i18n.t('home.welcome', { name: 'Ana' })).toBe('¡Hola, Ana!');
    initI18n('en');
  });
});
