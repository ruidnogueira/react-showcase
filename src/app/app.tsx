import { useState } from 'react';
import { ReactComponent as Logo } from 'src/assets/logo.svg';
import styles from './app.module.scss';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Logo className={styles.logo} />

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
        <p>
          <a
            className={styles.link}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className={styles.link}
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}
