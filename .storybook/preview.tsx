import '../src/styles/styles.scss';
import { Parameters, DecoratorFunction } from '@storybook/addons';
import { DecoratorFn } from '@storybook/react';
import clsx from 'clsx';
import { initialize as initializeMsw, mswDecorator } from 'msw-storybook-addon';
import { ReactNode, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import isChromatic from 'chromatic';
import { ConfigProvider } from '../src/app/contexts/config/config-context';
import { I18nProvider } from '../src/app/contexts/i18n/i18n-context';
import { Theme, ThemeContext } from '../src/app/contexts/theme/theme-context';

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
      showName: true,
      dynamicTitle: true,
    },
  },
};

const reactDecorators: DecoratorFn[] = [
  (Story) => (
    <HelmetProvider>
      <ConfigProvider>
        <I18nProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Story />
          </Suspense>
        </I18nProvider>
      </ConfigProvider>
    </HelmetProvider>
  ),

  (Story, { globals, parameters }) =>
    isChromatic() ? (
      <>
        <ThemeWrapper theme="light" parameters={parameters}>
          <Story />
        </ThemeWrapper>

        <ThemeWrapper theme="dark" parameters={parameters}>
          <Story />
        </ThemeWrapper>
      </>
    ) : (
      <ThemeWrapper theme={globals.theme} parameters={parameters}>
        <Story />
      </ThemeWrapper>
    ),
];

export const decorators: Array<DecoratorFunction | DecoratorFn> = [
  mswDecorator,
  ...reactDecorators,
];

function ThemeWrapper({
  children,
  theme,
  parameters,
}: {
  children: ReactNode;
  theme: Theme;
  parameters: Parameters;
}) {
  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {} }}>
      <div
        data-theme={theme}
        data-testid={`storybook-theme-${theme}`}
        className={clsx('storybook-theme_wrapper', {
          [`storybook-theme_wrapper--${parameters.layout}`]: parameters.layout,
        })}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
