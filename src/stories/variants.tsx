import { ReactNode } from 'react';

/**
 * Shows story variants.
 */
export function StoryVariants({ children }: { children: ReactNode }): JSX.Element | null {
  return <div style={{ display: 'flex', gap: '10px' }}>{children}</div>;
}
