import { useTranslation } from 'react-i18next';
import { Button } from '../button/button';
import styles from './service-worker-message.module.scss';

export type ServiceWorkerMessageType = 'offlineReady' | 'needRefresh';

export interface ServiceWorkerMessageProps {
  type: ServiceWorkerMessageType;
  onRefreshClick: () => void;
}

export function ServiceWorkerMessage(props: ServiceWorkerMessageProps) {
  const { type, onRefreshClick } = props;

  const { t } = useTranslation();

  return (
    <>
      <span>{t(`components.serviceWorkerMessage.${type}`)}</span>

      {type === 'needRefresh' && (
        <Button
          type="button"
          variant="link"
          color="primary"
          className={styles.updateButton}
          onClick={onRefreshClick}
        >
          {t('common.actions.update')}
        </Button>
      )}
    </>
  );
}
