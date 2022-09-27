import * as stories from './loading-spinner.stories';
import { composeStories } from '@storybook/testing-react';
import { renderStory } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import { axe } from '@/test/helpers/axe';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />);
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accessibility violations', async (_, Story) => {
  const { baseElement } = renderStory(<Story />);
  expect(await axe(baseElement)).toHaveNoViolations();
});
