import { ApiErrorResponse } from '@/app/api/api';
import { useCallback } from 'react';

type ErrorType = 'primary' | 'secondary';

export type ErrorHandler = (error: Error | ApiErrorResponse, type: ErrorType) => void;

// TODO: don't forget to use react-error-boundary

export interface UseErrorResponse {
  /**
   * Handles any error from the app.
   *
   * Has two types of error handling:
   * - **primary**: for errors that make the current page unusable (ex: load table data)
   * - **secondary**: for errors that don't make the current page unusable (ex: delete item from table)
   */
  handleError: ErrorHandler;
}

export function useErrorManager(): UseErrorResponse {
  const handleError = useCallback<ErrorHandler>((error, errorType) => {}, []);

  return { handleError };
}
