import '@testing-library/jest-dom';
import '../mocks/i18n';
import './mocks/dom-rect';
import './mocks/html-element';
import './mocks/location';
import './mocks/match-media';
import './mocks/pointer';
import './mocks/resize-observer';
import { toHaveNoViolations } from 'jest-axe';
import { mockServer } from '@/mocks/server/server';
import { config } from 'react-transition-group';
import { drop } from '@mswjs/data';
import { mockDatabase } from '@/mocks/server/database/database';
import { createMocks as createIdleTimerMocks } from 'react-idle-timer';
import { MessageChannel } from 'worker_threads';
import { deleteAllCookies } from './helpers/cookie';

expect.extend(toHaveNoViolations);

config.disabled = true;

vi.stubGlobal('MessageChannel', MessageChannel);

beforeAll(() => {
  mockServer.listen();

  createIdleTimerMocks();
});

afterEach(() => {
  vi.clearAllMocks();

  localStorage.clear();
  sessionStorage.clear();

  deleteAllCookies();

  mockServer.resetHandlers();
  drop(mockDatabase);
});

afterAll(() => {
  mockServer.close();
});
