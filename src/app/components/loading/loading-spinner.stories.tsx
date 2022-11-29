import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { LoadingSpinner as LoadingSpinnerComponent } from './loading-spinner';

export default {
  title: 'Components/Loading/LoadingSpinner',
  component: LoadingSpinnerComponent,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof LoadingSpinnerComponent>;

export const LoadingSpinner: ComponentStoryObj<typeof LoadingSpinnerComponent> = {
  render: (args) => <LoadingSpinnerComponent {...args} />,
};
