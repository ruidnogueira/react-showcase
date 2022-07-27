import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Loading as LoadingComponent } from './loading';

export default {
  title: 'Atoms/Loading',
  component: LoadingComponent,
  argTypes: {},
  args: {
    isLoading: true,
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof LoadingComponent>;

export const Loading: ComponentStoryObj<typeof LoadingComponent> = {
  render: (args) => <LoadingComponent {...args}>example text</LoadingComponent>,
  args: {
    isLoading: true,
  },
};
