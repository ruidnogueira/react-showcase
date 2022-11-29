import { XCircle } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components/button/button';
import styles from './unexpected-error-message.module.scss';

export function UnexpectedErrorMessage() {
  const { t } = useTranslation();

  const handleClick = () => {
    location.reload();
  };

  return (
    <div className={styles.error}>
      <XCircle className={styles.icon} />

      <h1>{t('errors.unexpected.title')}</h1>

      <p>{t('errors.unexpected.description')}</p>

      <Button type="button" color="primary" onClick={handleClick}>
        {t('errors.unexpected.reload')}
      </Button>
    </div>
  );
}
