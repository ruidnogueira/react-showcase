import { act, screen } from '@testing-library/react';
import { renderHook } from '@/test/helpers/render';
import { ToastProvider, useToast } from './toast-context';
import userEvent from '@testing-library/user-event';

test('renders when provider exists', () => {
  expect(() => renderHook(() => useToast(), { wrapper: ToastProvider })).not.toThrow();
});

test('throws error if provider is missing', () => {
  const logErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useToast())).toThrow();

  logErrorSpy.mockRestore();
});

test('opens a toast', () => {
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

  act(() => {
    result.current.open({ message: 'Example toast' });
  });

  const toast = screen.getByRole('alert');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent('Example toast');
});

test('closes a toast', () => {
  const onCloseMock = vi.fn();
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

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
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

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

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(onCloseMock).toHaveBeenCalledTimes(3);
});

test("calls onClose when toast's close button is clicked", async () => {
  const onCloseMock = vi.fn();
  const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

  act(() => {
    result.current.open({
      message: 'Example toast',
      isClosable: true,
      onClose: onCloseMock,
    });
  });

  await userEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('focuses the toast overlay when a hotkey is pressed', async () => {
  renderHook(() => useToast(), {
    wrapper: ({ children }) => <ToastProvider hotkeys={['F1']}>{children}</ToastProvider>,
  });

  const overlay = screen.getByTestId('toast-overlay');

  expect(overlay).not.toHaveFocus();

  await userEvent.keyboard('{F1}');

  expect(overlay).toHaveFocus();
});
