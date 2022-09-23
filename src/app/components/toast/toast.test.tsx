import { composeStories } from '@storybook/testing-react';
import * as stories from './toast.stories';
import { getStoryTestCases } from 'src/test/helpers/test';
import { render, renderStory } from 'src/test/helpers/render';
import { axe } from 'src/test/helpers/axe';
import { Toast } from './toast';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { Playground, ...storiesToTest } = composeStories(stories);
const storyTestCases = getStoryTestCases(storiesToTest);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(<Story />);

  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  vi.useRealTimers();

  const { baseElement } = renderStory(<Story />);

  expect(await axe(baseElement)).toHaveNoViolations();

  vi.useFakeTimers();
});

test('shows close button when closable', () => {
  setup({ isClosable: true });
  expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
});

test('does not show close button when not closable', () => {
  setup({ isClosable: false });
  expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
});

test('calls onClose when close button is clicked', async () => {
  const { onCloseMock } = setup({ isClosable: true, duration: 5000 });

  expect(onCloseMock).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Close' }), {
    advanceTimers: (delay) => vi.advanceTimersByTime(delay),
  });

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('calls onClose when duration expires', () => {
  const { onCloseMock } = setup({ duration: 5000 });

  expect(onCloseMock).not.toHaveBeenCalled();

  act(() => {
    vi.runAllTimers();
  });

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('cancels close timer while hovered and restarts timer when unhovered', async () => {
  const { onCloseMock } = setup({ duration: 5000 });

  await userEvent.hover(screen.getByRole('alert'), {
    advanceTimers: (delay) => vi.advanceTimersByTime(delay),
  });

  act(() => {
    vi.runAllTimers();
  });

  expect(onCloseMock).not.toHaveBeenCalled();

  await userEvent.unhover(screen.getByRole('alert'), {
    advanceTimers: (delay) => vi.advanceTimersByTime(delay),
  });

  act(() => {
    vi.runAllTimers();
  });

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

function setup({ isClosable, duration }: { isClosable?: boolean; duration?: number } = {}) {
  const onCloseMock = vi.fn();

  render(
    <Toast isClosable={isClosable} duration={duration} onClose={onCloseMock}>
      Example toast
    </Toast>
  );

  return { onCloseMock };
}
