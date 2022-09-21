import { renderHook } from 'src/test/helpers/render';
import { useTimeout } from './use-timeout';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test('executes callback after timer expires', () => {
  const callbackMock = vi.fn();
  renderHook(() => useTimeout(callbackMock, 5000));

  expect(callbackMock).not.toHaveBeenCalled();

  vi.runAllTimers();

  expect(callbackMock).toHaveBeenCalledTimes(1);
});

test('clears timer if component unmounts', () => {
  const callbackMock = vi.fn();
  const { unmount } = renderHook(() => useTimeout(callbackMock, 5000));

  unmount();
  vi.runAllTimers();

  expect(callbackMock).not.toHaveBeenCalled();
});

test('clears timer if timeout changes', () => {
  const callbackMock = vi.fn();
  const { rerender } = renderHook(({ timeout }) => useTimeout(callbackMock, timeout), {
    initialProps: { timeout: 5000 as number | null },
  });

  rerender({ timeout: null });
  vi.runAllTimers();

  expect(callbackMock).not.toHaveBeenCalled();
});

test('does not execute callback if timeout is not a number', () => {
  const callbackMock = vi.fn();
  renderHook(() => useTimeout(callbackMock));

  vi.runAllTimers();

  expect(callbackMock).not.toHaveBeenCalled();
});

test('does not retrigger timeout if callback changes, and uses latest value when timer expires', () => {
  const initialCallbackMock = vi.fn();
  const finalCallbackMock = vi.fn();

  const { rerender } = renderHook(({ callback }) => useTimeout(callback, 5000), {
    initialProps: { callback: initialCallbackMock },
  });

  rerender({ callback: finalCallbackMock });

  expect(finalCallbackMock).not.toHaveBeenCalled();

  vi.runAllTimers();

  expect(initialCallbackMock).not.toHaveBeenCalled();
  expect(finalCallbackMock).toHaveBeenCalledTimes(1);
});
