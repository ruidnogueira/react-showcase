import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { playStoryWithThemes } from './helpers/story';
import { Page } from './page';

export default {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Page>;

export const LoggedOut: ComponentStoryObj<typeof Page> = {
  render: (args) => <Page {...args} />,
};

export const LoggedIn: ComponentStoryObj<typeof Page> = {
  ...LoggedOut,
  play: playStoryWithThemes(async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', { name: /Log in/i });
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await userEvent.click(loginButton);
  }),
};
