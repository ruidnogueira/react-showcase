import { ReactNode } from 'react';

export type ToastId = number | string;
export type ToastType = 'success' | 'failure';

export const ToastPositions = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
] as const;
export type ToastPosition = typeof ToastPositions[number];

export interface ToastConfig {
  id: ToastId;
  message: ReactNode;
  position: ToastPosition;
  duration?: number | null;
  isClosable?: boolean;
  onClose: () => void;
}
