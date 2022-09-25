import { composeStories } from '@storybook/testing-react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '@/test/helpers/axe';
import { renderStory } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import * as stories from './text-input.stories';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

const { Default, Disabled } = composedStories;

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />);
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { baseElement } = renderStory(<Story />);
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('is disabled', async () => {
  renderStory(<Disabled />);

  await userEvent.click(screen.getByRole('textbox'));

  expect(screen.getByRole('textbox')).toBeDisabled();
});

test('is not disabled', async () => {
  renderStory(<Default />);

  await userEvent.click(screen.getByRole('textbox'));

  expect(screen.getByRole('textbox')).toBeEnabled();
});
