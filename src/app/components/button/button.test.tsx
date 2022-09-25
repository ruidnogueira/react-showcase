import { composeStories } from '@storybook/testing-react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '@/test/helpers/axe';
import { renderStory } from '@/test/helpers/render';
import { getStoryTestCases } from '@/test/helpers/test';
import { Button } from './button';
import * as stories from './button.stories';

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

test('is disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(
    <Button type="button" disabled onClick={onClickMock}>
      Button
    </Button>
  );

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).toBeDisabled();
  expect(onClickMock).not.toHaveBeenCalled();
});

test('is not disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(
    <Button type="button" onClick={onClickMock}>
      Button
    </Button>
  );

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).toBeEnabled();
  expect(onClickMock).toHaveBeenCalledTimes(1);
});

test('asChild is disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(
    <Button asChild disabled onClick={onClickMock}>
      <div>Button</div>
    </Button>
  );

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  expect(onClickMock).not.toHaveBeenCalled();
});

test('asChild is not disabled', async () => {
  const onClickMock = vi.fn();
  renderStory(
    <Button asChild onClick={onClickMock}>
      <div>Button</div>
    </Button>
  );

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled', 'true');
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
