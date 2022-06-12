import { renderHook } from '@testing-library/react';

vi.mock('virtual:pwa-register/react', () => ({ useRegisterSW: vi.fn().mockReturnValue({}) }));

import { ServiceWorkerProvider, useServiceWorker } from './service-worker-context';

test('renders when provider exists', () => {
  expect(() =>
    renderHook(() => useServiceWorker(), { wrapper: ServiceWorkerProvider })
  ).not.toThrow();
});

test('throws error if provider is missing', () => {
  expect(() => renderHook(() => useServiceWorker())).toThrow();
});
