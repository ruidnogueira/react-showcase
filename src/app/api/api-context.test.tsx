import { renderHook } from '@/test/helpers/render';
import { ApiClientProvider } from './api-client-context';
import { ApiProvider, useApi } from './api-context';

test('renders when provider exists', () => {
  expect(() =>
    renderHook(() => useApi(), {
      wrapper: ({ children }) => (
        <ApiClientProvider>
          <ApiProvider>{children}</ApiProvider>
        </ApiClientProvider>
      ),
    })
  ).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useApi(), { wrapper: ApiClientProvider })).toThrow();

  logErrorSpy.mockRestore();
});
