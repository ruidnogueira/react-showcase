import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from 'src/assets/logo.svg';
import styles from './app.module.scss';

export function App() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Logo className={styles.logo} />

        <p>{t('common.hello')}</p>

        <p>
          <button
            type="button"
            className={styles.button}
            onClick={() => setCount((count) => count + 1)}
          >
            count is: {count}
          </button>
        </p>
      </header>
    </div>
  );
}
