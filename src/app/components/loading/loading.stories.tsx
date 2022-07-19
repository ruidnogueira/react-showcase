import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Loading as LoadingComponent } from './loading';

export default {
  title: 'Atoms/Loading',
  component: LoadingComponent,
  argTypes: {},
  args: {
    isLoading: true,
  },
} as ComponentMeta<typeof LoadingComponent>;

export const Loading: ComponentStoryObj<typeof LoadingComponent> = {
  render: (args) => (
    <div
      style={{
        position: 'relative',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LoadingComponent {...args}>example text</LoadingComponent>
    </div>
  ),
  args: {
    isLoading: true,
  },
};
