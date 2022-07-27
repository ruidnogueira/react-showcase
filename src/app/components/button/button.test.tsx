import { composeStories } from '@storybook/testing-react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import * as stories from './button.stories';

const composedStories = composeStories(stories);
const storyTestCases = getStoryTestCases(composedStories);

const { Filled, Disabled, AsChild, AsChildDisabled } = composedStories;

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />, { hideVariants: false });
  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { container } = renderStory(<Story />, { hideVariants: false });
  expect(await axe(container)).toHaveNoViolations();
});

test('is disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(<Disabled onClick={onClickMock} />);

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).toBeDisabled();
  expect(onClickMock).not.toHaveBeenCalled();
});

test('is not disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(<Filled onClick={onClickMock} />);

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).toBeEnabled();
  expect(onClickMock).toHaveBeenCalledTimes(1);
});

test('asChild is disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(<AsChildDisabled onClick={onClickMock} />);

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  expect(onClickMock).not.toHaveBeenCalled();
});

test('asChild is not disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(<AsChild onClick={onClickMock} />);

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled', 'true');
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
