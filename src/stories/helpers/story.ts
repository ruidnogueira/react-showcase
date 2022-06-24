import { ReactFramework, StoryContext } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { Themes } from 'src/app/contexts/theme/theme-context';

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
