import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Select, SelectItem } from './select';

export default {
  title: 'Atoms/Select',
  component: Select,
  subcomponents: { SelectItem },
  argTypes: {},
  args: {
    placeholder: 'Select a color...',
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Select>;

export const Default: ComponentStoryObj<typeof Select> = {
  render: (args) => (
    <Select {...args} style={{ width: '200px' }} aria-label="Select a color...">
      <SelectItem value="red">Red</SelectItem>
      <SelectItem value="green">Green</SelectItem>
      <SelectItem value="blue">Blue</SelectItem>
      <SelectItem value="yellow">Yellow</SelectItem>
      <SelectItem value="purple">Purple</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </Select>
  ),
  args: { isOpen: true },
};

export const Small: ComponentStoryObj<typeof Select> = {
  ...Default,
  args: {
    size: 'small',
  },
};

export const Invalid: ComponentStoryObj<typeof Select> = {
  ...Default,
  args: {
    isInvalid: true,
  },
};

export const Disabled: ComponentStoryObj<typeof Select> = {
  ...Default,
  args: {
    disabled: true,
  },
};
