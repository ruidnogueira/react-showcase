import { ReactNode, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { createContext } from '@/app/utils/context';
import { getFromLocalStorage, saveToLocalStorage } from '@/app/utils/storage';
import { useConfig } from '../../contexts/config/config-context';

export const Themes = ['light', 'dark'] as const;
export type Theme = typeof Themes[number];

const [ThemeContextProvider, useTheme, ThemeContext] = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  contextName: 'ThemeContext',
  hookName: 'useTheme',
});

export { useTheme, ThemeContext };

export function ThemeProvider({
  children,
  defaultTheme,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const { theme, themeState } = useThemeManager(defaultTheme);

  return (
    <>
      <Helmet>
        <html data-theme={theme} />
      </Helmet>

      <ThemeContextProvider value={themeState}>{children}</ThemeContextProvider>
    </>
  );
}

function useThemeManager(defaultTheme?: Theme) {
  const { storageKeys } = useConfig();

  const [theme, setTheme] = useState<Theme>(() => {
    if (defaultTheme) {
      return defaultTheme;
    }

    const savedTheme = getFromLocalStorage<Theme>(storageKeys.theme);
    if (savedTheme) {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // This can be improved once useEvent hook is released
  const themeState = useMemo(() => {
    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';

      saveToLocalStorage(storageKeys.theme, newTheme);
      setTheme(newTheme);
    };

    return { theme, toggleTheme };
  }, [theme, storageKeys.theme]);

  return { theme, themeState };
}
