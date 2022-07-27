// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import { CSSProperties, ReactElement, ReactNode } from 'react';
import { usePortalContainer } from 'src/app/contexts/portal-container/portal-container';

export interface TooltipProps {
  children: ReactElement;
  className?: string;
  style?: CSSProperties;

  /**
   * The content of the tooltip.
   */
  content: ReactNode;

  /**
   * Whether the tooltip is open or not when the tooltip first renders.
   *
   * Use it when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /**
   * Whether the tooltip is open or not.
   *
   * Must be used in conjunction with `onOpenChange`.
   */
  isOpen?: boolean;

  /**
   * Event handler for when to open state of the tooltip changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Determines how much time it takes for the tooltip to open.
   */
  delayDuration?: number;

  /**
   * Affects the position of the tooltip.
   */
  side?: TooltipPrimitive.TooltipContentProps['side'];

  /**
   * Affects the position of the tooltip arrow.
   */
  align?: TooltipPrimitive.TooltipContentProps['align'];
}

export function Tooltip(props: TooltipProps) {
  const {
    children,
    content,
    defaultIsOpen,
    isOpen,
    onOpenChange,
    delayDuration,
    className,
    ...contentProps
  } = props;

  const portalContainer = usePortalContainer();

  return (
    <TooltipPrimitive.Root
      defaultOpen={defaultIsOpen}
      open={isOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal container={portalContainer}>
        <TooltipPrimitive.Content
          {...contentProps}
          className={clsx('tooltip', className)}
          sideOffset={5}
          collisionPadding={8}
        >
          {content}

          <TooltipPrimitive.Arrow className="tooltip__arrow" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export const TooltipProvider = TooltipPrimitive.Provider;
