import { ApiErrorResponse } from '@/app/api/api';
import { useToast, UseToastResponse } from '@/app/components/toast/toast-context';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';

interface ErrorHandlerOptions {
  isBlocking: boolean;
}

export type ErrorHandler = (error: Error | ApiErrorResponse, options: ErrorHandlerOptions) => void;

export interface UseErrorResponse {
  /**
   * Handles any error from the app.
   *
   * Has two types of error handling:
   * - **blocking**: for errors that make the current page unusable (ex: load table data)
   * Usually this kind of errors replace the current page/block with an error page
   *
   * - **non blocking**: for errors that don't make the current page unusable (ex: delete item from table)
   * Usually this kind of errors open a toast
   */
  handleError: ErrorHandler;
}

export function useErrorManager(): UseErrorResponse {
  const sendToErrorBoundary = useErrorHandler();
  const toast = useToast();

  const handleError = useCallback<ErrorHandler>(
    (error, { isBlocking }) => {
      // TODO: log error?

      if (isBlocking) {
        sendToErrorBoundary(error);
      } else {
        handleNonBlockingError(error, toast);
      }
    },
    [sendToErrorBoundary, toast]
  );

  return { handleError };
}

function handleNonBlockingError(error: Error | ApiErrorResponse, toast: UseToastResponse) {}
