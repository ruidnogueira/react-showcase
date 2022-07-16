import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { Loading } from './loading';

export default {
  title: 'Atoms/Loading',
  argTypes: {},
  args: {
    isLoading: true,
  },
} as ComponentMeta<typeof Loading>;

export const Default: ComponentStoryObj<typeof Loading> = {
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
      <Loading {...args}>example text</Loading>
    </div>
  ),
  args: {
    isLoading: true,
  },
};
