import { createContext } from '@/app/utils/context';
import { ReactNode } from 'react';
import { useErrorManager, UseErrorResponse } from './use-error';

export interface ErrorProviderProps {
  children: ReactNode;
}

const [ErrorContextProvider, useError, ErrorContext] = createContext<UseErrorResponse>({
  contextName: 'ErrorContext',
  hookName: 'useError',
});

export { useError, ErrorContext };

export function ErrorProvider(props: ErrorProviderProps) {
  const value = useErrorManager();

  return <ErrorContextProvider value={value}>{props.children}</ErrorContextProvider>;
}
