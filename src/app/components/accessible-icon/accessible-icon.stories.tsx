import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { CrownSimple } from 'phosphor-react';
import { AccessibleIcon as AccessibleIconComponent } from './accessible-icon';

export default {
  title: 'Atoms/AccessibleIcon',
  component: AccessibleIconComponent,
  argTypes: {},
  args: {},
} as ComponentMeta<typeof AccessibleIconComponent>;

export const AccessibleIcon: ComponentStoryObj<typeof AccessibleIconComponent> = {
  render: (args) => <AccessibleIconComponent {...args} />,
  args: {
    label: 'subscribe',
    children: <CrownSimple />,
  },
};
