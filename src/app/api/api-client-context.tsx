import { createContext } from '@/app//utils/context';
import { ReactNode } from 'react';
import { ApiClient, createApi } from './api';

const api = createApi();

const [ApiClientContextProvider, useApiClient] = createContext<ApiClient>({
  contextName: 'ApiClientContext',
  hookName: 'useApiClient',
});

export { useApiClient };

export function ApiClientProvider({
  api: providedApi,
  children,
}: {
  children: ReactNode;
  api?: ApiClient;
}) {
  return <ApiClientContextProvider value={providedApi ?? api}>{children}</ApiClientContextProvider>;
}
