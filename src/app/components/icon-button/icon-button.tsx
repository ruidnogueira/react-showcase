import clsx from 'clsx';
import { forwardRef } from 'react';
import { Button, ButtonProps } from '../button/button';
import { Icon, IconProps } from '../icon/icon';

export type IconButtonProps = ButtonProps;
export type IconButtonIconProps = IconProps;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { className, ...buttonProps } = props;

  return <Button {...buttonProps} ref={ref} className={clsx('icon-button', className)} />;
});

export function IconButtonIcon(props: IconProps) {
  const { className, ...iconProps } = props;

  return <Icon {...iconProps} className={clsx('icon-button__icon', className)} />;
}

const IconButtonNamespace = Object.assign(IconButton, { Icon: IconButtonIcon });

export { IconButtonNamespace as IconButton };
