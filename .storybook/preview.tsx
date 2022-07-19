import { Parameters, DecoratorFunction } from '@storybook/addons';
import { DecoratorFn } from '@storybook/react';
import clsx from 'clsx';
import { initialize as initializeMsw, mswDecorator } from 'msw-storybook-addon';
import { ReactNode, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import isChromatic from 'chromatic';
import { ConfigProvider } from '../src/app/contexts/config/config-context';
import { Theme, ThemeContext } from '../src/app/contexts/theme/theme-context';
import { useTranslation } from 'react-i18next';
import 'src/styles/styles.scss';
import 'src/mocks/i18n';

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
      showName: true,
      dynamicTitle: true,
      items: ['Light', 'Dark'],
    },
  },
  language: {
    name: 'Language',
    description: 'Internationalization language',
    defaultValue: 'en-GB',
    toolbar: {
      icon: 'globe',
      dynamicTitle: true,
      items: [
        { value: 'en-GB', right: '🇬🇧', title: 'English (GB)' },
        { value: 'en-US', right: '🇺🇸', title: 'English (US)' },
        { value: 'pt-PT', right: '🇵🇹', title: 'Português (PT)' },
      ],
    },
  },
};

const reactDecorators: DecoratorFn[] = [
  (Story) => (
    <HelmetProvider>
      <ConfigProvider>
        <Story />
      </ConfigProvider>
    </HelmetProvider>
  ),

  (Story, { globals }) => {
    const { i18n } = useTranslation(undefined, { useSuspense: true });
    const language = globals.language;

    useEffect(() => {
      if (i18n.languages[0] !== language) {
        i18n.changeLanguage(language);
      }
    }, [i18n.languages[0], language]);

    return <Story />;
  },

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
    <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
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
