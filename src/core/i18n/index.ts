import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { es } from './locales/es';

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

/** Picks the first device language we ship translations for. */
export function detectLanguage(): SupportedLanguage {
  for (const locale of getLocales()) {
    const code = locale.languageCode;
    if (code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code)) {
      return code as SupportedLanguage;
    }
  }
  return FALLBACK_LANGUAGE;
}

/**
 * Initialises i18next. Resources are bundled, so `initAsync: false` makes the
 * instance ready synchronously (no loading flash). Safe to call more than once.
 */
export function initI18n(language: SupportedLanguage = detectLanguage()) {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: FALLBACK_LANGUAGE,
      interpolation: { escapeValue: false }, // React already escapes
      initAsync: false,
      returnNull: false,
    });
  } else if (i18n.language !== language) {
    void i18n.changeLanguage(language);
  }
  return i18n;
}

export { i18n };
export { useLocalizedError } from './use-localized-error';
