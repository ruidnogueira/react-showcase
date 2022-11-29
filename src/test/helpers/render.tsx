import { ReactElement, ReactNode } from 'react';
import {
  // eslint-disable-next-line @typescript-eslint/no-restricted-imports
  render as tlRender,
  // eslint-disable-next-line @typescript-eslint/no-restricted-imports
  renderHook as tlRenderHook,
  RenderHookOptions as TlRenderHookOptions,
  RenderOptions as TlRenderOptions,
} from '@testing-library/react';
import { MemoryRouterProps, MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from '@/app/core/config/config-context';
import { HelmetProvider } from 'react-helmet-async';
import { Theme, ThemeProvider } from '@/app/core/theme/theme-context';
import { TooltipProvider } from '@/app/components/tooltip/tooltip';
import { testApi } from './api';
import { ApiClientContext } from '@/app/api/api-client-context';
import { ApiProvider } from '@/app/api/api-context';
import { ToastProvider } from '@/app/components/toast/toast-context';
import { ErrorContext, ErrorProvider } from '@/app/core/error/error-context';
import { ErrorHandler } from '@/app/core/error/use-error-manager';
import userEvent from '@testing-library/user-event';

export type UserEventOptions = Parameters<typeof userEvent.setup>[0];

interface RenderOptions {
  renderOptions?: TlRenderOptions;
  userEventOptions?: UserEventOptions;
}

interface RenderWithProvidersOptions extends RenderOptions {
  routerProps?: MemoryRouterProps;
  defaultTheme?: Theme;
}

interface RenderHookOptions<Props> {
  renderOptions?: TlRenderHookOptions<Props>;
  userEventOptions?: UserEventOptions;
}

interface RenderHookWithProvidersOptions<Props> extends RenderHookOptions<Props> {
  routerProps?: MemoryRouterProps;
  defaultTheme?: Theme;
}

type RenderStoryOptions = RenderOptions;

type RenderStoryWithProvidersOptions = RenderStoryOptions;

interface TestProviderProps {
  children: ReactNode;
  handleError: ErrorHandler;
  routerProps?: MemoryRouterProps;
  defaultTheme?: Theme;
}

/**
 * Renders elements and sets up userEvent
 */
export function render(ui: ReactElement, options: RenderOptions = {}) {
  return {
    ...tlRender(ui, options.renderOptions),
    userEvent: userEvent.setup(options.userEventOptions),
  };
}

/**
 * Provides global providers required for smart components (i18n, routing, etc)
 */
export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { renderOptions = {}, userEventOptions, routerProps, defaultTheme } = options;
  const Wrapper = renderOptions.wrapper;

  const handleErrorMock = vi.fn();

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <TestProviders
      routerProps={routerProps}
      defaultTheme={defaultTheme}
      handleError={handleErrorMock}
    >
      {Wrapper ? <Wrapper>{children}</Wrapper> : children}
    </TestProviders>
  );

  const view = render(ui, {
    userEventOptions,
    renderOptions: { ...renderOptions, wrapper: AllProviders },
  });

  return { ...view, handleErrorMock };
}

/**
 * Renders a hook
 */
export function renderHook<Props, Result>(
  callback: (props: Props) => Result,
  options: RenderHookOptions<Props> = {}
) {
  return {
    ...tlRenderHook(callback, options.renderOptions),
    userEvent: userEvent.setup(options.userEventOptions),
  };
}

/**
 * Provides global providers required for hooks that require smart components (i18n, routing, etc)
 */
export function renderHookWithProviders<Props, Result>(
  callback: (props: Props) => Result,
  options: RenderHookWithProvidersOptions<Props> = {}
) {
  const { renderOptions = {}, userEventOptions, routerProps, defaultTheme } = options;
  const Wrapper = renderOptions.wrapper;

  const handleErrorMock = vi.fn();

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <TestProviders
      routerProps={routerProps}
      defaultTheme={defaultTheme}
      handleError={handleErrorMock}
    >
      {Wrapper ? <Wrapper>{children}</Wrapper> : children}
    </TestProviders>
  );

  const result = renderHook(callback, {
    userEventOptions,
    renderOptions: { ...renderOptions, wrapper: AllProviders },
  });

  return { ...result, handleErrorMock };
}

/**
 * Renders a story
 */
export function renderStory(ui: ReactElement, options: RenderStoryOptions = {}) {
  const { renderOptions = {}, userEventOptions } = options;
  const Wrapper = renderOptions.wrapper;

  const AllProviders = ({ children }: { children: ReactElement }) =>
    Wrapper ? <Wrapper>{children}</Wrapper> : children;

  return render(ui, {
    userEventOptions,
    renderOptions: { ...renderOptions, wrapper: AllProviders },
  });
}

/**
 * Provides missing providers that are global in storybook.
 */
export function renderStoryWithProviders(
  ui: ReactElement,
  options: RenderStoryWithProvidersOptions = {}
) {
  const { renderOptions = {}, userEventOptions } = options;
  const Wrapper = renderOptions.wrapper;

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <StoryTestProviders>{Wrapper ? <Wrapper>{children}</Wrapper> : children}</StoryTestProviders>
  );

  return renderStory(ui, {
    userEventOptions,
    renderOptions: { ...renderOptions, wrapper: AllProviders },
  });
}

function TestProviders(props: TestProviderProps) {
  const { children, routerProps, defaultTheme, handleError } = props;

  return (
    <MemoryRouter {...routerProps}>
      <HelmetProvider>
        <ConfigProvider>
          <ThemeProvider defaultTheme={defaultTheme}>
            <ToastProvider>
              <ErrorContext.Provider value={{ handleError }}>
                <ApiClientContext.Provider value={testApi}>
                  <ApiProvider>
                    <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
                  </ApiProvider>
                </ApiClientContext.Provider>
              </ErrorContext.Provider>
            </ToastProvider>
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
          <ToastProvider>
            <ErrorProvider>
              <ApiClientContext.Provider value={testApi}>
                <ApiProvider>
                  <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
                </ApiProvider>
              </ApiClientContext.Provider>
            </ErrorProvider>
          </ToastProvider>
        </ThemeProvider>
      </ConfigProvider>
    </HelmetProvider>
  );
}
