import { useTheme } from '@/app/features/theme';

/**
 * Picks a different theme from the current.
 * Use this when you want a element (like toasts and tooltips) to have more contrast with the rest of the page.
 */
export function useContrastTheme() {
  const { theme } = useTheme();

  return theme === 'light' ? 'dark' : 'light';
}
