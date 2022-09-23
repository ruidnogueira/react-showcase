// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useEffect, useLayoutEffect } from 'react';

/**
 * Uses `useLayoutEffect` when on the browser and `useEffect` when on the server.
 * `useLayoutEffect` does nothing on the server so `useEffect` needs to be used instead.
 *
 * Also useful for writing to refs.
 * Refs should not be written to during rendering since components should be pure functions.
 * ```
 * const ref = useRef(0);
 *
 * // Don't do this
 * ref = 1;
 *
 * // Do this
 * useIsomorphicLayoutEffect(()=> {
 *    ref = 1;
 * })
 * ```
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
