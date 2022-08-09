import { StoryFn } from '@storybook/testing-react/dist/types';

/**
 * Converts composed stories into test cases.
 *
 * @returns array of test cases composed by story name and the story
 *
 * Example:
 * ```jsx
 * import { render } from '@testing-library/react';
 * import { composeStories } from '@storybook/testing-react';
 * import * as stories from './button.stories';
 *
 * const storyTestCases = getStoryTestCases(composeStories(stories))
 *
 * test.each(storyTestCases)('renders %s story', (_, Story) => {
 *   const { container } = render(<Story />);
 *   expect(container).toBeInTheDocument();
 * });
 *```
 */
export function getStoryTestCases<T>(
  composedStories: Record<string, StoryFn<Partial<T>>>
): Array<[string, StoryFn<Partial<T>>]> {
  return Object.values(composedStories).map((Story) => [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Story.storyName!,
    Story,
  ]);
}
