import { ReactNode, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/app/hooks/use-isomorphic-layout-effect';
import { createContext } from '@/app/utils/context';
import { uniqueId } from '@/app/utils/id';
import { ToastOverlay } from './toast-overlay';
import { ToastConfig, ToastId, ToastPosition } from './toast-types';
import { useConfig } from '@/app/core/config/config-context';
import { Except, SetOptional } from 'type-fest';

type ToastOptions = SetOptional<ToastConfig, 'position' | 'onClose' | 'id'>;
type TimedToastOptions = Except<ToastOptions, 'duration' | 'isClosable'>;
type TypedToastOptions = Except<TimedToastOptions, 'type'>;

export interface UseToastResponse {
  open: (options: ToastOptions) => void;

  /**
   * Opens a toast that closes after a set amount of time.
   */
  openTemporary: (options: TimedToastOptions) => void;
  /**
   * Opens a toast that only closes manually.
   */
  openIndefinite: (options: TimedToastOptions) => void;

  /**
   * Opens a toast that shows a success message
   */
  openSuccess: (options: TypedToastOptions) => void;
  /**
   * Opens a toast that shows a failure message
   */
  openFailure: (options: TypedToastOptions) => void;

  close: (id: ToastId) => void;
  closeAll: () => void;
}

export interface ToastProviderProps {
  children: ReactNode;
  /**
   * The position that the toast will appear at when no position is specified.
   */
  defaultPosition?: ToastPosition;
  /**
   * The keys that cause the toast overlay to be focused, for easy keyboard toast navigation.
   *
   * **Don't forget to inform users of the hotkeys.**
   */
  hotkeys?: string[];
}

const toastIdPrefix = 'toast';

const [ToastContextProvider, useToast] = createContext<UseToastResponse>({
  contextName: 'ToastContext',
  hookName: 'useToast',
});

export { useToast };

export function ToastProvider(props: ToastProviderProps) {
  const { children, defaultPosition, hotkeys } = props;

  const { toasts, actions } = useToastManager(defaultPosition);

  return (
    <>
      <ToastOverlay toasts={toasts} hotkeys={hotkeys} />
      <ToastContextProvider value={actions}>{children}</ToastContextProvider>
    </>
  );
}

function useToastManager(defaultPosition: ToastPosition = 'top-right') {
  const { constants } = useConfig();
  const defaultPositionRef = useRef<ToastPosition>(defaultPosition);
  const toastsRef = useRef<ToastConfig[]>([]);
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  useIsomorphicLayoutEffect(() => {
    defaultPositionRef.current = defaultPosition;
    toastsRef.current = toasts;
  });

  const actions = useMemo<UseToastResponse>(() => {
    const open = ({ position, id, onClose, ...options }: ToastOptions) => {
      const toastId = id || id === 0 ? id : uniqueId(toastIdPrefix);

      const toast: ToastConfig = {
        ...options,

        id: toastId,
        position: position ?? defaultPositionRef.current,

        onClose: () => {
          const toastsToKeep = toastsRef.current.filter((toast) => toast.id !== toastId);

          toastsRef.current = toastsToKeep;
          setToasts(toastsToKeep);

          onClose?.();
        },
      };

      setToasts((toasts) => toasts.concat(toast));
    };

    const openTemporary = (options: TimedToastOptions) =>
      open({ ...options, duration: constants.toastDuration });

    const openIndefinite = (options: TimedToastOptions) => open({ ...options, isClosable: true });

    return {
      open,
      openTemporary,
      openIndefinite,

      openSuccess: (options) => openTemporary({ ...options, type: 'success' }),
      openFailure: (options) => openIndefinite({ ...options, type: 'failure' }),

      close: (toastId) => {
        const toastsToKeep: ToastConfig[] = [];

        toastsRef.current.forEach((toast) => {
          if (toast.id === toastId) {
            toast.onClose();
          } else {
            toastsToKeep.push(toast);
          }
        });

        toastsRef.current = toastsToKeep;
        setToasts(toastsToKeep);
      },

      closeAll: () => {
        toastsRef.current.forEach((toast) => toast.onClose());
        toastsRef.current = [];
        setToasts([]);
      },
    };
  }, [constants.toastDuration]);

  return { toasts, actions };
}
