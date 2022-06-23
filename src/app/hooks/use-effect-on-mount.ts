import { EffectCallback, useEffect, useRef } from 'react';

/**
 * Ensures that code is only ran once on mount.
 *
 * Since React 18, components are mounted twice. This causes hooks to be ran twice.
 * useEffect is for synchonization events and should not be used for "fire and forget" events.
 * But sometimes those type of events need to be ran on mount.
 *
 * For now this is the best solution for these types of scenarios but in the future it
 * should be changed when `Suspense` API is finalized.
 *
 * https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
 */
export function useEffectOnMount(effect: EffectCallback) {
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;

    executedRef.current = true;

    effect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
