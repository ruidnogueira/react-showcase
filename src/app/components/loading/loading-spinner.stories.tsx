import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { LoadingSpinner } from './loading-spinner';

export default {
  title: 'Atoms/LoadingSpinner',
  argTypes: {},
  args: {},
} as ComponentMeta<typeof LoadingSpinner>;

export const Default: ComponentStoryObj<typeof LoadingSpinner> = {
  render: (args) => (
    <div style={{ position: 'relative', height: '200px' }}>
      <LoadingSpinner {...args} />
    </div>
  ),
};
