import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Toast } from './toast';

export default {
  title: 'Atoms/Toast',
  component: Toast,
  argTypes: {},
  args: {
    children: 'Example toast',
  },
} as ComponentMeta<typeof Toast>;

export const Default: ComponentStoryObj<typeof Toast> = {
  render: (args) => <Toast {...args} />,
};

export const Closable: ComponentStoryObj<typeof Toast> = {
  ...Default,
  args: {
    isClosable: true,
  },
};
