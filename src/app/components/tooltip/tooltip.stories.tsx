import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Button } from '../button/button';
import { Tooltip, TooltipProvider } from './tooltip';

export default {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  argTypes: {},
  args: {
    content: 'example tooltip content',
  },
} as ComponentMeta<typeof Tooltip>;

export const NotOpen: ComponentStoryObj<typeof Tooltip> = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args} align="start">
        <Button type="button">Button</Button>
      </Tooltip>
    </TooltipProvider>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Open: ComponentStoryObj<typeof Tooltip> = {
  ...NotOpen,
  args: {
    isOpen: true,
  },
  parameters: {},
};
