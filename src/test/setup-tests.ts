import '@testing-library/jest-dom';
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
