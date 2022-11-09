import { act, screen } from '@testing-library/react';
import { renderHook } from '@/test/helpers/render';
import { ToastProvider, useToast } from './toast-context';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from '@/app/contexts/config/config-context';
import { ThemeProvider } from '@/app/features/theme/theme-context';
import { HelmetProvider } from 'react-helmet-async';

test('renders when provider exists', () => {
  expect(() => setup()).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useToast())).toThrow();

  logErrorSpy.mockRestore();
});

test('opens a toast', () => {
  const { result } = setup();

  act(() => {
    result.current.open({ message: 'Example toast' });
  });

  const toast = screen.getByRole('alert');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent('Example toast');
});

test('closes a toast', () => {
  const onCloseMock = vi.fn();
  const { result } = setup();

  act(() => {
    result.current.open({
      id: 'toast1',
      message: 'Example toast 1',
      onClose: onCloseMock,
    });

    result.current.open({
      id: 'toast2',
      message: 'Example toast 2',
      onClose: onCloseMock,
    });

    result.current.open({
      id: 'toast3',
      message: 'Example toast 3',
      onClose: onCloseMock,
    });
  });

  expect(screen.getAllByRole('alert')).toHaveLength(3);

  act(() => {
    result.current.close('toast2');
  });

  const toasts = screen.getAllByRole('alert');
  expect(toasts).toHaveLength(2);
  expect(toasts[0]).toHaveTextContent('Example toast 1');
  expect(toasts[1]).toHaveTextContent('Example toast 3');
  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('closes all toasts', () => {
  const onCloseMock = vi.fn();
  const { result } = setup();

  act(() => {
    result.current.open({
      message: 'Example toast 1',
      onClose: onCloseMock,
    });

    result.current.open({
      message: 'Example toast 2',
      onClose: onCloseMock,
    });

    result.current.open({
      message: 'Example toast 3',
      onClose: onCloseMock,
    });
  });

  expect(screen.getAllByRole('alert')).toHaveLength(3);

  act(() => {
    result.current.closeAll();
  });

  expect(onCloseMock).toHaveBeenCalledTimes(3);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test("calls onClose when toast's close button is clicked", async () => {
  const onCloseMock = vi.fn();
  const { result } = setup();

  act(() => {
    result.current.open({
      message: 'Example toast',
      isClosable: true,
      onClose: onCloseMock,
    });
  });

  await userEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(onCloseMock).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('focuses the toast overlay when a hotkey is pressed', async () => {
  setup({ hotkeys: ['F1'] });

  const overlay = screen.getByTestId('toast-overlay');

  expect(overlay).not.toHaveFocus();

  await userEvent.keyboard('{F1}');

  expect(overlay).toHaveFocus();
});

test('temporary toast does not have close button and closes when duration expires', () => {
  vi.useFakeTimers();

  const onCloseMock = vi.fn();
  const { result } = setup();

  act(() => {
    result.current.openTemporary({
      message: 'Example toast',
      onClose: onCloseMock,
    });
  });

  expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();

  act(() => {
    vi.runAllTimers();
  });

  expect(onCloseMock).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();

  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test('indefinite toast has close button and does not close when duration expires', async () => {
  vi.useFakeTimers();

  const onCloseMock = vi.fn();
  const { result } = setup();

  act(() => {
    result.current.openIndefinite({
      message: 'Example toast',
      onClose: onCloseMock,
    });
  });

  act(() => {
    vi.runAllTimers();
  });

  expect(onCloseMock).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Close' }), {
    advanceTimers: (delay) => vi.advanceTimersByTime(delay),
  });

  expect(onCloseMock).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();

  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function setup({ hotkeys }: { hotkeys?: string[] } = {}) {
  return renderHook(() => useToast(), {
    wrapper: ({ children }) => (
      <HelmetProvider>
        <ConfigProvider>
          <ThemeProvider>
            <ToastProvider hotkeys={hotkeys}>{children}</ToastProvider>
          </ThemeProvider>
        </ConfigProvider>
      </HelmetProvider>
    ),
  });
}
