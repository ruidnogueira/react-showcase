import { composeStories } from '@storybook/testing-react';
import { render, renderStory } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import { UnexpectedErrorMessage } from './unexpected-error-message';
import * as stories from './unexpected-error-message.stories';
import { screen } from '@testing-library/react';
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

test('triggers reload handler', async () => {
  const handleReloadMock = vi.fn();
  const { userEvent } = render(<UnexpectedErrorMessage onReload={handleReloadMock} />);

  await userEvent.click(screen.getByRole('button', { name: 'Reload' }));

  expect(handleReloadMock).toHaveBeenCalledTimes(1);
});
