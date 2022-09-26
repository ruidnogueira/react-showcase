import { ReactNode } from 'react';
import { ToastProvider } from './components/toast/toast-context';

/**
 * Groups together global providers.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
