import { renderHook } from 'src/test/helpers/render';
import { ServiceWorkerProvider, useServiceWorker } from './service-worker-context';

vi.mock('virtual:pwa-register/react', () => ({ useRegisterSW: vi.fn().mockReturnValue({}) }));

test('renders when provider exists', () => {
  expect(() =>
    renderHook(() => useServiceWorker(), { wrapper: ServiceWorkerProvider })
  ).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useServiceWorker())).toThrow();

  logErrorSpy.mockRestore();
});
