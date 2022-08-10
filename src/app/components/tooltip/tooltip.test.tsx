import { composeStories } from '@storybook/testing-react';
import { render, renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import { Button } from '../button/button';
import { Tooltip, TooltipProvider } from './tooltip';
import * as stories from './tooltip.stories';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'src/test/helpers/axe';

const { Default, Open } = composeStories(stories);
const storyTestCases = getStoryTestCases({ Default, Open });

test.each(storyTestCases)('renders %s story', (_, Story) => {
  const { container } = renderStory(
    <TooltipProvider delayDuration={0}>
      <Story />
    </TooltipProvider>,
    { hideVariants: false }
  );

  expect(container).toBeInTheDocument();
});

test.each(storyTestCases)('%s has no accesibility violations', async (_, Story) => {
  const { container } = renderStory(
    <TooltipProvider delayDuration={0}>
      <Story />
    </TooltipProvider>,
    { hideVariants: false }
  );

  // when the tooltip opens we need to wait for async calculations to finish otherwise test will finish before that
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {});

  expect(await axe(container)).toHaveNoViolations();
});

test('shows tooltip while hovering trigger and disappears when unhovered', async () => {
  const isOpenChangeMock = vi.fn();

  render(
    <TooltipProvider delayDuration={0}>
      <Tooltip content="Example tooltip" onIsOpenChange={isOpenChangeMock}>
        <Button type="button">Button</Button>
      </Tooltip>
    </TooltipProvider>
  );

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  await userEvent.hover(screen.getByRole('button'));

  expect(await screen.findByRole('tooltip', { name: 'Example tooltip' })).toBeInTheDocument();

  await userEvent.unhover(screen.getByRole('button'));

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(isOpenChangeMock).toHaveBeenCalledTimes(2);
  expect(isOpenChangeMock).toHaveBeenNthCalledWith(1, true);
  expect(isOpenChangeMock).toHaveBeenNthCalledWith(2, false);
});

test('shows tooltip while focusing trigger and disappears when blurred', async () => {
  const isOpenChangeMock = vi.fn();

  render(
    <TooltipProvider delayDuration={0}>
      <Tooltip content="Example tooltip" onIsOpenChange={isOpenChangeMock}>
        <Button type="button">Button</Button>
      </Tooltip>
    </TooltipProvider>
  );

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  act(() => {
    screen.getByRole('button').focus();
  });

  expect(await screen.findByRole('tooltip', { name: 'Example tooltip' })).toBeInTheDocument();

  act(() => {
    screen.getByRole('button').blur();
  });

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(isOpenChangeMock).toHaveBeenCalledTimes(2);
  expect(isOpenChangeMock).toHaveBeenNthCalledWith(1, true);
  expect(isOpenChangeMock).toHaveBeenNthCalledWith(2, false);
});
