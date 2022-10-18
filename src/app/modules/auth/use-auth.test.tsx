import { ApiClientProvider } from '@/app/api/api-client-context';
import { ApiProvider } from '@/app/api/api-context';
import { ConfigProvider } from '@/app/contexts/config/config-context';
import { mockDatabase } from '@/mocks/server/database/database';
import { testApi } from '@/test/helpers/api';
import { renderHook } from '@/test/helpers/render';
import { waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './use-auth';

function setup() {
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

test('user is logged out if it does not have a session', async () => {
  document.cookie = 'userId=1';
  mockDatabase.user.create({ id: 1, hasSession: false });

  const { result } = setup();

  expect(result.current.isCheckingIfLoggedIn).toBe(true);
  expect(result.current.isLoggedIn).toBe(false);

  await waitFor(() => {
    expect(result.current.isCheckingIfLoggedIn).toBe(false);
  });

  expect(result.current.isLoggedIn).toBe(false);
});

test('user is logged in if it has a session', async () => {
  document.cookie = 'userId=1';
  mockDatabase.user.create({ id: 1, hasSession: true });

  const { result } = setup();

  expect(result.current.isCheckingIfLoggedIn).toBe(true);
  expect(result.current.isLoggedIn).toBe(false);

  await waitFor(() => {
    expect(result.current.isCheckingIfLoggedIn).toBe(false);
  });

  expect(result.current.isLoggedIn).toBe(true);
});
