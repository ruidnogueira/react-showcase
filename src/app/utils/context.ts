// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { createContext as createReactContext, useContext as useReactContext } from 'react';

export interface CreateContextOptions<T> {
  contextName: string;
  hookName: string;
  defaultValue?: T;

  /**
   * If `true` no longer throws errors if context value is `undefined`.
   */
  isOptional?: boolean;
}

type CreateContextResult<Value, Result> = [
  provider: React.Provider<Value | undefined>,
  hook: () => Result,
  context: React.Context<Value | undefined>
];

/**
 * Creates a named context, provider and hook to consume it.
 */
export function createContext<T>(
  options: CreateContextOptions<T> & { isOptional?: false }
): CreateContextResult<T, T>;
export function createContext<T>(
  options: CreateContextOptions<never> & { isOptional: true }
): CreateContextResult<T, T | undefined>;
export function createContext<T>(options: CreateContextOptions<T>) {
  const { contextName, hookName, defaultValue, isOptional } = options;

  const Context = createReactContext<T | undefined>(defaultValue);
  Context.displayName = contextName;

  const useContext = () => {
    const context = useReactContext(Context);

    if (!isOptional && context === undefined) {
      throw new Error(`${hookName} must be used within ${contextName}`);
    }

    return context;
  };

  return [Context.Provider, useContext, Context];
}
