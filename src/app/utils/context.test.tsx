import { renderHook } from '@/test/helpers/render';
import { createContext } from './context';

test('renders when provider exists', () => {
  const value = 'test';

  const [TestProvider, useTest] = createContext<string>({
    contextName: 'TestContext',
    hookName: 'useTest',
  });

  const { result } = renderHook(() => useTest(), {
    renderOptions: {
      wrapper: ({ children }) => <TestProvider value={value}>{children}</TestProvider>,
    },
  });

  expect(result.current).toBe(value);
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  const [, useTest] = createContext<string>({
    contextName: 'TestContext',
    hookName: 'useTest',
  });

  expect(() => renderHook(() => useTest())).toThrow();

  logErrorSpy.mockRestore();
});

test('renders if provider is missing when default value is provided', () => {
  const value = 'test';

  const [, useTest] = createContext<string>({
    contextName: 'TestContext',
    hookName: 'useTest',
    defaultValue: value,
  });

  const { result } = renderHook(() => useTest());

  expect(result.current).toBe(value);
});

test('renders if provider is missing when context is optional', () => {
  const [, useTest] = createContext<string>({
    contextName: 'TestContext',
    hookName: 'useTest',
    isOptional: true,
  });

  const { result } = renderHook(() => useTest());

  expect(result.current).toBeUndefined();
});
