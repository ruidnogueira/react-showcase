import { renderHook } from '@/test/helpers/render';
import { act } from '@testing-library/react';
import { useAsyncState } from './use-async';

test('by default is idle and has no error', () => {
  const { result } = renderHook(() => useAsyncState());

  const [state] = result.current;

  expect(state.isLoading).toBe(false);
  expect(state.hasLoaded).toBe(false);
  expect(state.hasError).toBe(false);
  expect(state.error).toBeNull();
});

test('is loading', () => {
  const { result } = renderHook(() => useAsyncState());

  const [, setStatus] = result.current;

  act(() => {
    setStatus('loading');
  });

  const [state] = result.current;

  expect(state.isLoading).toBe(true);
  expect(state.hasLoaded).toBe(false);
  expect(state.hasError).toBe(false);
  expect(state.error).toBeNull();
});

test('has loaded', () => {
  const { result } = renderHook(() => useAsyncState());

  const [, setStatus] = result.current;

  act(() => {
    setStatus('success');
  });

  const [state] = result.current;

  expect(state.isLoading).toBe(false);
  expect(state.hasLoaded).toBe(true);
  expect(state.hasError).toBe(false);
  expect(state.error).toBeNull();
});

test('has error', () => {
  const error = 'example error';
  const { result } = renderHook(() => useAsyncState<string>());

  const [, setStatus] = result.current;

  act(() => {
    setStatus('failure', error);
  });

  const [state] = result.current;

  expect(state.isLoading).toBe(false);
  expect(state.hasLoaded).toBe(false);
  expect(state.hasError).toBe(true);
  expect(state.error).toBe(error);
});

test('is idle', () => {
  const { result } = renderHook(() => useAsyncState());

  const [, setStatus] = result.current;

  act(() => {
    setStatus('success');
  });

  act(() => {
    setStatus('idle');
  });

  const [state] = result.current;

  expect(state.isLoading).toBe(false);
  expect(state.hasLoaded).toBe(false);
  expect(state.hasError).toBe(false);
  expect(state.error).toBeNull();
});
