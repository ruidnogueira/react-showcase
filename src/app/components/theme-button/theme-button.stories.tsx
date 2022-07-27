import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { ThemeButton as ThemeButtonComponent } from './theme-button';

export default {
  title: 'Organisms/ThemeButton',
  component: ThemeButtonComponent,
  argTypes: {},
  args: {},
} as ComponentMeta<typeof ThemeButtonComponent>;

export const ThemeButton: ComponentStoryObj<typeof ThemeButtonComponent> = {
  render: (args) => <ThemeButtonComponent {...args} />,
};
