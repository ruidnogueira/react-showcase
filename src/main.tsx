import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import './index.scss';
import urlJoin from 'url-join';
import { ServiceWorkerProvider } from './app/components/service-worker/service-worker-context';
import { BrowserRouter } from 'react-router-dom';
import { adjustPathSlashes } from './app/utils/path';
import { I18nProvider } from './app/contexts/i18n/i18n-context';
import { ConfigProvider } from './app/contexts/config/config-context';

if (import.meta.env.DEV && !import.meta.env.VITE_E2E) {
  const { worker } = await import('src/mocks/server/browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: urlJoin(import.meta.env.BASE_URL, 'mockServiceWorker.js'),
    },
  });
}

const baseName = adjustPathSlashes(import.meta.env.BASE_URL, {
  hasLeadingSlash: true,
  hasTrailingSlash: false,
});

createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <ServiceWorkerProvider>
      <BrowserRouter basename={baseName}>
        <ConfigProvider>
          <I18nProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </I18nProvider>
        </ConfigProvider>
      </BrowserRouter>
    </ServiceWorkerProvider>
  </StrictMode>
);
