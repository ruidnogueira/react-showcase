import { useMemo, useRef, useState } from 'react';
import { Portal } from '../portal/portal';
import { ToastConfig, ToastPosition } from './toast-types';
import clsx from 'clsx';
import { groupBy, toPairs } from 'rambda';
import { CSSTransition } from 'react-transition-group';
import { Toast } from './toast';

export interface ToastOverlayProps {
  toasts: ToastConfig[];
}

interface ToastContainerProps extends ToastConfig {
  enterDuration: number;
  exitDuration: number;
}

const groupToasts = groupBy<ToastConfig, { [key in ToastPosition]: ToastConfig[] }>(
  (toast) => toast.position
);

export function ToastOverlay(props: ToastOverlayProps) {
  const { toasts } = props;

  const positionToasts = useMemo(() => toPairs(groupToasts(toasts)), [toasts]);

  const { enterDuration, exitDuration } = useMemo(() => {
    const rootStyles = window.getComputedStyle(document.documentElement);

    return {
      enterDuration: parseFloat(rootStyles.getPropertyValue('--toast-enter-duration')),
      exitDuration: parseFloat(rootStyles.getPropertyValue('--toast-exit-duration')),
    };
  }, []);

  return (
    <Portal>
      <>
        {positionToasts.map(([position, toasts]) => (
          <ul
            key={position}
            id={`toast-section-${position}`}
            className={clsx('toast-section', `toast-section--${position}`)}
          >
            {toasts.map((toast) => (
              <ToastContainer
                {...toast}
                key={toast.id}
                enterDuration={enterDuration}
                exitDuration={exitDuration}
              />
            ))}
          </ul>
        ))}
      </>
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
