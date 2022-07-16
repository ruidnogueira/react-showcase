/* eslint-disable jsx-a11y/anchor-is-valid */
/* TODO: remove this once there is a anchor element */
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from 'src/app/models/styles';
import { StorybookVariants } from 'src/stories/variants';
import { Button, ButtonColorVariants, ButtonStyleVariants } from './button';

export default {
  title: 'Atoms/Button',
  argTypes: {
    color: { control: { disable: true } },
    size: {
      control: { type: 'select' },
      options: [undefined, ...ControlSizes],
    },
  },
  args: {
    type: 'button',
    children: 'Button',
    disabled: false,
    isLoading: false,
  },
} as ComponentMeta<typeof Button>;

export const Filled: ComponentStoryObj<typeof Button> = {
  render: (args) => (
    <StorybookVariants>
      {ButtonColorVariants.map((color) => (
        <Button {...args} key={color} color={color} />
      ))}
    </StorybookVariants>
  ),
};

export const Ghost: ComponentStoryObj<typeof Button> = {
  ...Filled,
  args: {
    variant: 'ghost',
  },
};

export const Quiet: ComponentStoryObj<typeof Button> = {
  ...Filled,
  args: {
    variant: 'quiet',
  },
};

export const Link: ComponentStoryObj<typeof Button> = {
  ...Filled,
  args: {
    variant: 'link',
  },
};

export const Small: ComponentStoryObj<typeof Button> = {
  ...Filled,
  args: {
    size: 'small',
  },
};

export const Disabled: ComponentStoryObj<typeof Button> = {
  render: (args) => (
    <StorybookVariants>
      {ButtonStyleVariants.map((variant) => (
        <Button {...args} key={variant} variant={variant} />
      ))}
    </StorybookVariants>
  ),
  args: {
    disabled: true,
  },
};

export const Loading: ComponentStoryObj<typeof Button> = {
  render: (args) => (
    <StorybookVariants>
      {ButtonStyleVariants.map((variant) => (
        <Button {...args} key={variant} variant={variant} />
      ))}
    </StorybookVariants>
  ),
  args: {
    isLoading: true,
  },
};

export const AsChild: ComponentStoryObj<typeof Button> = {
  render: ({ type, ...args }) => (
    <StorybookVariants>
      <Button {...args} asChild>
        <div>div</div>
      </Button>

      <Button {...args} asChild>
        <span>span</span>
      </Button>

      <Button {...args} asChild>
        <a href={args.disabled || args.isLoading ? undefined : '#0'}>anchor</a>
      </Button>
    </StorybookVariants>
  ),
};

export const AsChildDisabled: ComponentStoryObj<typeof Button> = {
  ...AsChild,
  args: {
    disabled: true,
  },
};

export const AsChildLoading: ComponentStoryObj<typeof Button> = {
  ...AsChild,
  args: {
    isLoading: true,
  },
};
