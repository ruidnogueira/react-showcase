// date-fns locales must be imported individually otherwise
// all locales will be included in the bundle
import { Locale } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';
import enUS from 'date-fns/locale/en-US';
import ptPT from 'date-fns/locale/pt';

const dateLocales: Record<string, Locale> = {
  en: enGB,
  'en-US': enUS,
  pt: ptPT,
};

export const i18nConfig = {
  localStorageKey: 'app-language',
  fallbackLanguage: 'en-GB',
  fallbackDateLocale: enGB,
  dateLocales,
  supportedLanguages: [
    { code: 'en-GB', name: 'English (GB)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'pt-PT', name: 'Português (Portugal)' },
  ],
};

export type I18nConfig = typeof i18nConfig;
