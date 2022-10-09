import { ApiAuthSession } from '@/app/types/auth';
import { rest } from 'msw';
import { RestResponseResolver } from '../types';

export function handleApiGetSession(resolver: RestResponseResolver<never, never, ApiAuthSession>) {
  return rest.get(`**/auth/session`, resolver);
}

// TODO
export const userHandlers = [
  handleApiGetSession((_req, res, ctx) => res(ctx.json({ name: 'example' }))),
];
