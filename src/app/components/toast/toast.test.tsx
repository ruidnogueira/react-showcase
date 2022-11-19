import { composeStories } from '@storybook/testing-react';
import * as stories from './toast.stories';
import { getStoryTestCases } from '@/test/helpers/test';
import {
  renderStoryWithProviders,
  renderWithProviders,
  UserEventOptions,
} from '@/test/helpers/render';
import { axe } from '@/test/helpers/axe';
import { Toast } from './toast';
import { act, screen } from '@testing-library/react';

const { Playground, ...storiesToTest } = composeStories(stories);
const storyTestCases = getStoryTestCases({ ...storiesToTest });

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStoryWithProviders(<Story />);

  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accessibility violations', async (_, Story) => {
  vi.useRealTimers();

  const { baseElement } = renderStoryWithProviders(<Story />);

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
  const { userEvent, onCloseMock } = setup({
    isClosable: true,
    duration: 5000,
    userEventOptions: {
      advanceTimers: (delay) => vi.advanceTimersByTime(delay),
    },
  });

  expect(onCloseMock).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Close' }));

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
  const { userEvent, onCloseMock } = setup({
    duration: 5000,
    userEventOptions: {
      advanceTimers: (delay) => vi.advanceTimersByTime(delay),
    },
  });

  await userEvent.hover(screen.getByRole('alert'));

  act(() => {
    vi.runAllTimers();
  });

  expect(onCloseMock).not.toHaveBeenCalled();

  await userEvent.unhover(screen.getByRole('alert'));

  act(() => {
    vi.runAllTimers();
  });

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

function setup(
  options: { isClosable?: boolean; duration?: number; userEventOptions?: UserEventOptions } = {}
) {
  const onCloseMock = vi.fn();

  const view = renderWithProviders(
    <Toast isClosable={options.isClosable} duration={options.duration} onClose={onCloseMock}>
      Example toast
    </Toast>,
    { userEventOptions: options.userEventOptions }
  );

  return { ...view, onCloseMock };
}
