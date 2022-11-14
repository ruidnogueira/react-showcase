import { createContext } from '@/app/utils/context';
import { ReactNode, useMemo } from 'react';
import { constants, Constants } from './constants-config';
import { I18nConfig, i18nConfig } from './i18n-config';
import { storageKeys, StorageKeys } from './storage-config';
import { mergeDeepRight } from 'rambda';
import { PartialDeep } from 'type-fest';

/* TODO: add readme to each type of folder */

export interface GlobalConfig {
  i18nConfig: I18nConfig;
  storageKeys: StorageKeys;
  constants: Constants;
}

const [ConfigContextProvider, useConfig] = createContext<GlobalConfig>({
  contextName: 'ConfigContext',
  hookName: 'useConfig',
});

export { useConfig };

export function ConfigProvider({
  children,
  config,
}: {
  children: ReactNode;
  config?: PartialDeep<GlobalConfig>;
}) {
  const currentConfig: GlobalConfig = useMemo(() => {
    const defaultConfig = {
      i18nConfig,
      storageKeys,
      constants,
    };

    return config ? mergeDeepRight(defaultConfig, config) : defaultConfig;
  }, [config]);

  return <ConfigContextProvider value={currentConfig}>{children}</ConfigContextProvider>;
}
