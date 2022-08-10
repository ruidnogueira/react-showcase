import * as stories from './loading-overlay.stories';
import { composeStories } from '@storybook/testing-react';
import { renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import { axe } from 'src/test/helpers/axe';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />, { hideVariants: false });
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { container } = renderStory(<Story />, { hideVariants: false });
  expect(await axe(container)).toHaveNoViolations();
});
