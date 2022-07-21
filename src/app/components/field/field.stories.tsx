import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from 'src/app/models/styles';
import { TextInput } from '../text-input/text-input';
import { Field } from './field';

export default {
  title: 'Molecules/Field',
  component: Field,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [undefined, ...ControlSizes],
    },
  },
  args: {
    label: 'First name',
  },
} as ComponentMeta<typeof Field>;

export const Default: ComponentStoryObj<typeof Field> = {
  render: ({ size, ...args }) => (
    <>
      <Field {...args} size={size}>
        <TextInput type="text" size={size} />
      </Field>
    </>
  ),
};

export const HiddenLabel: ComponentStoryObj<typeof Field> = {
  ...Default,
  args: {
    showLabel: false,
  },
};

export const Small: ComponentStoryObj<typeof Field> = {
  ...Default,
  args: {
    size: 'small',
  },
};
