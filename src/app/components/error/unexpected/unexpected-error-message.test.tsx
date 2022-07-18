import { composeStories } from '@storybook/testing-react';
import { axe } from 'jest-axe';
import { render, renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import { UnexpectedErrorMessage } from './unexpected-error-message';
import * as stories from './unexpected-error-message.stories';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

const reloadSpy = vi.fn();
const originalLocation = window.location;

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload: reloadSpy },
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

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

test('reload page', async () => {
  // const reloadSpy = vi.spyOn(location, 'reload');

  render(<UnexpectedErrorMessage />);

  await userEvent.click(screen.getByRole('button', { name: 'Reload' }));

  expect(reloadSpy).toHaveBeenCalledTimes(1);
});
