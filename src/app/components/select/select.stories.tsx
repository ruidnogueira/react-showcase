import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from 'src/app/types/styles';
import { StoryVariants } from 'src/stories/variants';
import { Select, SelectItem, SelectProps } from './select';

export default {
  title: 'Atoms/Select',
  component: Select,
  subcomponents: { SelectItem },
  argTypes: {},
  args: {
    placeholder: 'Select a color...',
    'aria-label': 'Select a color...',
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Select>;

const colors = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
];

export const Default: ComponentStoryObj<typeof Select> = {
  render: (args) => <ColorSelect {...args} />,
};

export const WithValue: ComponentStoryObj<typeof Select> = {
  ...Default,
  args: {
    value: colors[0]?.value,
  },
};

export const Size: ComponentStoryObj<typeof Select> = {
  render: (args) => (
    <StoryVariants>
      {ControlSizes.map((size) => (
        <ColorSelect {...args} key={size} size={size} />
      ))}
    </StoryVariants>
  ),
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

export const OpenWithoutValue: ComponentStoryObj<typeof Select> = {
  ...Default,
  args: {
    isOpen: true,
  },
};

export const OpenWithValue: ComponentStoryObj<typeof Select> = {
  ...Default,
  args: {
    isOpen: true,
    value: colors[0]?.value,
  },
};

export const OpenWithDisabledItems: ComponentStoryObj<typeof Select> = {
  render: (args) => (
    <Select {...args} style={{ width: '200px' }}>
      <SelectItem value="red">Red</SelectItem>
      <SelectItem value="green" disabled>
        Green
      </SelectItem>
      <SelectItem value="blue">Blue</SelectItem>
    </Select>
  ),
  args: {
    isOpen: true,
    value: colors[0]?.value,
  },
};

function ColorSelect(args: SelectProps) {
  return (
    <Select {...args} style={{ width: '200px' }}>
      {colors.map(({ value, label }) => (
        <SelectItem key={value} value={value}>
          {label}
        </SelectItem>
      ))}
    </Select>
  );
}
