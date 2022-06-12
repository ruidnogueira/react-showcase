import { createContext as createReactContext, useContext as useReactContext } from 'react';

export interface CreateContextOptions {
  /**
   * The name of the context
   */
  contextName: string;

  /**
   * The name of the consumer hook
   */
  hookName: string;
}

/**
 * Creates a named context, provider and hook to consume it.
 */
export function createContext<ContextType>({
  contextName,
  hookName,
}: CreateContextOptions): [
  provider: React.Provider<ContextType | undefined>,
  hook: () => ContextType,
  context: React.Context<ContextType | undefined>
] {
  const Context = createReactContext<ContextType | undefined>(undefined);
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
