import clsx from 'clsx';
import { forwardRef } from 'react';
import { Button, ButtonProps } from '../button/button';
import { AccessibleIcon, AccessibleIconProps } from '../accessible-icon/accessible-icon';

export type IconButtonProps = ButtonProps;
export type IconButtonIconProps = AccessibleIconProps;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { className, ...buttonProps } = props;

  return <Button {...buttonProps} ref={ref} className={clsx('icon-button', className)} />;
});

export function IconButtonIcon(props: AccessibleIconProps) {
  const { className, ...iconProps } = props;

  return <AccessibleIcon {...iconProps} className={clsx('icon-button__icon', className)} />;
}

const IconButtonNamespace = Object.assign(IconButton, { Icon: IconButtonIcon });

export { IconButtonNamespace as IconButton };
