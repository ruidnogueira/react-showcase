import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { ControlSize } from 'src/app/models/styles';
import { Slot } from '@radix-ui/react-slot';
import { StrictUnion } from 'src/app/types/union';
import clsx from 'clsx';

export const ButtonColorVariants = ['primary', 'secondary', 'negative'] as const;
export type ButtonColorVariant = typeof ButtonColorVariants[number];

export const ButtonStyleVariants = ['filled', 'ghost', 'quiet', 'link'] as const;
export type ButtonStyleVariant = typeof ButtonStyleVariants[number];

type OriginalButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'type' | 'color'
>;

interface BaseButtonProps extends OriginalButtonProps {
  /**
   * The color variant of the button
   */
  color?: ButtonColorVariant;

  /**
   * The style variant of the button
   */
  variant?: ButtonStyleVariant;

  /**
   * The size of the button
   */
  size?: ControlSize;
}

interface UnslottedButtonProps extends BaseButtonProps {
  /**
   * The type of the html button
   */
  type: 'submit' | 'button';
}

interface SlottedButtonProps extends BaseButtonProps {
  children: ReactElement<{ children: ReactNode }>;

  /**
   * Passes props to child element instead of using default `button` element.
   */
  asChild: boolean;
}

export type ButtonProps = StrictUnion<UnslottedButtonProps | SlottedButtonProps>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    asChild,
    className,
    variant = 'filled',
    color = 'secondary',
    size = 'medium',
    type,
    disabled = false,
    onClick,
    ...buttonProps
  } = props;

  const Component = asChild ? Slot : 'button';

  const nativeDisabled = asChild ? undefined : disabled;
  const ariaDisabled = asChild && disabled ? disabled : undefined;
  const role = asChild ? 'button' : undefined;
  const tabIndex = asChild && !disabled ? 0 : undefined;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
    } else {
      onClick?.(event);
    }
  };

  if (asChild && !children.props.children) {
    return null;
  }

  return (
    // eslint-disable-next-line react/forbid-elements
    <Component
      {...buttonProps}
      ref={ref}
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={clsx(
        'button',
        `button--${variant}`,
        `button--${color}`,
        `button--${size}`,
        { 'button--disabled': disabled },
        className
      )}
      disabled={nativeDisabled}
      role={role}
      tabIndex={tabIndex}
      aria-disabled={ariaDisabled}
      onClick={handleClick}
    >
      {children}
    </Component>
  );
});
