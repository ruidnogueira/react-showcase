import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ColorVariants, ControlSizes } from 'src/app/models/styles';
import { StorybookVariants } from 'src/stories/helpers/story';
import { Button } from './button';

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

const colorVariants = [undefined, ...ColorVariants];

export const Default: ComponentStoryObj<typeof Button> = {
  render: (args) => (
    <StorybookVariants>
      {colorVariants.map((color) => (
        <Button {...args} key={color ?? 'undefined'} color={color} />
      ))}
    </StorybookVariants>
  ),
};

export const Transparent: ComponentStoryObj<typeof Button> = {
  ...Default,
  args: {
    variant: 'transparent',
  },
};

export const Link: ComponentStoryObj<typeof Button> = {
  ...Default,
  args: {
    variant: 'link',
  },
};

export const Small: ComponentStoryObj<typeof Button> = {
  ...Default,
  args: {
    size: 'small',
  },
};

export const Disabled: ComponentStoryObj<typeof Button> = {
  ...Default,
  args: {
    disabled: true,
  },
};

// export const Loading: ComponentStoryObj<typeof Button> = {
//   ...Default,
//   args: {
//     isLoading: true,
//   },
// };

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
