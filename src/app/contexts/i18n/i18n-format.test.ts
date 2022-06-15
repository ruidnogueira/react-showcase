import { I18nConfig, i18nConfig } from 'src/app/contexts/config/i18n-config';
import enGB from 'date-fns/locale/en-GB';
import enUS from 'date-fns/locale/en-US';
import ptPT from 'date-fns/locale/pt';
import { getI18nDateFormatter } from './i18n-format';

describe('date formatter', () => {
  const config: I18nConfig = {
    ...i18nConfig,
    fallbackLanguage: 'pt-PT',
    fallbackDateLocale: ptPT,
    dateLocales: {
      pt: ptPT,
      en: enGB,
      'en-US': enUS,
    },
  };

  const format = getI18nDateFormatter(config);

  test('throws error if value is not a date', () => {
    const value = 'Test value';

    expect(() => format(value, 'en-US', { format: 'MMMM' })).toThrow();
  });

  test('throws error if no format is provided', () => {
    const value = new Date('2022-01-01');

    expect(() => format(value, 'en-US', {})).toThrow();
  });

  test('formats dates for current language', () => {
    const value = new Date('2022-01-01');
    const result = format(value, 'en-US', { format: 'MMMM' });

    expect(result).toBe('January');
  });

  test('formats dates for language of same culture if current language is not supported', () => {
    const value = new Date('2022-01-01');
    const result = format(value, 'en-CA', { format: 'MMMM' });

    expect(result).toBe('January');
  });

  test('formats dates for fallback language if current language and languages from same culture  not supported', () => {
    const value = new Date('2022-01-01');
    const result = format(value, 'de-DE', { format: 'MMMM' });

    expect(result).toBe('janeiro');
  });

  test('uses fallback language if language is missing', () => {
    const value = new Date('2022-01-01');
    const result = format(value, undefined, { format: 'MMMM' });

    expect(result).toBe('janeiro');
  });
});
