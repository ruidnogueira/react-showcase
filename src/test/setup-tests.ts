import '@testing-library/jest-dom';
import '../mocks/i18n';
import './mocks/dom-rect';
import './mocks/get-computed-style';
import './mocks/location';
import './mocks/match-media';
import './mocks/resize-observer';
import { toHaveNoViolations } from 'jest-axe';
import { server } from 'src/mocks/server/server';

expect.extend(toHaveNoViolations);

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
