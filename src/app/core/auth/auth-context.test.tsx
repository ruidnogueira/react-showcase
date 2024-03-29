import { mockDatabase } from '@/mocks/server/database/database';
import { renderHook, renderHookWithProviders } from '@/test/helpers/render';
import { act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth-context';
import userEvent from '@testing-library/user-event';
import { AuthLoginError } from './use-auth-manager';
import { mockServer } from '@/mocks/server/server';
import { handleApiCreateSession, handleApiGetSession } from '@/mocks/server/handlers/user-handlers';
import { databaseUserToAuthSession } from '@/mocks/server/dtos/user-dtos';
import { saveToSessionStorage } from '@/app/utils/storage';
import { storageKeys } from '@/app/core/config/storage-config';

function setup({ userId }: { userId: number | null }) {
  if (userId !== null) {
    document.cookie = `userId=${userId}`;
  }

  return renderHookWithProviders(() => useAuth(), {
    renderOptions: {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    },
  });
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe('context', () => {
  test('renders when provider exists', () => {
    expect(() => setup({ userId: 1 })).not.toThrow();
  });

  test('throws error if provider is missing', () => {
    const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow();

    logErrorSpy.mockRestore();
  });
});

describe('check if logged in', () => {
  test('user is logged out if no cookie is provided', async () => {
    const { result, handleErrorMock } = setup({ userId: null });

    expect(result.current.isCheckingIfLoggedIn).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(handleErrorMock).not.toHaveBeenCalled();
  });

  test('user is logged out if it does not have a session', async () => {
    const user = mockDatabase.user.create({ hasSession: false });
    const { result, handleErrorMock } = setup({ userId: user.id });

    expect(result.current.isCheckingIfLoggedIn).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(handleErrorMock).not.toHaveBeenCalled();
  });

  test('user is logged out if it fails to check', async () => {
    mockServer.use(handleApiGetSession((_, res, ctx) => res.once(ctx.status(500))));

    const user = mockDatabase.user.create({ hasSession: true });
    const { result, handleErrorMock } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(handleErrorMock).toHaveBeenCalled();
  });

  test('user is logged in', async () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const { result, handleErrorMock } = setup({ userId: user.id });

    expect(result.current.isCheckingIfLoggedIn).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(expect.objectContaining({ id: user.id }));
    expect(handleErrorMock).not.toHaveBeenCalled();
  });

  test('bypasses logged in check', () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const session = databaseUserToAuthSession(user);

    saveToSessionStorage(storageKeys.authBypass, session);

    const { result } = setup({ userId: null });

    expect(result.current.isCheckingIfLoggedIn).toBe(false);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(expect.objectContaining({ id: user.id }));
    expect(document.cookie).toBe(`userId=${user.id}`);
  });
});

describe('login', () => {
  test('user logs in', async () => {
    const user = mockDatabase.user.create({ hasSession: false });
    const { result } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    act(() => {
      void result.current.logIn({ email: user.email, password: user.password });
    });

    expect(result.current.loginState.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.loginState.hasLoaded).toBe(true);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(expect.objectContaining({ id: user.id }));
  });

  test('fails to log in if wrong email or password', async () => {
    const user = mockDatabase.user.create({ password: '12345Abc.', hasSession: false });
    const { result } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    act(() => {
      void result.current.logIn({ email: user.email, password: 'wrong password' });
    });

    expect(result.current.loginState.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.loginState.hasError).toBe(true);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.loginState.error).toBe(AuthLoginError.Invalid);
  });

  test('fails to log in if server has problems', async () => {
    mockServer.use(handleApiCreateSession((_, res, ctx) => res.once(ctx.status(500))));

    const user = mockDatabase.user.create({ hasSession: false });
    const { result } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    act(() => {
      void result.current.logIn({ email: user.email, password: user.password });
    });

    expect(result.current.loginState.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.loginState.hasError).toBe(true);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.loginState.error).toBe(AuthLoginError.Unexpected);
  });
});

describe('logout', () => {
  test('user logs out', async () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const { result, handleErrorMock } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    act(() => {
      void result.current.logOut();
    });

    expect(result.current.isLoggingOut).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoggingOut).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(handleErrorMock).not.toHaveBeenCalled();
  });

  test('fails to log out', async () => {
    mockDatabase.user.create({ hasSession: false });
    const { result, handleErrorMock } = setup({ userId: null });

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    act(() => {
      void result.current.logOut();
    });

    expect(result.current.isLoggingOut).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoggingOut).toBe(false);
    });

    expect(handleErrorMock).toHaveBeenCalledTimes(1);
  });
});

describe('idle timer', () => {
  test('user is logged out if idle for 15 min', async () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const { result } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
    });

    vi.advanceTimersByTime(15 * 60 * 1000);
    await userEvent.click(document.body);

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test('user is not logged out if idle for less than 15 min', async () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const { result } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
    });

    vi.advanceTimersByTime(15 * 60 * 1000 - 1000);
    await userEvent.click(document.body);

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(expect.objectContaining({ id: user.id }));
  });
});
