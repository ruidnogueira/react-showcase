import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './index.scss';

if (import.meta.env.DEV && !import.meta.env.VITE_E2E) {
  const { worker } = await import('src/mocks/server/browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}

createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <App />
  </StrictMode>
);
