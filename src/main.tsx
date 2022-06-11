import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './index.scss';
import urlJoin from 'url-join';

if (import.meta.env.DEV && !import.meta.env.VITE_E2E) {
  const { worker } = await import('src/mocks/server/browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: urlJoin(import.meta.env.BASE_URL, 'mockServiceWorker.js'),
    },
  });
}

createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <App />
  </StrictMode>
);
