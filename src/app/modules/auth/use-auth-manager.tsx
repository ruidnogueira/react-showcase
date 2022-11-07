import { ApiAuthSession, ApiCreateAuthSessionRequest } from '@/app/types/auth';
import { either } from 'fp-ts';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useConfig } from '@/app/contexts/config/config-context';
import { useApi } from '@/app/api/api-context';
import { AuthApi } from '@/app/api/auth-api';
import { isApiStatusError } from '@/app/api/is-api-error';
import { AsyncState, useAsyncState } from '@/app/hooks/use-async';
import { ErrorHandler } from '@/app/modules/error/use-error';
import { useError } from '../error/error-context';
import { getFromSessionStorage } from '@/app/utils/storage';

export enum AuthLoginError {
  Invalid = 'INVALID',
  Unexpected = 'UNEXPECTED',
}

export interface UseAuthResponse {
  isCheckingIfLoggedIn: boolean;
  loginState: AsyncState<AuthLoginError>;
  isLoggingOut: boolean;
  isLoggedIn: boolean;
  user: ApiAuthSession | null;
  logIn: (user: ApiCreateAuthSessionRequest) => Promise<void>;
  logOut: () => Promise<void>;
}

interface UseCheckIfLoggedInProps {
  bypassStorageKey: string;
  authApi: AuthApi;
  setUser: (user: ApiAuthSession | null) => void;
  handleError: ErrorHandler;
}

interface UseLogInProps {
  authApi: AuthApi;
  setUser: (user: ApiAuthSession | null) => void;
}

interface UseLogOutProps {
  authApi: AuthApi;
  setUser: (user: ApiAuthSession | null) => void;
  handleError: ErrorHandler;
}

interface UseAuthIdleTimerProps {
  timeout: number;
  isLoggedIn: boolean;
  logOut: () => Promise<void>;
  setUser: (user: ApiAuthSession | null) => void;
}

export function useAuthManager(): UseAuthResponse {
  const { constants, storageKeys } = useConfig();
  const { authApi } = useApi();
  const { handleError } = useError();

  const [user, setUser] = useState<ApiAuthSession | null>(null);

  const isLoggedIn = Boolean(user);

  const { isCheckingIfLoggedIn } = useCheckIfLoggedIn({
    bypassStorageKey: storageKeys.authBypass,
    authApi,
    setUser,
    handleError,
  });

  const { loginState, logIn } = useLogIn({ authApi, setUser });
  const { isLoggingOut, logOut } = useLogOut({ authApi, setUser, handleError });

  useAuthIdleTimer({
    timeout: constants.authIdleTimeout,
    isLoggedIn,
    logOut,
    setUser,
  });

  return {
    isCheckingIfLoggedIn,
    loginState,
    isLoggingOut,
    isLoggedIn,
    user,
    logIn,
    logOut,
  };
}

function useCheckIfLoggedIn(props: UseCheckIfLoggedInProps) {
  const { bypassStorageKey, authApi, setUser, handleError } = props;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userBypass = getFromSessionStorage<ApiAuthSession>(bypassStorageKey);

    if (userBypass) {
      document.cookie = `userId=${userBypass.id}`;
      setUser(userBypass);
      return;
    }

    const controller = new AbortController();

    async function checkIfLoggedIn() {
      setIsLoading(true);

      const response = await authApi.getSession({ signal: controller.signal })();

      setIsLoading(false);

      if (either.isRight(response)) {
        setUser(response.right.data);
      } else if (isApiStatusError([401, 404], response.left)) {
        // No need to do anything router will take care of this
      } else {
        handleError(response.left, 'primary');
      }
    }

    void checkIfLoggedIn();

    return () => {
      controller.abort();
    };
  }, [bypassStorageKey, authApi, setIsLoading, setUser, handleError]);

  return { isCheckingIfLoggedIn: isLoading };
}

function useLogIn(props: UseLogInProps) {
  const { authApi, setUser } = props;

  const [status, setStatus] = useAsyncState<AuthLoginError>();

  const logIn = async (user: ApiCreateAuthSessionRequest) => {
    setStatus('loading');

    const response = await authApi.createSession(user)();

    if (either.isRight(response)) {
      setStatus('success');
      setUser(response.right.data);
    } else if (isApiStatusError(401, response.left)) {
      setStatus('failure', AuthLoginError.Invalid);
    } else {
      setStatus('failure', AuthLoginError.Unexpected);
    }
  };

  return { loginState: status, logIn };
}

function useLogOut(props: UseLogOutProps) {
  const { authApi, setUser, handleError } = props;

  const [isLoading, setIsLoading] = useState(false);

  const logOut = async () => {
    setIsLoading(true);

    const response = await authApi.deleteSession()();

    setIsLoading(false);

    if (either.isRight(response)) {
      setUser(null);
    } else {
      handleError(response.left, 'secondary');
    }
  };

  return { isLoggingOut: isLoading, logOut };
}

function useAuthIdleTimer(props: UseAuthIdleTimerProps) {
  const { timeout, isLoggedIn, logOut, setUser } = props;

  const { isLeader } = useIdleTimer({
    timeout,
    crossTab: true,
    leaderElection: true,
    syncTimers: 200,
    onIdle: () => {
      if (!isLoggedIn) {
        return;
      }

      if (isLeader()) {
        void logOut();
      } else {
        setUser(null);
      }
    },
  });
}
