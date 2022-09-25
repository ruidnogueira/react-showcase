import { renderHook } from '@/test/helpers/render';
import { useEffectOnMount } from './use-effect-on-mount';

test('executes effect once', () => {
  // no way to test unmount and remount right now.
  // if a way to do it is found update the test.

  const effectMock = vi.fn();

  renderHook(() =>
    useEffectOnMount(() => {
      effectMock();
    })
  );

  expect(effectMock).toHaveBeenCalledTimes(1);
});
