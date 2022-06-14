import { ReactNode } from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { useConfig } from 'src/app/contexts/config/config-context';
import { getI18nDateFormatter } from './i18n-format';
import urlJoin from 'url-join';
import { useEffectOnMount } from 'src/app/hooks/use-effect-on-mount';
import { I18nConfig } from '../config/i18n-config';

export function I18nProvider({ children }: { children: ReactNode }) {
  const { i18nConfig } = useConfig();

  useInitI18n(i18nConfig);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}

function useInitI18n(i18nConfig: I18nConfig) {
  useEffectOnMount(() => {
    if (i18next.isInitialized) {
      return;
    }

    const initI18next = async () => {
      // eslint-disable-next-line import/no-named-as-default-member
      await i18next
        .use(Backend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          fallbackLng: i18nConfig.fallbackLanguage,
          debug: import.meta.env.DEV,

          detection: {
            order: ['localStorage', 'navigator', 'path'],
            lookupLocalStorage: i18nConfig.localStorageKey,
          },

          backend: {
            loadPath: urlJoin(import.meta.env.BASE_URL, 'locales/{{lng}}/{{ns}}.json'),
          },

          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
        });

      i18next.services.formatter?.add('date', getI18nDateFormatter(i18nConfig));
    };

    void initI18next();
  });
}
