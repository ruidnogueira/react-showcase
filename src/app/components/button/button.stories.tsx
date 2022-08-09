import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from 'src/app/models/styles';
import { StorybookVariants } from 'src/stories/variants';
import { LoadingOverlay } from '../loading/loading-overlay';
import { Button, ButtonColorVariants, ButtonStyleVariants } from './button';

export default {
  title: 'Atoms/Button/Button',
  component: Button,
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

export const Custom: ComponentStoryObj<typeof Button> = {
  render: (args) => (
    <Button {...args} style={{ background: 'salmon', color: 'black', borderRadius: '0' }} />
  ),
  args: {
    isCustom: true,
  },
};

export const WithLoading: ComponentStoryObj<typeof Button> = {
  render: ({ children, ...args }) => (
    <StorybookVariants>
      {ButtonStyleVariants.map((variant) => (
        <Button {...args} key={variant} variant={variant}>
          <LoadingOverlay isLoading={true}>{children}</LoadingOverlay>
        </Button>
      ))}
    </StorybookVariants>
  ),
  args: {
    disabled: true,
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
        {args.disabled ? <span>anchor</span> : <a href="#0">anchor</a>}
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
