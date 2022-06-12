import { createContext } from 'src/app/utils/context';
import { ReactNode } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const [ServiceWorkerContextProvider, useServiceWorker] = createContext<
  ReturnType<typeof useRegisterSW>
>({
  contextName: 'ServiceWorkerContext',
  hookName: 'useServiceWorker',
});

export { useServiceWorker };

export function ServiceWorkerProvider({ children }: { children?: ReactNode }) {
  const value = useRegisterSW();
  return <ServiceWorkerContextProvider value={value}>{children}</ServiceWorkerContextProvider>;
}
