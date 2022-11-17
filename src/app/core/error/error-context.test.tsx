import { renderHook } from '@/test/helpers/render';
import { ErrorProvider, useError } from './error-context';

test('renders when provider exists', () => {
  expect(() => renderHook(() => useError(), { wrapper: ErrorProvider })).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useError())).toThrow();

  logErrorSpy.mockRestore();
});
