import { createContext } from '@/app/utils/context';

const [PortalContainerProvider, usePortalContainer] = createContext<HTMLElement | null>({
  hookName: 'PortalContainerProvider',
  contextName: 'usePortalContainer',
  isOptional: true,
});

export {
  /**
   * Allows to set where portals should append elements to.
   *
   * By default elements are appended to body.
   */
  PortalContainerProvider,

  /**
   * Gets the container element where portals should append elements to.
   */
  usePortalContainer,
};
