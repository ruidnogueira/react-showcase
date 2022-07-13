import { StoryFn } from '@storybook/react';
import { RenderResult } from '@testing-library/react';
import { renderStory } from './render';

/**
 * Converts composed stories into test cases.
 *
 * @returns array of test cases composed by story name and function to render story
 *
 * Example:
 * ```jsx
 * import { render } from '@testing-library/react';
 * import { composeStories } from '@storybook/testing-react';
 * import * as stories from './button.stories';
 *
 * const storyTestCases = getStoryTestCases(composeStories(stories))
 *
 * test.each(storyTestCases)('renders %s story', (_, render) => {
 *   const { container }= render();
 *   expect(container).toBeInTheDocument();
 * });
 *```
 */
export function getStoryTestCases<T>(
  composedStories: Record<string, StoryFn<Partial<T>>>
): Array<[string, () => RenderResult]> {
  return Object.values(composedStories).map((Story) => [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Story.storyName!,
    () => renderStory(<Story />, { hideVariants: false }),
  ]);
}
