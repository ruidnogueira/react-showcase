import { I18nConfig } from 'src/app/contexts/config/i18n-config';
import { format as formatDate } from 'date-fns';

export function getI18nDateFormatter(i18nConfig: I18nConfig) {
  return (value: any, language: string | undefined, { format }: { format?: string }): string => {
    if (!(value instanceof Date)) {
      throw new Error('i18nDateFormatter only supports "Date" values');
    }

    if (!format) {
      throw new Error('i18nDateFormatter requires a date format');
    }

    const locale = getDateLocale(language ?? i18nConfig.fallbackLanguage, i18nConfig);
    return formatDate(value, format, { locale });
  };
}

function getDateLocale(language: string, i18nConfig: I18nConfig): Locale {
  const locale = getLocale(language, i18nConfig);
  if (locale) {
    return locale;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const localeWithoutCulture = getLocale(language.split('-')[0]!, i18nConfig);
  if (localeWithoutCulture) {
    return localeWithoutCulture;
  }

  return i18nConfig.fallbackDateLocale;
}

function getLocale(language: string, i18nConfig: I18nConfig) {
  return i18nConfig.dateLocales[language];
}
