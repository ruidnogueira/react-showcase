import { composeStories } from '@storybook/testing-react';
import { axe } from 'jest-axe';
import { renderStory } from 'src/test/helpers/render';
import { getStoryTestCases } from 'src/test/helpers/test';
import { TooltipProvider } from './tooltip';
import * as stories from './tooltip.stories';

const { Open } = composeStories(stories);
const storyTestCases = getStoryTestCases({ Open });

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
  expect(await axe(container)).toHaveNoViolations();
});

/* TODO: test isOpen, onOpenChange */
