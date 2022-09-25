import clsx from 'clsx';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@/app/contexts/config/config-context';
import { Select, SelectItem } from '../select/select';
import styles from './language-select.module.scss';

export interface LanguageSelectProps {
  className?: string;
}

export const LanguageSelect = forwardRef<HTMLButtonElement, LanguageSelectProps>((props, ref) => {
  const { className } = props;

  const { i18nConfig } = useConfig();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (code: string) => {
    void i18n.changeLanguage(code);
  };

  return (
    <Select
      ref={ref}
      className={clsx(styles.select, className)}
      size="small"
      value={i18n.languages[0]}
      onValueChange={handleLanguageChange}
      aria-label={t('components.languageSelect')}
    >
      {i18nConfig.supportedLanguages.map(({ code, name }) => (
        <SelectItem key={code} value={code}>
          {name}
        </SelectItem>
      ))}
    </Select>
  );
});
