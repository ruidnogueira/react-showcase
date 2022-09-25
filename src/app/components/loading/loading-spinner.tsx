import { ReactComponent as SpinnerSvg } from '@/assets/spinner.svg';
import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { AccessibleIcon } from '../accessible-icon/accessible-icon';

export type LoadingSpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export function LoadingSpinner(props: LoadingSpinnerProps) {
  const { className, ...spinnerProps } = props;
  const { t } = useTranslation();

  return (
    <span
      {...spinnerProps}
      className={clsx('loading', className)}
      aria-live="polite"
      aria-busy={true}
    >
      <AccessibleIcon label={t('components.loadingSpinner')}>
        <SpinnerSvg className="loading__spinner" />
      </AccessibleIcon>
    </span>
  );
}
