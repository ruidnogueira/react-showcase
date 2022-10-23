import { ApiClientProvider } from '@/app/api/api-client-context';
import { ApiProvider } from '@/app/api/api-context';
import { ConfigProvider } from '@/app/contexts/config/config-context';
import { mockDatabase } from '@/mocks/server/database/database';
import { testApi } from '@/test/helpers/api';
import { renderHook } from '@/test/helpers/render';
import { act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth-context';
import userEvent from '@testing-library/user-event';

function setup({ userId }: { userId: number }) {
  document.cookie = `userId=${userId}`;

  return renderHook(() => useAuth(), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <ConfigProvider>
          <ApiClientProvider api={testApi}>
            <ApiProvider>
              <AuthProvider>{children}</AuthProvider>
            </ApiProvider>
          </ApiClientProvider>
        </ConfigProvider>
      </MemoryRouter>
    ),
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
  test('user is logged out if it does not have a session', async () => {
    const user = mockDatabase.user.create({ hasSession: false });
    const { result } = setup({ userId: user.id });

    expect(result.current.isCheckingIfLoggedIn).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test('user is logged in if it has a session', async () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const { result } = setup({ userId: user.id });

    expect(result.current.isCheckingIfLoggedIn).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(expect.objectContaining({ id: user.id }));
  });
});

describe('login', () => {
  // TODO: error handling

  test('user logs in', async () => {
    const user = mockDatabase.user.create({ hasSession: false });
    const { result } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isCheckingIfLoggedIn).toBe(false);
    });

    act(() => {
      void result.current.logIn({ email: user.email, password: user.password });
    });

    expect(result.current.isLoggingIn).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoggingIn).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(expect.objectContaining({ id: user.id }));
  });
});

describe('logout', () => {
  // TODO: error handling

  test('user logs out', async () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const { result } = setup({ userId: user.id });

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
  });

  test('user is not logged out if idle for less than 15 min', async () => {
    const user = mockDatabase.user.create({ hasSession: true });
    const { result } = setup({ userId: user.id });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
    });

    vi.advanceTimersByTime(14 * 60 * 1000);
    await userEvent.click(document.body);

    expect(result.current.isLoggedIn).toBe(true);
  });
});
