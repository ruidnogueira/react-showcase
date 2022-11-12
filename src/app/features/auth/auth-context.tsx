import { createContext } from '@/app/utils/context';
import { ReactNode } from 'react';
import { useAuthManager, UseAuthResponse } from './use-auth-manager';

export interface AuthProviderProps {
  children: ReactNode;
}

const [AuthContextProvider, useAuth] = createContext<UseAuthResponse>({
  contextName: 'AuthContext',
  hookName: 'useAuth',
});

export { useAuth };

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const options = useAuthManager();

  return <AuthContextProvider value={options}>{children}</AuthContextProvider>;
}
