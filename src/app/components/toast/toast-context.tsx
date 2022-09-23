import { ReactNode, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'src/app/hooks/use-isomorphic-layout-effect';
import { createContext } from 'src/app/utils/context';
import { uniqueId } from 'src/app/utils/id';
import { ToastOverlay } from './toast-overlay';
import { ToastConfig, ToastId, ToastPosition } from './toast-types';

interface ToastOptions {
  message: ReactNode;
  id?: ToastId;
  position?: ToastPosition;
  duration?: number | null;
  isClosable?: boolean;
  onClose?: () => void;
}

interface ToastMethods {
  open: (options: ToastOptions) => void;
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

const [ToastContextProvider, useToast] = createContext<ToastMethods>({
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
  const defaultPositionRef = useRef<ToastPosition>(defaultPosition);
  const toastsRef = useRef<ToastConfig[]>([]);
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  useIsomorphicLayoutEffect(() => {
    defaultPositionRef.current = defaultPosition;
    toastsRef.current = toasts;
  });

  const actions = useMemo<ToastMethods>(() => {
    return {
      open: ({ position, id, onClose, ...options }) => {
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
      },

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
  }, []);

  return { toasts, actions };
}
