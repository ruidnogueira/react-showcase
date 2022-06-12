import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import urlJoin from 'url-join';

declare let self: ServiceWorkerGlobalScope;

clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});

// redirect navigation requests to index.html
const fileExtensionExpression = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }

    if (url.pathname.startsWith('/_')) {
      return false;
    }

    if (fileExtensionExpression.exec(url.pathname)) {
      return false;
    }

    return true;
  },

  createHandlerBoundToURL(urlJoin(import.meta.env.BASE_URL, 'index.html'))
);

const i18nLocaleExpression = /locales\/.+\/.+\.json$/;
registerRoute(
  ({ url }) => url.origin === self.location.origin && i18nLocaleExpression.test(url.pathname),
  new NetworkFirst({
    cacheName: 'i18n',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

const fontsExpression = /\/.+\.(woff|woff2)/;
registerRoute(
  ({ url }) => url.origin === self.location.origin && fontsExpression.test(url.pathname),
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 365 })],
  })
);
