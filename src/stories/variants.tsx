import { Children, ReactNode } from 'react';
import { createContext } from 'src/app/utils/context';

const [HideStorybookVariantsProvider, useHideStorybookVariants] = createContext<boolean>({
  contextName: 'HideStorybookVariantsContext',
  hookName: 'useHideStorybookVariants',
  defaultValue: true,
});

export { HideStorybookVariantsProvider };

/**
 * Shows story variants.
 *
 * Can be modified to only show the first variant with `HideStorybookVariantsContext`.
 * This is useful for using stories in tests.
 */
export function StorybookVariants({ children }: { children: ReactNode }): JSX.Element | null {
  const hideVariants = useHideStorybookVariants();

  if (hideVariants) {
    const variants = Children.toArray(children);
    return variants[0] ? <>{variants[0]}</> : null;
  }

  return <div style={{ display: 'flex', gap: '10px' }}>{children}</div>;
}
