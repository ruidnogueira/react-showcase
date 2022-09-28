import { mockServer } from '@/mocks/server/server';
import { fromEitherLeft, fromEitherRight } from '@/test/helpers/either';
import { rest } from 'msw';
import { api, ApiErrorResponse } from './api';

const testCases = [
  ['get', api.get('/example')],
  ['delete', api.delete('/example')],
  ['post', api.post('/example')],
  ['patch', api.patch('/example')],
  ['put', api.put('/example')],
] as const;

test.each(testCases)('"%s" request succeeds', async (method, request) => {
  mockServer.use(
    rest[method]('**/example', (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json('example data'));
    })
  );

  const response = fromEitherRight(await request());

  expect(response.status).toBe(200);
  expect(response.data).toBe('example data');
});

test.each(testCases)('request fails with network error', async (method, request) => {
  mockServer.use(
    rest[method]('**/example', (_req, res, ctx) => {
      return res(ctx.status(400), ctx.json('example error'));
    })
  );

  const error = fromEitherLeft(await request()) as ApiErrorResponse;

  expect(error.status).toBe(400);
  expect(error.data).toBe('example error');
});
