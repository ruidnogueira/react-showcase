// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { createContext as createReactContext, useContext as useReactContext } from 'react';

export interface CreateContextOptions<ContextType> {
  /**
   * The name of the context
   */
  contextName: string;

  /**
   * The name of the consumer hook
   */
  hookName: string;

  /**
   * The default value of the context
   */
  defaultValue?: ContextType;
}

/**
 * Creates a named context, provider and hook to consume it.
 */
export function createContext<ContextType>({
  contextName,
  hookName,
  defaultValue,
}: CreateContextOptions<ContextType>): [
  provider: React.Provider<ContextType | undefined>,
  hook: () => ContextType,
  context: React.Context<ContextType | undefined>
] {
  const Context = createReactContext<ContextType | undefined>(defaultValue);
  Context.displayName = contextName;

  const useContext = () => {
    const context = useReactContext(Context);

    if (context === undefined) {
      throw new Error(`${hookName} must be used within ${contextName}`);
    }

    return context;
  };

  return [Context.Provider, useContext, Context];
}
