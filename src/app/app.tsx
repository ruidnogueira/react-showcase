import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from 'src/assets/logo.svg';

export function App() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

  return (
    <div>
      <header>
        <Logo style={{ height: '100px', width: '100px' }} />

        <p>{t('common.hello')}</p>

        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
      </header>
    </div>
  );
}
