import { Slot } from '@radix-ui/react-slot';
import { HTMLAttributes, ReactNode } from 'react';
import { VisuallyHidden } from '../visually-hidden/visually-hidden';

export interface AccessibleIconProps extends HTMLAttributes<HTMLElement> {
  /**
   * The accessible label of the icon.
   */
  label: string;

  /**
   * The icon
   */
  children: ReactNode;
}

/**
 * Makes icons accessible by providing a label.
 *
 * The label will not be visible but will be announced by screen readers.
 */
export function AccessibleIcon(props: AccessibleIconProps) {
  const { label, ...iconProps } = props;

  return (
    <>
      <VisuallyHidden>{label}</VisuallyHidden>
      <Slot {...iconProps} aria-hidden={true} />
    </>
  );
}
