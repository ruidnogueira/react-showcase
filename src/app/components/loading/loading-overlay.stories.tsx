import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { LoadingOverlay as LoadingOverlayComponent } from './loading-overlay';

export default {
  title: 'Atoms/Loading/LoadingOverlay',
  component: LoadingOverlayComponent,
  argTypes: {},
  args: {
    isLoading: true,
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof LoadingOverlayComponent>;

export const LoadingOverlay: ComponentStoryObj<typeof LoadingOverlayComponent> = {
  render: (args) => <LoadingOverlayComponent {...args}>example text</LoadingOverlayComponent>,
  args: {
    isLoading: true,
  },
};
