import { ReactElement, ReactNode } from 'react';
import {
  // eslint-disable-next-line @typescript-eslint/no-restricted-imports
  render as tlRender,
  // eslint-disable-next-line @typescript-eslint/no-restricted-imports
  renderHook as tlRenderHook,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react';
import { MemoryRouterProps, MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from 'src/app/contexts/config/config-context';
import { HelmetProvider } from 'react-helmet-async';
import { Theme, ThemeProvider } from 'src/app/contexts/theme/theme-context';
import { TooltipProvider } from 'src/app/components/tooltip/tooltip';

interface RenderWithProvidersOptions extends RenderOptions {
  routerProps?: MemoryRouterProps;
  defaultTheme?: Theme;
}

interface RenderHookWithProvidersOptions<Props> extends RenderHookOptions<Props> {
  routerProps?: MemoryRouterProps;
  defaultTheme?: Theme;
}

type RenderStoryOptions = RenderOptions;

type RenderStoryWithProvidersOptions = RenderStoryOptions;

interface TestProviderProps {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
  defaultTheme?: Theme;
}

/**
 * Renders elements
 */
export function render(ui: ReactElement, options?: RenderOptions) {
  return tlRender(ui, options);
}

/**
 * Provides global providers required for smart components (i18n, routing, etc)
 */
export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { wrapper: Wrapper, routerProps, defaultTheme, ...props } = options;

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <TestProviders routerProps={routerProps} defaultTheme={defaultTheme}>
      {Wrapper ? <Wrapper>{children}</Wrapper> : children}
    </TestProviders>
  );

  return render(ui, { ...props, wrapper: AllProviders });
}

/**
 * Renders a hook
 */
export function renderHook<Props, Result>(
  callback: (props: Props) => Result,
  options?: RenderHookOptions<Props>
) {
  return tlRenderHook(callback, options);
}

/**
 * Provides global providers required for hooks that require smart components (i18n, routing, etc)
 */
export function renderHookWithProviders<Props, Result>(
  callback: (props: Props) => Result,
  options: RenderHookWithProvidersOptions<Props> = {}
) {
  const { wrapper: Wrapper, routerProps, defaultTheme, ...props } = options;

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <TestProviders routerProps={routerProps} defaultTheme={defaultTheme}>
      {Wrapper ? <Wrapper>{children}</Wrapper> : children}
    </TestProviders>
  );

  return renderHook(callback, { ...props, wrapper: AllProviders });
}

/**
 * Renders a story
 */
export function renderStory(ui: ReactElement, options: RenderStoryOptions = {}) {
  const { wrapper: Wrapper, ...props } = options;

  const AllProviders = ({ children }: { children: ReactElement }) =>
    Wrapper ? <Wrapper>{children}</Wrapper> : children;

  return render(ui, { ...props, wrapper: AllProviders });
}

/**
 * Provides missing providers that are global in storybook.
 */
export function renderStoryWithProviders(
  ui: ReactElement,
  options: RenderStoryWithProvidersOptions = {}
) {
  const { wrapper: Wrapper, ...props } = options;

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <StoryTestProviders>
      {Wrapper ? <Wrapper {...props}>{children}</Wrapper> : children}
    </StoryTestProviders>
  );

  return renderStory(ui, { ...props, wrapper: AllProviders });
}

function TestProviders({ children, routerProps, defaultTheme }: TestProviderProps) {
  return (
    <MemoryRouter {...routerProps}>
      <HelmetProvider>
        <ConfigProvider>
          <ThemeProvider defaultTheme={defaultTheme}>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </ThemeProvider>
        </ConfigProvider>
      </HelmetProvider>
    </MemoryRouter>
  );
}

function StoryTestProviders({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <ConfigProvider>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ThemeProvider>
      </ConfigProvider>
    </HelmetProvider>
  );
}
