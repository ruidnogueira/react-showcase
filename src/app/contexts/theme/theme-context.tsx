import { ReactNode, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { createContext } from 'src/app/utils/context';
import { getFromLocalStorage, saveToLocalStorage } from 'src/app/utils/storage';
import { useConfig } from '../config/config-context';

export type Theme = 'light' | 'dark';

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
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  const { theme, themeState } = useThemeManager(initialTheme);

  return (
    <>
      <Helmet>
        <html data-theme={theme} />
      </Helmet>

      <ThemeContextProvider value={themeState}>{children}</ThemeContextProvider>
    </>
  );
}

function useThemeManager(initialTheme?: Theme) {
  const { storageKeys } = useConfig();

  const [theme, setTheme] = useState<Theme>(() => {
    if (initialTheme) {
      return initialTheme;
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
