import { ReactFramework, StoryContext } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { Children, ReactNode } from 'react';
import { Themes } from 'src/app/contexts/theme/theme-context';
import { createContext } from 'src/app/utils/context';

type PlayFunction<Args> = (context: StoryContext<ReactFramework, Args>) => Promise<void> | void;

/**
 * Plays storybook interactions for each available theme
 */
export function playStoryWithThemes<Args>(play: PlayFunction<Args>): PlayFunction<Args> {
  return async (context) => {
    const canvas = within(context.canvasElement);

    const themePlays = Themes.map((theme) => {
      const themeCanvasElement = canvas.queryByTestId(`storybook-theme-${theme}`);

      if (themeCanvasElement) {
        return play({ ...context, canvasElement: themeCanvasElement });
      }
    });

    return Promise.all(themePlays).then(() => {
      return;
    });
  };
}

const [HideStorybookVariantsProvider, useHideStorybookVariants] = createContext<boolean>({
  contextName: 'HideStorybookVariantsContext',
  hookName: 'useHideStorybookVariants',
  defaultValue: false,
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
