import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { CrownSimple } from 'phosphor-react';
import { Icon as IconComponent } from './icon';

export default {
  title: 'Atoms/Icon',
  component: IconComponent,
  argTypes: {},
  args: {},
} as ComponentMeta<typeof IconComponent>;

export const Icon: ComponentStoryObj<typeof IconComponent> = {
  render: (args) => <IconComponent {...args} />,
  args: {
    description: 'subscribe',
    children: <CrownSimple />,
  },
};
