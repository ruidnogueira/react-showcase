import { renderWithProviders } from '@/test/helpers/render';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dispatch, SetStateAction } from 'react';

type EventState = [boolean, Dispatch<SetStateAction<boolean>>];

const useRegisterSWMock = vi.fn<
  never,
  {
    needRefresh: EventState;
    offlineReady: EventState;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  }
>();

vi.mock('virtual:pwa-register/react', () => ({ useRegisterSW: useRegisterSWMock }));

import { ServiceWorkerProvider } from './service-worker-context';
import { ServiceWorkerToast } from './service-worker-toast';

test('does not show toast', () => {
  setup({ offlineReady: false, needRefresh: false });

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('shows offline ready toast', () => {
  setup({ offlineReady: true, needRefresh: false });

  const toast = screen.getByRole('alert');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent('Ready to work offline');
});

test('shows need refresh toast', () => {
  setup({ offlineReady: false, needRefresh: true });

  const toast = screen.getByRole('alert');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent('A new version is available');
});

test('closes offline ready toast', () => {
  vi.useFakeTimers();

  const { setOfflineReadyMock } = setup({
    offlineReady: true,
    needRefresh: false,
  });

  act(() => {
    vi.runAllTimers();
  });

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(setOfflineReadyMock).toHaveBeenCalledTimes(1);
  expect(setOfflineReadyMock).toHaveBeenCalledWith(false);

  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test('closes need refresh toast', async () => {
  const { setNeedRefreshMock } = setup({
    offlineReady: false,
    needRefresh: true,
  });

  await userEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(setNeedRefreshMock).toHaveBeenCalledTimes(1);
  expect(setNeedRefreshMock).toHaveBeenCalledWith(false);
});

test('updates service worker', async () => {
  const { updateServiceWorkerMock } = setup({ offlineReady: false, needRefresh: true });

  await userEvent.click(screen.getByRole('button', { name: 'Update' }));

  expect(updateServiceWorkerMock).toHaveBeenCalledTimes(1);
  expect(updateServiceWorkerMock).toHaveBeenCalledWith(true);
});

function setup({ offlineReady, needRefresh }: { offlineReady: boolean; needRefresh: boolean }) {
  const setOfflineReadyMock = vi.fn();
  const setNeedRefreshMock = vi.fn();
  const updateServiceWorkerMock = vi.fn();

  useRegisterSWMock.mockImplementationOnce(() => ({
    offlineReady: [offlineReady, setOfflineReadyMock] as EventState,
    needRefresh: [needRefresh, setNeedRefreshMock] as EventState,
    updateServiceWorker: updateServiceWorkerMock,
  }));

  renderWithProviders(<ServiceWorkerToast />, { wrapper: ServiceWorkerProvider });

  return { setOfflineReadyMock, setNeedRefreshMock, updateServiceWorkerMock };
}
