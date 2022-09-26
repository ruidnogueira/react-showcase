import { axe } from '@/test/helpers/axe';
import { renderStoryWithProviders } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import { composeStories } from '@storybook/testing-react';
import * as stories from './service-worker-message.stories';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStoryWithProviders(<Story />);
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { baseElement } = renderStoryWithProviders(<Story />);
  expect(await axe(baseElement)).toHaveNoViolations();
});
