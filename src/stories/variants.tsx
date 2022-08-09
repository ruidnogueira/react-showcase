import { Children, ReactNode } from 'react';
import { createContext } from 'src/app/utils/context';

const [HideStoryVariantsProvider, useHideStoryVariants] = createContext<boolean>({
  contextName: 'HideStoryVariantsContext',
  hookName: 'useHideStoryVariants',
  defaultValue: false,
});

export { HideStoryVariantsProvider };

/**
 * Shows story variants.
 *
 * Can be modified to only show the first variant with {@link HideStoryVariantsProvider}.
 * This is useful for using stories in tests.
 */
export function StoryVariants({ children }: { children: ReactNode }): JSX.Element | null {
  const hideVariants = useHideStoryVariants();

  if (hideVariants) {
    const variants = Children.toArray(children);
    return variants[0] ? <>{variants[0]}</> : null;
  }

  return <div style={{ display: 'flex', gap: '10px' }}>{children}</div>;
}
