import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { CrownSimple } from 'phosphor-react';
import { ControlSizes } from 'src/app/types/styles';
import { ButtonColorVariants, ButtonStyleVariants } from '../button/button';
import { IconButton, IconButtonIcon } from './icon-button';

export default {
  title: 'Atoms/Button/IconButton',
  component: IconButton,
  subcomponents: { IconButtonIcon },
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
      <IconButtonIcon label="subscribe">
        <CrownSimple />
      </IconButtonIcon>
    ),
  },
};

export const AsChild: ComponentStoryObj<typeof IconButton> = {
  ...Default,
  args: {
    asChild: true,
    children: (
      <div>
        <IconButtonIcon label="subscribe">
          <CrownSimple />
        </IconButtonIcon>
      </div>
    ),
  },
};
