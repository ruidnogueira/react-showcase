import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translationsNS'],
  defaultNS: 'translationsNS',

  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  react: {
    useSuspense: false,
  },

  resources: { en: { translationsNS: {} } },
});
