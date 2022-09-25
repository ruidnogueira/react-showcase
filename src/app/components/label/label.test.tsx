import { composeStories } from '@storybook/testing-react';
import { axe } from '@/test/helpers/axe';
import { renderStory } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import * as stories from './label.stories';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />);
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { baseElement } = renderStory(<Story />);
  expect(await axe(baseElement)).toHaveNoViolations();
});
