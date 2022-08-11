import { Slot } from '@radix-ui/react-slot';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { HTMLAttributes, ReactNode } from 'react';

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
