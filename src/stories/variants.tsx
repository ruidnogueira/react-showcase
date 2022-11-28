import { ReactNode } from 'react';

interface StoryVariantsProps {
  children: ReactNode;
  direction?: 'row' | 'column';
}

/**
 * Shows story variants.
 */
export function StoryVariants({ children, direction }: StoryVariantsProps): JSX.Element | null {
  return (
    <div style={{ display: 'inline-flex', gap: '10px', flexDirection: direction }}>{children}</div>
  );
}
