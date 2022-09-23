import { forwardRef, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';

/* TODO: test */

interface PortalProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Where the portal will be appended to.
   */
  container?: HTMLElement | null;
}

/**
 * Renders a React subtree in a different part of the DOM.
 * Appends to `document.body` by default.
 */
export const Portal = forwardRef<HTMLDivElement, PortalProps>((props, ref) => {
  const { container = document.body, ...portalProps } = props;
  return container ? createPortal(<div {...portalProps} ref={ref} />, container) : null;
});
