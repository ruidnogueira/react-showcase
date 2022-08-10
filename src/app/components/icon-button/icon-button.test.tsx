import { composeStories } from '@storybook/testing-react';
import { axe } from 'src/test/helpers/axe';
import { renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import * as stories from './icon-button.stories';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />, { hideVariants: false });
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { baseElement } = renderStory(<Story />, { hideVariants: false });
  expect(await axe(baseElement)).toHaveNoViolations();
});
