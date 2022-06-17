import '@testing-library/jest-dom';
import './mocks/i18n';
import './mocks/match-media';

import { server } from 'src/mocks/server/server';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  vi.clearAllMocks();

  localStorage.clear();
  sessionStorage.clear();

  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
