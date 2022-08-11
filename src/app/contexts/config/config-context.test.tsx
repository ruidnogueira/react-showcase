import { ReactNode } from 'react';
import { renderHook } from 'src/test/helpers/render';
import { DeepPartial } from 'utility-types';
import { ConfigProvider, GlobalConfig, useConfig } from './config-context';

test('renders when provider exists', () => {
  expect(() => renderHook(() => useConfig(), { wrapper: ConfigProvider })).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useConfig())).toThrow();

  logErrorSpy.mockRestore();
});

test('merges provided config with default config', () => {
  const config: DeepPartial<GlobalConfig> = {
    i18nConfig: {
      supportedLanguages: [],
    },
  };

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ConfigProvider config={config}>{children}</ConfigProvider>
  );

  const { result } = renderHook(() => useConfig(), {
    wrapper: Wrapper,
  });

  expect(result.current.i18nConfig.supportedLanguages).toEqual([]);
});
