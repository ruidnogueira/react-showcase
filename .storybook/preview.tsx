import { Parameters, DecoratorFunction } from '@storybook/addons';
import { DecoratorFn } from '@storybook/react';
import { initialize as initializeMsw, mswDecorator } from 'msw-storybook-addon';
import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import isChromatic from 'chromatic';
import { ConfigProvider } from '@/app/core/config/config-context';
import { Theme, ThemeContext } from '@/app/core/theme/theme-context';
import { useTranslation } from 'react-i18next';
import '@/styles/styles.scss';
import '@/mocks/i18n';
import { TooltipProvider } from '@/app/components/tooltip/tooltip';
import { PortalContainerProvider } from '@/app/core/portal-container/portal-container';
import { ErrorProvider } from '@/app/core/error/error-context';
import { ToastProvider } from '@/app/components/toast/toast-context';

// TODO: make chromatic take dark theme snapshots once it supports param snapshots https://github.com/chromaui/chromatic-cli/issues/543

initializeMsw({ onUnhandledRequest: 'bypass' });

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: ['Components', 'Features'],
    },
  },
  viewport: {
    viewports: {
      iPhone13Pro: {
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
      dynamicTitle: true,
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
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
    const [theme, setTheme] = useState<Theme>(globals.theme);

    const toggleTheme = () => setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));

    useEffect(() => {
      if (theme !== globals.theme) {
        setTheme(globals.theme);
      }
    }, [globals.theme]);

    useEffect(() => {
      document.documentElement.dataset.theme = theme;
    }, [theme]);

    return (
      <>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <Story />
        </ThemeContext.Provider>
      </>
    );
  },

  (Story, { globals }) => {
    const { i18n } = useTranslation(undefined, { useSuspense: true });
    const language = globals.language;

    useEffect(() => {
      if (i18n.languages[0] !== language) {
        i18n.changeLanguage(language);
      }
    }, [language]);

    return <Story />;
  },

  /**
   * For some reason stories with portals are not clearing portals corretly, when you switch to docs tab,
   * if they are appended to the body
   * So we create a container inside a decorator that will always be recreated
   */
  (Story) => {
    // TODO: remove this decorator when possible
    const [container, setContainer] = useState<HTMLElement | null>(null);

    return (
      <PortalContainerProvider value={container}>
        <Story />
        <div id="portal-root" ref={setContainer}></div>
      </PortalContainerProvider>
    );
  },

  (Story) => (
    <ToastProvider>
      <ErrorProvider>
        <TooltipProvider delayDuration={isChromatic() ? 0 : undefined}>
          <Story />
        </TooltipProvider>
      </ErrorProvider>
    </ToastProvider>
  ),
];

export const decorators: Array<DecoratorFunction | DecoratorFn> = [
  // Decorators are created last to first to so we reverse them
  ...reactDecorators.reverse(),
  mswDecorator,
];
