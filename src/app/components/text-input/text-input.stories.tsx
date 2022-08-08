import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from 'src/app/models/styles';
import { TextInput } from './text-input';

export default {
  title: 'Atoms/TextInput',
  component: TextInput,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [undefined, ...ControlSizes],
    },
  },
  args: {
    type: 'text',
    placeholder: 'placeholder',
    disabled: false,
    isInvalid: false,
  },
} as ComponentMeta<typeof TextInput>;

export const Default: ComponentStoryObj<typeof TextInput> = {
  render: (args) => <TextInput {...args} />,
};

export const Small: ComponentStoryObj<typeof TextInput> = {
  ...Default,
  args: {
    size: 'small',
  },
};

export const Invalid: ComponentStoryObj<typeof TextInput> = {
  ...Default,
  args: {
    isInvalid: true,
  },
};

export const Disabled: ComponentStoryObj<typeof TextInput> = {
  ...Default,
  args: {
    disabled: true,
  },
};
