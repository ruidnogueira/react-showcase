import clsx from 'clsx';
import { ReactNode } from 'react';
import { LoadingSpinner, LoadingSpinnerProps } from './loading-spinner';

export interface LoadingOverlayProps extends LoadingSpinnerProps {
  children: ReactNode;

  /**
   * Shows or not the loading spinner.
   */
  isLoading: boolean;
}

/**
 * Makes the loading spinner appear on top of the rest of the content.
 *
 * Useful to show loading spinner while keeping the original element dimensions and content.
 */
export function LoadingOverlay(props: LoadingOverlayProps) {
  const { className, children, isLoading, ...spinnerProps } = props;

  return (
    <>
      {isLoading ? (
        <>
          <LoadingSpinner {...spinnerProps} className={clsx('loading--keep-content', className)} />
          <div className="loading-content-wrapper">{children}</div>
        </>
      ) : (
        children
      )}
    </>
  );
}
