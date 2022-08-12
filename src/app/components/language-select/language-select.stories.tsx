import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { LanguageSelect as LanguageSelectComponent } from './language-select';

export default {
  title: 'Organisms/LanguageSelect',
  component: LanguageSelectComponent,
  argTypes: {},
  args: {},
} as ComponentMeta<typeof LanguageSelectComponent>;

export const LanguageSelect: ComponentStoryObj<typeof LanguageSelectComponent> = {
  render: (args) => <LanguageSelectComponent {...args} />,
};
