import { renderHook } from '@/test/helpers/render';
import { ApiClientProvider, useApiClient } from './api-client-context';

test('renders when provider exists', () => {
  expect(() => renderHook(() => useApiClient(), { wrapper: ApiClientProvider })).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useApiClient())).toThrow();

  logErrorSpy.mockRestore();
});
