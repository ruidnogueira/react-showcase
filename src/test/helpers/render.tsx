import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
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
import { ThemeProvider } from 'src/app/contexts/theme/theme-context';
import { HideStorybookVariantsProvider } from 'src/stories/variants';

interface RenderWithProvidersOptions {
  wrapper?: JSXElementConstructor<{ children: ReactElement }>;
  routerProps?: MemoryRouterProps;
}

interface RenderHookWithProvidersOptions<Props> extends RenderHookOptions<Props> {
  routerProps?: MemoryRouterProps;
}

interface TestProviderProps {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
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
  const { wrapper: Wrapper, ...props } = options;

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <TestProviders>{Wrapper ? <Wrapper {...props}>{children}</Wrapper> : children}</TestProviders>
  );

  return render(ui, { wrapper: AllProviders });
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
  const { wrapper: Wrapper, initialProps, ...props } = options;

  const AllProviders = ({ children }: { children: ReactElement }) => (
    <TestProviders>{Wrapper ? <Wrapper {...props}>{children}</Wrapper> : children}</TestProviders>
  );

  return renderHook(callback, { initialProps, wrapper: AllProviders });
}

/**
 * Provide missing providers that are global in storybook.
 */
export function renderStory(ui: ReactElement, options: { hideVariants?: boolean } = {}) {
  return render(ui, {
    wrapper: ({ children }) => <StoryTestProviders {...options}>{children}</StoryTestProviders>,
  });
}

function TestProviders({ children, routerProps }: TestProviderProps) {
  return (
    <MemoryRouter {...routerProps}>
      <HelmetProvider>
        <ConfigProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ConfigProvider>
      </HelmetProvider>
    </MemoryRouter>
  );
}

function StoryTestProviders({
  children,
  hideVariants = true,
}: {
  children: ReactNode;
  hideVariants?: boolean;
}) {
  return (
    <HelmetProvider>
      <ConfigProvider>
        <ThemeProvider>
          <HideStorybookVariantsProvider value={hideVariants}>
            {children}
          </HideStorybookVariantsProvider>
        </ThemeProvider>
      </ConfigProvider>
    </HelmetProvider>
  );
}
