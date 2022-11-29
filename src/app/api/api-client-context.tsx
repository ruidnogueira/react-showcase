import { createContext } from '@/app//utils/context';
import { ReactNode } from 'react';
import { ApiClient, createApi } from './api';

const api = createApi();

const [ApiClientContextProvider, useApiClient, ApiClientContext] = createContext<ApiClient>({
  contextName: 'ApiClientContext',
  hookName: 'useApiClient',
});

export { useApiClient, ApiClientContext };

export function ApiClientProvider({ children }: { children: ReactNode }) {
  return <ApiClientContextProvider value={api}>{children}</ApiClientContextProvider>;
}
