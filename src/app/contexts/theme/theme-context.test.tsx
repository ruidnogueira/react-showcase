import { act } from '@testing-library/react';
import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { getFromLocalStorage, saveToLocalStorage } from 'src/app/utils/storage';
import { renderHook } from 'src/test/helpers/render';
import { ConfigProvider } from '../config/config-context';
import { Theme, ThemeProvider, useTheme } from './theme-context';

function setup({
  defaultTheme,
  themeStorageKey = 'theme',
  withProvider = true,
}: {
  defaultTheme?: Theme;
  themeStorageKey?: string;
  withProvider?: boolean;
} = {}) {
  return renderHook(() => useTheme(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ConfigProvider config={{ storageKeys: { theme: themeStorageKey } }}>
        <HelmetProvider>
          {withProvider ? (
            <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
          ) : (
            children
          )}
        </HelmetProvider>
      </ConfigProvider>
    ),
  });
}

test('renders when provider exists', () => {
  expect(() => setup()).not.toThrow();
});

test('throws error if provider is missing', () => {
  expect(() => setup({ withProvider: false })).toThrow();
});

test('sets light theme by default', () => {
  const { result } = setup();

  expect(result.current.theme).toBe('light');
});

test('sets provided initial theme', () => {
  const { result } = setup({ defaultTheme: 'dark' });

  expect(result.current.theme).toBe('dark');
});

test('sets dark theme if user prefers dark color scheme', () => {
  vi.mocked(window.matchMedia).mockImplementationOnce((query) => ({
    matches: query.includes('prefers-color-scheme: dark'),
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  const { result } = setup();

  expect(result.current.theme).toBe('dark');
});

test.each(['light', 'dark'] as const)('sets %s theme if it is in storage', (theme) => {
  const themeStorageKey = 'theme-storage';

  saveToLocalStorage(themeStorageKey, theme);

  const { result } = setup({ themeStorageKey });

  expect(result.current.theme).toBe(theme);
});

test('toggles current theme', () => {
  const themeStorageKey = 'theme-storage';
  const { result } = setup({ defaultTheme: 'light', themeStorageKey });

  const defaultTheme = result.current.theme;

  act(() => {
    result.current.toggleTheme();
  });

  const toggleTheme = result.current.theme;

  act(() => {
    result.current.toggleTheme();
  });

  expect(defaultTheme).toBe('light');
  expect(toggleTheme).toBe('dark');
  expect(result.current.theme).toBe('light');
  expect(getFromLocalStorage(themeStorageKey)).toBe('light');
});
