import { composeStories } from '@storybook/testing-react';
import { screen } from '@testing-library/react';
import { axe } from '@/test/helpers/axe';
import { render, renderStory } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import * as stories from './text-input.stories';
import { TextInput } from './text-input';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

const { Default, Disabled } = composedStories;

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />);
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accessibility violations', async (_, Story) => {
  const { baseElement } = renderStory(<Story />);
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('is disabled', async () => {
  const { userEvent } = render(<TextInput type="text" disabled={true} />);

  await userEvent.click(screen.getByRole('textbox'));

  expect(screen.getByRole('textbox')).toBeDisabled();
});

test('is not disabled', async () => {
  const { userEvent } = render(<TextInput type="text" />);

  await userEvent.click(screen.getByRole('textbox'));

  expect(screen.getByRole('textbox')).toBeEnabled();
});
