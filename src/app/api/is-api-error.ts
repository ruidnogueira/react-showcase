import { ApiErrorResponse } from './api';

export function isApiStatusError(
  status: number | number[],
  error: Error | ApiErrorResponse
): error is ApiErrorResponse {
  const statuses = typeof status === 'number' ? [status] : status;

  return !(error instanceof Error) && statuses.includes(error.status);
}
