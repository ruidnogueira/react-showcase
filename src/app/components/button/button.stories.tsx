import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from 'src/app/models/styles';
import { StorybookVariants } from 'src/stories/helpers/story';
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

export const AsChild: ComponentStoryObj<typeof Button> = {
  render: () => (
    <StorybookVariants>
      <Button asChild="div">
        <div>div</div>
      </Button>

      <Button asChild="span">
        <span>span</span>
      </Button>

      <Button asChild="a">
        <a href="#0">anchor</a>
      </Button>
    </StorybookVariants>
  ),
};
