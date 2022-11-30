import { ReactNode } from 'react';
import { RequireAtLeastOne } from 'type-fest';

export type ToastId = number | string;

export const ToastTypes = ['success', 'failure'] as const;
export type ToastType = typeof ToastTypes[number];

export const ToastPositions = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
] as const;
export type ToastPosition = typeof ToastPositions[number];

interface ToastConfigData {
  id: ToastId;
  message?: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  type?: ToastType;
  position: ToastPosition;
  duration?: number | null;
  isClosable?: boolean;
  className?: string;
  onClose: () => void;
}

export type ToastConfig = RequireAtLeastOne<ToastConfigData, 'title' | 'message'>;
