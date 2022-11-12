import { createContext } from '@/app/utils/context';
import { ReactNode, useMemo } from 'react';
import { useApiClient } from './api-client-context';
import { AuthApi, createAuthApi } from './auth-api';

export interface Api {
  authApi: AuthApi;
}

const [ApiContextProvider, useApi] = createContext<Api>({
  contextName: 'ApiContext',
  hookName: 'useApi',
});

export { useApi };

export function ApiProvider({ children }: { children: ReactNode }) {
  const api = useApiClient();

  const apis = useMemo<Api>(
    () => ({
      authApi: createAuthApi(api),
    }),
    [api]
  );

  return <ApiContextProvider value={apis}>{children}</ApiContextProvider>;
}
