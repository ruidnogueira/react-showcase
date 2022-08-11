import { Parameters, DecoratorFunction } from '@storybook/addons';
import { DecoratorFn } from '@storybook/react';
import { initialize as initializeMsw, mswDecorator } from 'msw-storybook-addon';
import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import isChromatic from 'chromatic';
import { ConfigProvider } from '../src/app/contexts/config/config-context';
import { Theme, ThemeContext } from '../src/app/contexts/theme/theme-context';
import { useTranslation } from 'react-i18next';
import 'src/styles/styles.scss';
import 'src/mocks/i18n';
import { TooltipProvider } from 'src/app/components/tooltip/tooltip';
import { PortalContainerProvider } from 'src/app/contexts/portal-container/portal-container';

// TODO: make chromatic take dark theme snapshots once it supports param snapshots https://github.com/chromaui/chromatic-cli/issues/543

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
      showName: true,
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
        <TooltipProvider delayDuration={isChromatic() ? 0 : undefined}>
          <Story />
        </TooltipProvider>
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

  /**
   * For some reason stories with portals are not clearing portals corretly, when you switch to docs tab,
   * if they are appended to the body
   * So we create a container inside a decorator that will always be recreated
   */
  (Story) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    return (
      <PortalContainerProvider value={container}>
        <Story />
        <div id="portal-root" ref={setContainer}></div>
      </PortalContainerProvider>
    );
  },
];

export const decorators: Array<DecoratorFunction | DecoratorFn> = [
  // Decorators are created last to first to so we reverse them
  ...reactDecorators.reverse(),
  mswDecorator,
];
