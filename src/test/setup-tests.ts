import '@testing-library/jest-dom';
import '../mocks/i18n';
import './mocks/dom-rect';
import './mocks/get-computed-style';
import './mocks/html-element';
import './mocks/location';
import './mocks/match-media';
import './mocks/resize-observer';
import { toHaveNoViolations } from 'jest-axe';
import { server } from 'src/mocks/server/server';
import { config } from 'react-transition-group';

expect.extend(toHaveNoViolations);

config.disabled = true;

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
