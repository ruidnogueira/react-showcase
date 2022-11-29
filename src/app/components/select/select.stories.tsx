import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ControlSizes } from '@/app/types/styles';
import { StoryVariants } from '@/stories/variants';
import { Select, SelectItem, SelectProps } from './select';

export default {
  title: 'Components/Select',
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
    value: 'red',
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
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: 300,
    },
  },
};

export const OpenWithValue: ComponentStoryObj<typeof Select> = {
  ...OpenWithoutValue,
  args: {
    isOpen: true,
    value: 'red',
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
  },
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: 200,
    },
  },
};

export const OpenWithScrollUpButton: ComponentStoryObj<typeof Select> = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <ColorSelect {...args} value="white" />
    </div>
  ),
  args: {
    isOpen: true,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      inlineStories: false,
      iframeHeight: 300,
    },
  },
};

export const OpenWithScrollDownButton: ComponentStoryObj<typeof Select> = {
  render: (args) => (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ColorSelect {...args} value="red" />
      </div>
    </div>
  ),
  args: {
    isOpen: true,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      inlineStories: false,
      iframeHeight: 300,
    },
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
