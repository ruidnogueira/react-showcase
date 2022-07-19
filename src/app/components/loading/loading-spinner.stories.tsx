import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { LoadingSpinner as LoadingSpinnerComponent } from './loading-spinner';

export default {
  title: 'Atoms/LoadingSpinner',
  component: LoadingSpinnerComponent,
  argTypes: {},
  args: {},
} as ComponentMeta<typeof LoadingSpinnerComponent>;

export const LoadingSpinner: ComponentStoryObj<typeof LoadingSpinnerComponent> = {
  render: (args) => (
    <div style={{ position: 'relative', height: '200px' }}>
      <LoadingSpinnerComponent {...args} />
    </div>
  ),
};
