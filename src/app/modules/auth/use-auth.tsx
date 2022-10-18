import { ApiAuthSession } from '@/app/types/auth';
import { either } from 'fp-ts';
import { ReactNode, useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useConfig } from '@/app/contexts/config/config-context';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { createContext } from '@/app/utils/context';
import { useApi } from '@/app/api/api-context';
import { AuthApi } from '@/app/api/auth-api';

export interface AuthProviderProps {
  children: ReactNode;
}

export interface UseAuthResponse {
  isCheckingIfLoggedIn: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isLoggedIn: boolean;
  user: ApiAuthSession | null;
  logIn: (user: ApiAuthSession) => void;
  logOut: () => void;
}

interface UseCheckIfLoggedInProps {
  authApi: AuthApi;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: ApiAuthSession | null) => void;
}

interface UseLogInProps {
  authApi: AuthApi;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: ApiAuthSession | null) => void;
}

interface UseLogOutProps {
  authApi: AuthApi;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: ApiAuthSession | null) => void;
}

interface UseAuthIdleTimerProps {
  timeout: number;
  isLoggedIn: boolean;
  logOut: () => void;
  navigate: NavigateFunction;
}

const [AuthContextProvider, useAuth] = createContext<UseAuthResponse>({
  contextName: 'AuthContext',
  hookName: 'useAuth',
});

export { useAuth };

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;

  const options = useAuthManager(); // TODO: add a way to bypass session request?

  return <AuthContextProvider value={options}>{children}</AuthContextProvider>;
}

function useAuthManager(): UseAuthResponse {
  const { constants } = useConfig();
  const { authApi } = useApi();
  const navigate = useNavigate();

  const [isCheckingIfLoggedIn, setIsCheckingIfLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<ApiAuthSession | null>(null);

  const isLoggedIn = Boolean(user);

  useCheckIfLoggedIn({ authApi, setUser, setIsLoading: setIsCheckingIfLoggedIn });

  const logIn = createLogInHandler({ authApi, setUser, setIsLoading: setIsLoggingIn });
  const logOut = createLogOutHandler({ authApi, setUser, setIsLoading: setIsLoggingOut });

  useAuthIdleTimer({
    timeout: constants.authIdleTimeout,
    isLoggedIn,
    logOut,
    navigate,
  });

  return {
    isCheckingIfLoggedIn,
    isLoggingIn,
    isLoggingOut,
    isLoggedIn,
    user,
    logIn,
    logOut,
  };
}

function useCheckIfLoggedIn(props: UseCheckIfLoggedInProps) {
  const { authApi, setIsLoading, setUser } = props;

  useEffect(() => {
    const controller = new AbortController();

    async function checkIfLoggedIn() {
      setIsLoading(true);

      const response = await authApi.getSession({ signal: controller.signal })();

      setIsLoading(false);

      if (either.isRight(response)) {
        setUser(response.right.data);
        return;
      }

      /* TODO: create util */
      if (!(response.left instanceof Error) && response.left.status === 401) {
        // TODO router navigate
        return;
      }

      // TODO
      // TODO toast / error page
    }

    void checkIfLoggedIn();

    return () => {
      controller.abort();
    };
  }, [authApi, setIsLoading, setUser]);
}

function createLogInHandler(props: UseLogInProps) {
  const { authApi, setUser } = props;

  return (user: ApiAuthSession) => {
    // TODO log in request

    setUser(user);
  };
}

function createLogOutHandler(props: UseLogOutProps) {
  const { authApi, setUser } = props;

  return () => {
    // TODO log out request

    setUser(null);
  };
}

function useAuthIdleTimer(props: UseAuthIdleTimerProps) {
  const { timeout, isLoggedIn, logOut, navigate } = props;

  const { isLeader } = useIdleTimer({
    timeout,
    crossTab: true,
    leaderElection: true,
    // syncTimers: 200, // TODO: what does this do?
    onIdle: () => {
      if (!isLoggedIn) {
        return;
      }

      if (isLeader()) {
        logOut();
      }

      // TODO routes const?
      navigate('/');
    },
  });
}
