import { renderHook } from 'src/test/helpers/render';
import { createContext } from './context';

const [TestProvider, useTest] = createContext<string>({
  contextName: 'TestContext',
  hookName: 'useTest',
});

test('renders when provider exists', () => {
  const value = 'test';

  const { result } = renderHook(() => useTest(), {
    wrapper: ({ children }) => <TestProvider value={value}>{children}</TestProvider>,
  });

  expect(result.current).toBe(value);
});

test('throws error if provider is missing', () => {
  expect(() => renderHook(() => useTest())).toThrow();
});
