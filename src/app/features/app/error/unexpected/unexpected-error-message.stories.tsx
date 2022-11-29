import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { UnexpectedErrorMessage as UnexpectedErrorMessageComponent } from './unexpected-error-message';

export default {
  title: 'Features/App/Error/UnexpectedErrorMessage',
  component: UnexpectedErrorMessageComponent,
  parameters: { layout: 'fullscreen' },
  argTypes: {},
  args: {},
} as ComponentMeta<typeof UnexpectedErrorMessageComponent>;

export const UnexpectedErrorMessage: ComponentStoryObj<typeof UnexpectedErrorMessageComponent> = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <UnexpectedErrorMessageComponent />
    </div>
  ),
};
