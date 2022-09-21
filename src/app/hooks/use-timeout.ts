import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

/**
 * Sets timeout and clears it on component unmount or timeout change.
 * Does not execute callback if no timeout is provided.
 *
 * @param delay delay in ms
 */
export function useTimeout(callback: () => void, delay?: number | null) {
  const callbackRef = useRef<() => void>(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (typeof delay === 'number') {
      const timer = setTimeout(() => callbackRef.current(), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);
}
