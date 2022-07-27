import { Slot } from '@radix-ui/react-slot';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { HTMLAttributes, ReactNode } from 'react';

export interface IconProps extends HTMLAttributes<HTMLElement> {
  /**
   * Text description of the icon
   */
  description: string;

  /**
   * The icon
   */
  children: ReactNode;
}

export function Icon(props: IconProps) {
  const { description, ...iconProps } = props;

  return (
    <>
      <VisuallyHidden>{description}</VisuallyHidden>
      <Slot {...iconProps} aria-hidden={true} />
    </>
  );
}
