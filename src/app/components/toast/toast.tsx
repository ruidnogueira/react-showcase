import { forwardRef, ReactNode, useState } from 'react';
import { IconButton, IconButtonIcon } from '../icon-button/icon-button';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { TFunction } from 'i18next';
import { CheckCircle, WarningCircle, X as CloseIcon } from 'phosphor-react';
import { useTimeout } from '@/app/hooks/use-timeout';
import { ToastType } from './toast-types';

export interface ToastProps {
  className?: string;

  children?: ReactNode;

  /**
   * The title of the toast
   */
  title?: ReactNode;

  /**
   * A custom icon for the toast
   */
  icon?: ReactNode;

  /**
   * Whether to show close button or not
   */
  isClosable?: boolean;

  /**
   * Time in miliseconds before toast is closed
   */
  duration?: number | null;

  /**
   * The type of the toast
   */
  type?: ToastType;

  /**
   * Callback when toast closes
   */
  onClose?: () => void;
}

interface ToastCardProps {
  className?: string;
  children: ReactNode;
  type?: ToastType;
  onMouseLeave: () => void;
  onMouseEnter: () => void;
}

interface ToastIconProps {
  type?: ToastType;
  icon?: ReactNode;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>((props, ref) => {
  const { className, children, isClosable, duration, title, type, onClose } = props;

  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  useTimeout(() => onClose?.(), isHovered ? null : duration);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <ToastCard
      ref={ref}
      className={className}
      type={type}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ToastIcon type={type} icon={props.icon} />

      {title && <div className="toast__title">{title}</div>}

      {children && <div className="toast__message">{children}</div>}

      {isClosable && <CloseButton t={t} onClose={onClose} />}
    </ToastCard>
  );
});

const ToastCard = forwardRef<HTMLDivElement, ToastCardProps>((props, ref) => {
  const { children, className, type, onMouseEnter, onMouseLeave } = props;

  return (
    <div
      ref={ref}
      role="alert"
      className={clsx('toast', { [`toast--${type}`]: type }, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
});

function ToastIcon(props: ToastIconProps) {
  const icon = pickToastIcon(props);

  return icon ? <div className="toast__icon">{icon}</div> : null;
}

function pickToastIcon(props: ToastIconProps) {
  const { type, icon } = props;

  if (icon) {
    return icon;
  }

  if (type === 'success') {
    return <CheckCircle weight="fill" />;
  }

  if (type === 'failure') {
    return <WarningCircle weight="fill" />;
  }

  return null;
}

function CloseButton({ t, onClose }: { t: TFunction; onClose?: () => void }) {
  return (
    <IconButton
      type="button"
      className="toast__close-button"
      size="small"
      isCustom={true}
      onClick={onClose}
    >
      <IconButtonIcon label={t('common.actions.close')}>
        <CloseIcon />
      </IconButtonIcon>
    </IconButton>
  );
}
