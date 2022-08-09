import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
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

export const Scroll: ComponentStoryObj<typeof Select> = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100vh',
        padding: '10px',
      }}
    >
      <ColorSelect {...args} value={colors.at(-1)?.value} />
      <ColorSelect {...args} value={colors.at(0)?.value} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
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
