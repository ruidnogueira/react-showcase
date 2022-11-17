import { useEffect, useMemo, useRef, useState } from 'react';
import { Portal } from '../portal/portal';
import { ToastConfig, ToastPosition } from './toast-types';
import clsx from 'clsx';
import { groupBy, toPairs } from 'rambda';
import { CSSTransition } from 'react-transition-group';
import { Toast } from './toast';

export interface ToastOverlayProps {
  toasts: ToastConfig[];
  hotkeys?: string[];
}

interface ToastContainerProps extends ToastConfig {
  enterDuration: number;
  exitDuration: number;
}

const groupToasts = groupBy<ToastConfig, { [key in ToastPosition]: ToastConfig[] }>(
  (toast) => toast.position
);

const defaultHotkeys = ['F8'];

export function ToastOverlay(props: ToastOverlayProps) {
  const { toasts, hotkeys = defaultHotkeys } = props;

  const { enterDuration, exitDuration } = useToastDurations();
  const { overlayRef } = useToastKeyboardNavigation(hotkeys);

  const positionToasts = useMemo(() => toPairs(groupToasts(toasts)), [toasts]);

  return (
    <Portal ref={overlayRef} tabIndex={-1} data-testid="toast-overlay">
      {positionToasts.map(([position, toasts]) => (
        <ol
          key={position}
          className={clsx('toast-section', `toast-section--${position}`)}
          data-testid={`toast-section-${position}`}
        >
          {toasts.map((toast) => (
            <ToastContainer
              {...toast}
              key={toast.id}
              enterDuration={enterDuration}
              exitDuration={exitDuration}
            />
          ))}
        </ol>
      ))}
    </Portal>
  );
}

function ToastContainer(props: ToastContainerProps) {
  const { id, message, position, onClose, enterDuration, exitDuration, ...toastProps } = props;

  const toastRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(true);

  const handleClose = () => setIsMounted(false);

  return (
    <li className="toast-container">
      <CSSTransition
        nodeRef={toastRef}
        in={isMounted}
        appear={true}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={{
          appear: enterDuration,
          exit: exitDuration,
        }}
        classNames={{
          appear: 'toast--enter',
          exit: 'toast--exit',
        }}
        onExited={onClose}
      >
        <Toast {...toastProps} ref={toastRef} onClose={handleClose}>
          {message}
        </Toast>
      </CSSTransition>
    </li>
  );
}

function useToastDurations() {
  return useMemo(() => {
    const rootStyles = window.getComputedStyle(document.documentElement);

    return {
      enterDuration: parseFloat(rootStyles.getPropertyValue('--toast-enter-duration')),
      exitDuration: parseFloat(rootStyles.getPropertyValue('--toast-exit-duration')),
    };
  }, []);
}

function useToastKeyboardNavigation(hotkeys: string[]) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (hotkeys.includes(key)) {
        overlayRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { overlayRef };
}
