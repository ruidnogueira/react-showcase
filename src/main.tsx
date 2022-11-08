import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import urlJoin from 'url-join';
import { ServiceWorkerProvider } from './app/components/service-worker/service-worker-context';
import { BrowserRouter } from 'react-router-dom';
import { adjustPathSlashes } from './app/utils/path';
import { I18nProvider } from './app/contexts/i18n/i18n-context';
import { ConfigProvider } from './app/contexts/config/config-context';
import './styles/styles.scss';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './app/contexts/theme/theme-context';
import { ErrorBoundary } from 'react-error-boundary';
import { UnexpectedErrorMessage } from './app/components/error/unexpected/unexpected-error-message';
import { ServiceWorkerToast } from './app/components/service-worker/service-worker-toast';
import { ApiClientProvider } from './app/api/api-client-context';
import { ApiProvider } from './app/api/api-context';
import { ToastProvider } from './app/components/toast/toast-context';
import { ErrorProvider } from './app/modules/error/error-context';
import { AuthProvider } from './app/modules/auth/auth-context';

if (import.meta.env.DEV && !import.meta.env.VITE_E2E) {
  const { mockWorker } = await import('@/mocks/server/browser');

  await mockWorker.start({
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
        <HelmetProvider>
          <ConfigProvider>
            <I18nProvider>
              <ThemeProvider>
                <ToastProvider>
                  <ErrorProvider>
                    <ApiClientProvider>
                      <ApiProvider>
                        <ErrorBoundary fallback={<UnexpectedErrorMessage />}>
                          <AuthProvider>
                            <Suspense fallback={<div>Loading...</div>}>
                              <App />

                              {import.meta.env.VITE_E2E !== 'true' && <ServiceWorkerToast />}
                            </Suspense>
                          </AuthProvider>
                        </ErrorBoundary>
                      </ApiProvider>
                    </ApiClientProvider>
                  </ErrorProvider>
                </ToastProvider>
              </ThemeProvider>
            </I18nProvider>
          </ConfigProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ServiceWorkerProvider>
  </StrictMode>
);
