import { useCallback, useMemo, useState } from 'react';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'failure';

type State<T> = {
  status: AsyncStatus;
  error: T | null;
};

type SetAsyncStatusFn<T> = {
  (status: 'idle' | 'loading' | 'success'): void;
  (status: 'failure', error: T | null): void;
};

interface NonErrorAsyncState {
  isLoading: boolean;
  hasLoaded: boolean;
  hasError: false;
  error: null;
}

interface ErrorAsyncState<T> {
  isLoading: false;
  hasLoaded: false;
  hasError: true;
  error: T | null;
}

export type AsyncState<T = null> = NonErrorAsyncState | ErrorAsyncState<T>;

export type UseAsyncResponse<T> = [AsyncState<T>, SetAsyncStatusFn<T>];

/**
 * Manages the state of an async operation (like an HTTP request).
 * Useful only when not using a server state manager (like tanstack query).
 */
export function useAsyncState<T = null>(): UseAsyncResponse<T> {
  const [state, setState] = useState<State<T>>({
    status: 'idle',
    error: null,
  });

  const asyncState = useMemo(
    () => ({
      isLoading: state.status === 'loading',
      hasLoaded: state.status === 'success',
      hasError: state.status === 'failure',
      error: state.error,
    }),
    [state]
  ) as AsyncState<T>;

  const setAsyncStatus = useCallback((status: AsyncStatus, error: T | null) => {
    setState({ status, error: status === 'failure' ? error : null });
  }, []) as SetAsyncStatusFn<T>;

  return [asyncState, setAsyncStatus];
}
