import { renderHook } from '@/test/helpers/render';
import { PortalContainerProvider, usePortalContainer } from './portal-container';

test('by default does not provide a portal container element', () => {
  const { result } = renderHook(() => usePortalContainer());

  expect(result.current).toBeUndefined();
});

test('provides a portal container element', () => {
  const div = document.createElement('div');
  div.id = 'example-container';

  const { result } = renderHook(() => usePortalContainer(), {
    renderOptions: {
      wrapper: ({ children }) => (
        <PortalContainerProvider value={div}>{children}</PortalContainerProvider>
      ),
    },
  });

  expect(result.current).toHaveProperty('id', 'example-container');
});
