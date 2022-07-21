import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from 'src/app/models/styles';
import { TextInput } from '../text-input/text-input';
import { Label } from './label';

export default {
  title: 'Atoms/Label',
  component: Label,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [undefined, ...ControlSizes],
    },
  },
  args: {},
} as ComponentMeta<typeof Label>;

export const HtmlFor: ComponentStoryObj<typeof Label> = {
  render: ({ size, ...args }) => (
    <>
      <Label {...args} htmlFor="firstName" size={size} style={{ marginRight: '10px' }}>
        First name
      </Label>

      <TextInput type="text" id="firstName" size={size} />
    </>
  ),
};

export const Nested: ComponentStoryObj<typeof Label> = {
  render: ({ size, ...args }) => (
    <>
      <Label {...args} size={size}>
        <span style={{ marginRight: '10px' }}>First name</span>
        <TextInput type="text" size={size} />
      </Label>
    </>
  ),
};

export const Small: ComponentStoryObj<typeof Label> = {
  ...HtmlFor,
  args: {
    size: 'small',
  },
};
