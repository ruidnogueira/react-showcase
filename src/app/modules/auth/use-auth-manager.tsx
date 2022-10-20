import { ApiAuthSession, ApiCreateAuthSessionRequest } from '@/app/types/auth';
import { either } from 'fp-ts';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useConfig } from '@/app/contexts/config/config-context';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useApi } from '@/app/api/api-context';
import { AuthApi } from '@/app/api/auth-api';

export interface UseAuthResponse {
  isCheckingIfLoggedIn: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isLoggedIn: boolean;
  user: ApiAuthSession | null;
  logIn: (user: ApiCreateAuthSessionRequest) => Promise<void>;
  logOut: () => Promise<void>;
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
  logOut: () => Promise<void>;
  setUser: (user: ApiAuthSession | null) => void;
  navigate: NavigateFunction;
}

export function useAuthManager(): UseAuthResponse {
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
    setUser,
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
      } else if (!(response.left instanceof Error) && response.left.status === 401) {
        // TODO router navigate or maybe do nothing and router will redirect if invalid route?
      } else {
        // TODO toast / error page
      }
    }

    void checkIfLoggedIn();

    return () => {
      controller.abort();
    };
  }, [authApi, setIsLoading, setUser]);
}

function createLogInHandler(props: UseLogInProps) {
  const { authApi, setUser, setIsLoading } = props;

  return async (user: ApiCreateAuthSessionRequest) => {
    setIsLoading(true);

    const response = await authApi.createSession(user)();

    setIsLoading(false);

    if (either.isRight(response)) {
      setUser(response.right.data);
    } else {
      // TODO: error handling
    }
  };
}

function createLogOutHandler(props: UseLogOutProps) {
  const { authApi, setUser, setIsLoading } = props;

  return async () => {
    setIsLoading(true);

    const response = await authApi.deleteSession()();

    setIsLoading(false);

    if (either.isRight(response)) {
      setUser(null);
    } else {
      // TODO: error handling
    }
  };
}

function useAuthIdleTimer(props: UseAuthIdleTimerProps) {
  const { timeout, isLoggedIn, logOut, setUser, navigate } = props;

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
        void logOut();
      } else {
        /* TODO: navigate in a useeffect whenever user is set to null? */
        setUser(null);
        navigate('/'); // TODO routes const?
      }
    },
  });
}
