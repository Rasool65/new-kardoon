import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEn from './locales/en/translation.json';
import translationFa from './locales/fa/translation.json';
import translationAr from './locales/ar/translation.json';
import { useLocalStorage } from '@src/hooks/useLocalStorage';

export const resources = {
  fa: {
    translation: {
      ...translationFa,
    },
  },
  en: {
    translation: {
      ...translationEn,
    },
  },
  ar: {
    translation: {
      ...translationAr,
    },
  },
} as const;

i18n
  .use(initReactI18next)
  // .use(LanguageDetector)
  .init({
    debug: true,
    // lng: JSON.parse(useLocalStorage().get('language')!),
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    react: {
      useSuspense: false,
    },
    resources,
  });
