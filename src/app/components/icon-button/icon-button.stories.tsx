import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { CrownSimple } from 'phosphor-react';
import { ControlSizes } from 'src/app/models/styles';
import { ButtonColorVariants, ButtonStyleVariants } from '../button/button';
import { IconButton } from './icon-button';

export default {
  title: 'Atoms/IconButton',
  component: IconButton,
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [undefined, ...ButtonColorVariants],
    },
    size: {
      control: { type: 'select' },
      options: [undefined, ...ControlSizes],
    },
    variant: {
      control: { type: 'select' },
      options: [undefined, ...ButtonStyleVariants],
    },
    asChild: { control: { disable: true } },
  },
  args: {
    description: 'rate',
  },
} as ComponentMeta<typeof IconButton>;

export const Default: ComponentStoryObj<typeof IconButton> = {
  render: (args) => <IconButton {...args} />,
  args: {
    type: 'button',
    children: (
      <IconButton.Icon label="subscribe">
        <CrownSimple />
      </IconButton.Icon>
    ),
  },
};

export const AsChild: ComponentStoryObj<typeof IconButton> = {
  ...Default,
  args: {
    asChild: true,
    children: (
      <div>
        <IconButton.Icon label="subscribe">
          <CrownSimple />
        </IconButton.Icon>
      </div>
    ),
  },
};
