import clsx from 'clsx';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'src/app/contexts/theme/theme-context';
import { Sun, Moon } from 'phosphor-react';
import { IconButton } from '../icon-button/icon-button';
import styles from './theme-button.module.scss';

export interface ThemeButtonProps {
  className?: string;
}

export const ThemeButton = forwardRef<HTMLButtonElement, ThemeButtonProps>((props, ref) => {
  const { className } = props;

  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <IconButton
      ref={ref}
      type="button"
      className={clsx(styles.themeButton, className)}
      isCustom={true}
      onClick={toggleTheme}
    >
      <IconButton.Icon description={t(`components.themeButton.${theme}`)}>
        <Icon />
      </IconButton.Icon>
    </IconButton>
  );
});
