import { createContext } from 'src/app/utils/context';

const [PortalContainerProvider, usePortalContainer] = createContext<HTMLElement | null>({
  hookName: 'PortalContainerProvider',
  contextName: 'usePortalContainer',
  defaultValue: null,
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
