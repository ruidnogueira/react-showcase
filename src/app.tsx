import { useState } from 'react';
import logo from './logo.svg';
import styles from './app.module.scss';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <p>Hello Vite + React!</p>

        <p>
          <button
            type="button"
            className={styles.button}
            onClick={() => setCount((count) => count + 1)}
          >
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
      </header>
    </div>
  );
}
