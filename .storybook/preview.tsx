import { Parameters, DecoratorFunction } from '@storybook/addons';
import { DecoratorFn } from '@storybook/react';
import { initialize as initializeMsw, mswDecorator } from 'msw-storybook-addon';

initializeMsw({ onUnhandledRequest: 'bypass' });

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: ['Atoms', 'Molecules', 'Organisms', 'Pages'],
    },
  },
  viewport: {
    viewports: {
      galaxyS9: {
        name: 'iPhone 13 Pro',
        styles: {
          width: '390px',
          height: '844px',
        },
      },
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark'],
    },
  },
};

const reactDecorators: DecoratorFn[] = [];

export const decorators: Array<DecoratorFunction | DecoratorFn> = [
  mswDecorator,
  ...reactDecorators,
];
