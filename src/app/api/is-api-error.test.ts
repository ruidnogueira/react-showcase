import { ApiErrorResponse } from './api';
import { isApiStatusError } from './is-api-error';

test.each<[number | number[], ApiErrorResponse | Error]>([
  [400, { status: 400, data: null }],
  [[400, 500], { status: 400, data: null }],
  [[400, 500], { status: 500, data: null }],
])('is api error', (statuses, error) => {
  const result = isApiStatusError(statuses, error);
  expect(result).toBe(true);
});

test.each<[number | number[], ApiErrorResponse | Error]>([
  [400, new Error()],
  [400, { status: 500, data: null }],
  [[400, 500], { status: 401, data: null }],
])('is api error', (statuses, error) => {
  const result = isApiStatusError(statuses, error);
  expect(result).toBe(false);
});
