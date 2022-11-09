import clsx from 'clsx';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/features/theme/theme-context';
import { Sun, Moon } from 'phosphor-react';
import { IconButton, IconButtonIcon } from '../icon-button/icon-button';
import styles from './theme-button.module.scss';
import { Tooltip } from '../tooltip/tooltip';

export interface ThemeButtonProps {
  className?: string;
}

export const ThemeButton = forwardRef<HTMLButtonElement, ThemeButtonProps>((props, ref) => {
  const { className } = props;

  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const Icon = theme === 'dark' ? Sun : Moon;
  const description = t(`components.themeButton.${theme}`);

  return (
    <Tooltip content={description}>
      <IconButton
        ref={ref}
        type="button"
        className={clsx(styles.themeButton, className)}
        isCustom={true}
        onClick={toggleTheme}
      >
        <IconButtonIcon label={description}>
          <Icon />
        </IconButtonIcon>
      </IconButton>
    </Tooltip>
  );
});
