import { ApiAuthSession } from '@/app/types/auth';
import { either } from 'fp-ts';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useConfig } from '@/app/contexts/config/config-context';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { authApi } from '@/app/api/auth-api';

interface UseCheckIfLoggedInProps {
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: ApiAuthSession | null) => void;
}

interface UseLogInProps {
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: ApiAuthSession | null) => void;
}

interface UseLogOutProps {
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: ApiAuthSession | null) => void;
}

interface UseAuthIdleTimerProps {
  timeout: number;
  isLoggedIn: boolean;
  logOut: () => void;
  navigate: NavigateFunction;
}

export function useAuth() {
  const { constants } = useConfig();
  const navigate = useNavigate();

  const [isCheckingIfLoggedIn, setIsCheckingIfLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<ApiAuthSession | null>(null);

  const isLoggedIn = Boolean(user);

  useCheckIfLoggedIn({ setUser, setIsLoading: setIsCheckingIfLoggedIn });

  const logIn = createLogInHandler({ setUser, setIsLoading: setIsLoggingIn });
  const logOut = createLogOutHandler({ setUser, setIsLoading: setIsLoggingOut });

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
  const { setIsLoading, setUser } = props;

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
      // if (
      //   !(response.left instanceof Error) &&
      //   response.left.status === HttpStatusCode.Unauthorized
      // ) {
      //   // TODO router navigate
      //   return;
      // }

      // TODO
      // TODO toast / error page
    }

    void checkIfLoggedIn();

    return () => {
      controller.abort();
    };
  }, [setIsLoading, setUser]);
}

/* TODO: this is not a hook */
function createLogInHandler(props: UseLogInProps) {
  const { setUser } = props;

  return (user: ApiAuthSession) => {
    // TODO log in request

    setUser(user);
  };
}

/* TODO: this is not a hook */
function createLogOutHandler(props: UseLogOutProps) {
  const { setUser } = props;

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
    onIdle: () => {
      console.log('IDLE');

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
