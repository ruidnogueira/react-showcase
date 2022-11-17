import { ReactNode } from 'react';
import { renderHook } from '@/test/helpers/render';
import { ConfigProvider, GlobalConfig, useConfig } from './config-context';
import { PartialDeep } from 'type-fest';

test('renders when provider exists', () => {
  expect(() => renderHook(() => useConfig(), { wrapper: ConfigProvider })).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useConfig())).toThrow();

  logErrorSpy.mockRestore();
});

test('merges provided config with default config', () => {
  const config: PartialDeep<GlobalConfig> = {
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
