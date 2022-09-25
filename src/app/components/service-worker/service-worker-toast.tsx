import { useEffect } from 'react';
import { useToast } from '../toast/toast-context';
import { useServiceWorker } from './service-worker-context';
import { ServiceWorkerMessage, ServiceWorkerMessageType } from './service-worker-message';

export function ServiceWorkerToast() {
  const toast = useToast();

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useServiceWorker();

  const messageType = getMessageType(offlineReady, needRefresh);

  useEffect(() => {
    if (messageType) {
      const openToast = messageType === 'offlineReady' ? toast.openTemporary : toast.openIndefinite;

      openToast({
        position: 'bottom',

        message: (
          <ServiceWorkerMessage
            type={messageType}
            onRefreshClick={() => void updateServiceWorker(true)}
          />
        ),

        onClose: () => {
          setOfflineReady(false);
          setNeedRefresh(false);
        },
      });
    }
  }, [toast, messageType, updateServiceWorker, setOfflineReady, setNeedRefresh]);

  return null;
}

function getMessageType(
  offlineReady: boolean,
  needRefresh: boolean
): ServiceWorkerMessageType | null {
  if (offlineReady) return 'offlineReady';
  if (needRefresh) return 'needRefresh';

  return null;
}
