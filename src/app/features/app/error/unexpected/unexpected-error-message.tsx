import { XCircle } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components/button/button';
import styles from './unexpected-error-message.module.scss';

export interface UnexpectedErrorMessageProps {
  onReload: () => void;
}

export function UnexpectedErrorMessage(props: UnexpectedErrorMessageProps) {
  const { onReload } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.error} role="alert">
      <XCircle className={styles.icon} />

      <h1>{t('errors.unexpected.title')}</h1>

      <p>{t('errors.unexpected.description')}</p>

      <Button type="button" color="primary" onClick={onReload}>
        {t('errors.unexpected.reload')}
      </Button>
    </div>
  );
}
