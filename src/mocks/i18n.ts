import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18nConfig } from 'src/app/contexts/config/i18n-config';
import { getI18nDateFormatter } from 'src/app/contexts/i18n/i18n-format';
import resources from 'virtual:i18n';

const namespace = 'translation';

// eslint-disable-next-line import/no-named-as-default-member
void i18next
  .use(initReactI18next)
  .init({
    lng: i18nConfig.fallbackLanguage,
    debug: false,
    ns: [namespace],
    defaultNS: namespace,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    resources.forEach((resource, language) => {
      i18next.addResourceBundle(language, namespace, resource);
    });

    i18next.services.formatter?.add('date', getI18nDateFormatter(i18nConfig));
  });
