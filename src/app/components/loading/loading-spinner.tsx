import { ReactComponent as SpinnerSvg } from 'src/assets/spinner.svg';
import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
      <VisuallyHidden>{t('common.states.loading')}</VisuallyHidden>
      <SpinnerSvg className="loading__spinner" aria-hidden={true} />
    </span>
  );
}
