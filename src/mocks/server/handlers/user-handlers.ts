import { ApiAuthSession } from '@/app/types/auth';
import { rest } from 'msw';
import { mockDatabase } from '../database/database';
import { RestResponseResolver } from './handler-types';

export function handleApiGetSession(resolver: RestResponseResolver<never, never, ApiAuthSession>) {
  return rest.get(`**/auth/session`, resolver);
}

export const userHandlers = [
  handleApiGetSession((req, res, ctx) => {
    const { userId } = req.cookies;

    if (!userId) {
      return res(ctx.status(401));
    }

    const user = mockDatabase.user.findFirst({
      where: {
        id: {
          equals: Number(userId),
        },
      },
    });

    if (!user?.hasSession) {
      return res(ctx.status(404));
    }

    const data: ApiAuthSession = {
      id: user.id,
      username: user.username,
    };

    return res(ctx.json(data));
  }),
];
